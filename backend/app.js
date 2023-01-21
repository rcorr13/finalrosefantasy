const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');
const router = express.Router();
const validateRegisterInput = require('./validation/register');
const validateLoginInput = require('./validation/login');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const ContestantBackendSchema = require('./models/ContestantBackend');
const UserSchema = require('./models/User');
const LogisticsSchema = require('./models/Logistics');
const path = require('path');
const MasterSchema = require("./models/Master");

function makeNewConnection(uri) {
    const db = mongoose.createConnection(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    db.on('error', function (error) {
        console.log(`MongoDB :: connection ${this.name} ${JSON.stringify(error)}`);
        db.close().catch(() => console.log(`MongoDB :: failed to close connection ${this.name}`));
    });

    db.on('connected', function () {
        mongoose.set('debug', function (col, method, query, doc) {
            console.log(`MongoDB :: ${this.conn.name} ${col}.${method}(${JSON.stringify(query)},${JSON.stringify(doc)})`);
        });
        console.log(`MongoDB :: connected ${this.name}`);
    });

    db.on('disconnected', function () {
        console.log(`MongoDB :: disconnected ${this.name}`);
    });

    return db;
}

// connects to MongoDB cluster and gets collections
//const uri = "mongodb+srv://rlcorr:m4I7RnsHNdkHqSGj@finalrosefantasydemo.zqsrj.mongodb.net/finalrosedemo?retryWrites=true&w=majority"
const uri = "mongodb+srv://rlcorr:vdACKEmntdQdxDfq@finalrosefantasy.arty4.mongodb.net/finalrose?retryWrites=true&w=majority";
const mongooseConnection = makeNewConnection(uri);

const User = mongooseConnection.model('users', UserSchema);
const Contestants = mongooseConnection.model('contestants', ContestantBackendSchema);
const Logistics = mongooseConnection.model('logistics', LogisticsSchema);
const Master = mongooseConnection.model('master', MasterSchema);

// authentication design based on code from
// https://www.designmycodes.com/react/reactjs-redux-nodejs-mongodb-jwt-authentication-tutorial.html
const app = express();
app.use(cors());
app.use(passport.initialize());
require('./passport')(passport);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


router.post('/register', function(req, res) {

    const { errors, isValid } = validateRegisterInput(req.body);

    if(!isValid) {
        return res.status(400).json(errors);
    }
    User.findOne({
        email: req.body.email
    }).then(user => {
        if(user) {
            return res.status(400).json({
                email: 'Email already exists'
            });
        }
        else {
            const newUser = new User({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: req.body.password,
            });

            bcrypt.genSalt(10, (err, salt) => {
                if(err) console.error('There was an error', err);
                else {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) console.error('There was an error', err);
                        else {
                            newUser.password = hash;
                            newUser
                                .save()
                                .then(user => {
                                    res.json(user)
                                });
                        }
                    });
                }
            });
        }
    });
});

router.post('/login', (req, res) => {

    const { errors, isValid } = validateLoginInput(req.body);

    if(!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email})
        .then(user => {
            if(!user) {
                errors.email = 'User not found'
                return res.status(404).json(errors);
            }
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(isMatch) {
                        const payload = {
                            id: user.id,
                            firstname: user.firstname,
                            lastname: user.lastname,
                            contestants: user.contestants,
                            picks: user.picks,
                        }
                        jwt.sign(payload, 'secret', {
                            expiresIn: 3600
                        }, (err, token) => {
                            if(err) console.error('There is some error in token', err);
                            else {
                                res.json({
                                    success: true,
                                    token: `Bearer ${token}`
                                });
                            }
                        });
                    }
                    else {
                        errors.password = 'Incorrect Password';
                        return res.status(400).json(errors);
                    }
                });
        });
});

router.put('/updatepassword', (req, res) => {
    console.log(req.body)

    const { errors, isValid } = validateChangePasswordInput(req.body);

    if(!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({
        email: req.body.email
    }, (err, user) => {
        if (err) {
            return res.send(err);
        }

        let newPassword = req.body.newPassword;
        bcrypt.genSalt(10, (err, salt) => {
            if (err) console.error('There was an error', err);
            else {
                bcrypt.hash(newPassword, salt, (err, hash) => {
                    if (err) console.error('There was an error', err);
                    else {
                        user.password = hash;
                        user
                            .save()
                            .then(user => {
                                console.log(user)
                                res.json(user)
                            });
                    }
                });
            }


        });
    })});

app.use('/api', router);

app.get('/users', async (req, res) => {
    const users = await User.find({});
    res.json(users);
});

app.get('/contestants', async (req, res) => {
    const contestants = await Contestants.find({});
    res.json(contestants);
});

app.get('/masters', async (req, res) => {
    const contestants = await Master.find({});
    res.json(contestants);
});

app.post('/addcontestant', async (req, res) => {
    let contestantInfo = new Contestants(req.body);
    contestantInfo.save()
        .then(contestantInfo => {
            res.status(200).json({'contestantInfo': 'contestantInfo added successfully'});
        })
        .catch(err => {
            res.status(400).send(contestantInfo);
        });
});

app.get('/logistics', async (req, res) => {
    const logistics = await Logistics.find({});
    res.json(logistics);
});

app.get('/users/:season', async (req, res) => {
    let seasonUsers = []
    Logistics.findOne({ season: req.params.season})
        .then(logistics => {
            User.find({"firstname" : { $in : logistics.users}})
                .then(users => {
                    users.forEach(user => {
                        let picksAndTeamsAll = user.picksAndTeams
                        let seasonData = picksAndTeamsAll.filter(item => item.season === req.params.season)[0]
                        const userRow = {
                            id: user.id,
                            firstname: user.firstname,
                            lastname: user.lastname,
                            email: user.email,
                            password: user.password,
                            season: req.params.season,
                            totalpoints: seasonData.totalpoints,
                            picks: seasonData.picks,
                            week1total: seasonData.week1total,
                            week1team: seasonData.week1team,
                            week2total: seasonData.week2total,
                            week2team: seasonData.week2team,
                            week3total: seasonData.week3total,
                            week3team: seasonData.week3team,
                            week4total: seasonData.week4total,
                            week4team: seasonData.week4team,
                            week5total: seasonData.week5total,
                            week5team: seasonData.week5team,
                            week6total: seasonData.week6total,
                            week6team: seasonData.week6team,
                            week7total: seasonData.week7total,
                            week7team: seasonData.week7team,
                            week8total: seasonData.week8total,
                            week8team: seasonData.week8team,
                            week9team: seasonData.week9team,
                            week9total: seasonData.week9total,
                            week10total: seasonData.week10total,
                            week10team: seasonData.week10team,
                            week11total: seasonData.week11total,
                            week11team: seasonData.week11team,
                            week12total: seasonData.week12total,
                            week12team: seasonData.week12team,
                            week13total: seasonData.week13total,
                            week13team: seasonData.week13team,
                            week14total: seasonData.week14total,
                            week14team: seasonData.week14team,
                            week15total: seasonData.week15total,
                            week15team: seasonData.week15team,
                            week16total: seasonData.week16total,
                            week16team: seasonData.week16team,
                        }
                        seasonUsers.push(userRow)
                    })
                    res.json(seasonUsers)
                })
                .catch(err => {
                    res.json(err);
                })
        .catch(err => {
            res.json(err);
        });
        });
});

app.put('/updatelogistics', (req, res) => {
    Logistics.findOneAndReplace({"_id": req.body.updatedLogistics._id}, req.body.updatedLogistics, {returnOriginal: false})
        .then((err, result) => {
            if (err) {
                res.send(err);
            } else {
                return res.json(result);
            };
        })})

app.put('/updatemaster', (req, res) => {
    Master.findOneAndReplace({"currentSeason": req.body.updatedMaster.currentSeason}, req.body.updatedMaster, {returnOriginal: false})
        .then((err, result) => {
            if (err) {
                res.send(err);
            } else {
                return res.json(result);
            };
        })})


app.put('/updateuser/:_id', (req, res) => {
    User.findOneAndReplace({_id: req.params._id}, req.body.updatedUser, {returnOriginal: false})
        .then(result => {
            return res.json(result);
            })
        .catch(err => {
            return res.json(err);
        });
})

app.put('/updateuser/:season/:_id', (req, res) => {
    const seasonData = req.body.updatedUser
    const picksAndTeamsNew = {
        picks: seasonData.picks,
        season: seasonData.season,
        week1total: seasonData.week1total,
        week1team: seasonData.week1team,
        week2total: seasonData.week2total,
        week2team: seasonData.week2team,
        week3total: seasonData.week3total,
        week3team: seasonData.week3team,
        week4total: seasonData.week4total,
        week4team: seasonData.week4team,
        week5total: seasonData.week5total,
        week5team: seasonData.week5team,
        week6total: seasonData.week6total,
        week6team: seasonData.week6team,
        week7total: seasonData.week7total,
        week7team: seasonData.week7team,
        week8total: seasonData.week8total,
        week8team: seasonData.week8team,
        week9team: seasonData.week9team,
        week9total: seasonData.week9total,
        week10total: seasonData.week10total,
        week10team: seasonData.week10team,
        week11total: seasonData.week11total,
        week11team: seasonData.week11team,
        week12total: seasonData.week12total,
        week12team: seasonData.week12team,
        week13total: seasonData.week13total,
        week13team: seasonData.week13team,
        week14total: seasonData.week14total,
        week14team: seasonData.week14team,
        week15total: seasonData.week15total,
        week15team: seasonData.week15team,
        week16total: seasonData.week16total,
        week16team: seasonData.week16team,
        totalpoints: (parseInt(seasonData.week1total)+parseInt(seasonData.week2total)+parseInt(seasonData.week3total)+parseInt(seasonData.week4total)+parseInt(seasonData.week5total)+parseInt(seasonData.week6total)+parseInt(seasonData.week7total)+parseInt(seasonData.week8total)+parseInt(seasonData.week9total)+parseInt(seasonData.week10total)+parseInt(seasonData.week11total)+parseInt(seasonData.week12total)+parseInt(seasonData.week13total)+parseInt(seasonData.week14total)+parseInt(seasonData.week15total)+parseInt(seasonData.week16total))
    }
    //console.log(updatedSeasonData)
    User.findOne({ _id: req.params._id})
        .then(user => {
            let picksAndTeamsAll = user.picksAndTeams.filter(seasonInfo => seasonInfo.season != req.params.season);
            picksAndTeamsAll.push(picksAndTeamsNew)
            console.log(picksAndTeamsAll)
            User.findOneAndUpdate(
                {_id: req.params._id},
                {picksAndTeams: picksAndTeamsAll},
                {returnOriginal: false}
            )
            .then(result => {
                console.log(result)
                return res.json(result);
            })
                .catch(err => {
                    console.log(err)
                    return res.json(err);
                });
        })
        .catch(err => {
            console.log(err)
            return res.json(err);
        });
})

app.put('/updatecontestant/:nameLink', (req, res) => {
    Contestants.findOneAndReplace({nameLink: req.params.nameLink}, req.body.updatedContestant, {returnOriginal: false})
        .then((err, result) => {
            if (err) {
                res.send(err);
            } else {
                return res.json(result);
            };
        })})

app.delete('/delete/:nameLink', (req, res) => {
    Contestants.findOneAndDelete({nameLink: req.params.nameLink})
        .then((err, result) => {
            if (err) {
                res.send(err);
            } else {
                return res.json(result);
            }
        })
    })


app.put('/setCurrentWeek/:currentWeek', (req, res) => {
    Logistics.findOneAndUpdate({_id: req.params._id}, {currentWeek: req.body.currentWeek}, {returnOriginal: false, new: true})
        .then((err, result) => {
            if (err) {
                res.send(err);
            } else {
                return res.json(result);
            };
        })
});

if (process.env.NODE_ENV === "production") {
    app.use(express.static("../build"));
}

let usingHeroku = true;

if (usingHeroku) {
    app.get('*', (req, res) => res.sendFile(path.resolve('../build', 'index.html')));
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});
