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


//const mongooseConnection = makeNewConnection('mongodb://127.0.0.1:27017/finalrose');
const uri = "mongodb+srv://rlcorr:m4I7RnsHNdkHqSGj@finalrosefantasy.arty4.mongodb.net/finalrose?retryWrites=true&w=majority";
const mongooseConnection = makeNewConnection(uri);

const User = mongooseConnection.model('users', UserSchema);
const Contestants = mongooseConnection.model('contestants', ContestantBackendSchema);
const Logistics = mongooseConnection.model('logistics', LogisticsSchema);

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

router.route('/update/:id').put((req, res, next) => {
    User.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, (error, data) => {
        if (error) {
            return next(error);
            console.log(error)
        } else {
            res.json(data)
            console.log('User updated successfully !')
            res.redirect('/users')
        }
    })
})


firstRun = false;
if (firstRun) {

    Contestants.deleteMany({ status: 'on' }, function (err) {
        if(err) console.log(err);
        console.log("Successful deletion");
    });

    Logistics.deleteMany({ currentWeek: '1' }, function (err) {
        if(err) console.log(err);
        console.log("Successful deletion");
    });

    Contestants.insertMany([
        {nameLink: 'AJ', name: 'AJ', age: '28', job: 'Software Salesman', city: 'Playa Del Rey', stateUS: 'CA', status: 'on', imageLink: 'https://cdn1.edgedatg.com/aws/v2/abc/TheBachelorette/person/3529328/d0031072d7e281e62ae8c458e1db7c8c/330x330-Q90_d0031072d7e281e62ae8c458e1db7c8c.jpg', totalpoints: '0', week1points: '0', week1actions:[], week2points: '0', week2actions: [], week3points: '0', week3actions:[], week4points: '0', week4actions: [], week5points: '0', week5actions:[], week6points: '0', week6actions: [], week7points: '0', week7actions:[], week8points: '0', week8actions: [], week9points: '0', week9actions:[], week10points: '0', week10actions: [], oneTimeActions: []},
        {nameLink: 'Ben', name: 'Ben', age: '29', job: 'Army Ranger Veteran', city: 'Venice', stateUS: 'CA', status: 'on', imageLink: 'https://cdn1.edgedatg.com/aws/v2/abc/TheBachelorette/person/3529329/d39f47e0fc6cffac38608135517d6257/330x330-Q90_d39f47e0fc6cffac38608135517d6257.jpg', totalpoints: '0', week1points: '0', week1actions:[], week2points: '0', week2actions: [], week3points: '0', week3actions:[], week4points: '0', week4actions: [], week5points: '0', week5actions:[], week6points: '0', week6actions: [], week7points: '0', week7actions:[], week8points: '0', week8actions: [], week9points: '0', week9actions:[], week10points: '0', week10actions: [], oneTimeActions: []},
        {nameLink: 'Bennett', name: 'Bennett', age: '36', job: 'Wealth Management Consultant', city: 'New York City', stateUS: 'NY', status: 'on', imageLink: 'https://cdn1.edgedatg.com/aws/v2/abc/TheBachelorette/person/3529330/f48989b77871d8da13dba4542b303588/330x330-Q90_f48989b77871d8da13dba4542b303588.jpg', totalpoints: '0', week1points: '0', week1actions:[], week2points: '0', week2actions: [], week3points: '0', week3actions:[], week4points: '0', week4actions: [], week5points: '0', week5actions:[], week6points: '0', week6actions: [], week7points: '0', week7actions:[], week8points: '0', week8actions: [], week9points: '0', week9actions:[], week10points: '0', week10actions: [], oneTimeActions: []},
        {nameLink: 'Blake-Monar', name: 'Blake Monar', age: '31', job: 'Male Grooming Specialist', city: 'Phoenix', stateUS: 'AZ', status: 'on', imageLink: 'https://cdn1.edgedatg.com/aws/v2/abc/TheBachelorette/person/3529331/3449b2393e94796c1ce4a5c582a74506/330x330-Q90_3449b2393e94796c1ce4a5c582a74506.jpg', totalpoints: '0', week1points: '0', week1actions:[], week2points: '0', week2actions: [], week3points: '0', week3actions:[], week4points: '0', week4actions: [], week5points: '0', week5actions:[], week6points: '0', week6actions: [], week7points: '0', week7actions:[], week8points: '0', week8actions: [], week9points: '0', week9actions:[], week10points: '0', week10actions: [], oneTimeActions: []},
        {nameLink: 'Blake-Moynes', name: 'Blake Moynes', age: '29', job: 'Wildlife Manager', city: 'Hamilton', stateUS: 'Ontario', status: 'on', imageLink: 'https://cdn1.edgedatg.com/aws/v2/abc/TheBachelorette/person/3529332/7e42ff84c661c1bdcae902af0ffdcbaa/330x330-Q90_7e42ff84c661c1bdcae902af0ffdcbaa.jpg', totalpoints: '0', week1points: '0', week1actions:[], week2points: '0', week2actions: [], week3points: '0', week3actions:[], week4points: '0', week4actions: [], week5points: '0', week5actions:[], week6points: '0', week6actions: [], week7points: '0', week7actions:[], week8points: '0', week8actions: [], week9points: '0', week9actions:[], week10points: '0', week10actions: [], oneTimeActions: []},
        {nameLink: 'Brandon', name: 'Brandon', age: '28', job: 'Real Estate Agent', city: 'Cleveland', stateUS: 'OH', status: 'on', imageLink: 'https://cdn1.edgedatg.com/aws/v2/abc/TheBachelorette/person/3529334/767df4060d7d22e37cdae51ae939e8ea/330x330-Q90_767df4060d7d22e37cdae51ae939e8ea.jpg', totalpoints: '0', week1points: '0', week1actions:[], week2points: '0', week2actions: [], week3points: '0', week3actions:[], week4points: '0', week4actions: [], week5points: '0', week5actions:[], week6points: '0', week6actions: [], week7points: '0', week7actions:[], week8points: '0', week8actions: [], week9points: '0', week9actions:[], week10points: '0', week10actions: [], oneTimeActions: []},
        {nameLink: 'Brendan', name: 'Brendan', age: '30', job: 'Commercial Roofer', city: 'Milford', stateUS: 'MA', status: 'on', imageLink: 'https://cdn1.edgedatg.com/aws/v2/abc/TheBachelorette/person/3529336/3944712b16b2d99bddf11d36474a8fa0/330x330-Q90_3944712b16b2d99bddf11d36474a8fa0.jpg', totalpoints: '0', week1points: '0', week1actions:[], week2points: '0', week2actions: [], week3points: '0', week3actions:[], week4points: '0', week4actions: [], week5points: '0', week5actions:[], week6points: '0', week6actions: [], week7points: '0', week7actions:[], week8points: '0', week8actions: [], week9points: '0', week9actions:[], week10points: '0', week10actions: [], oneTimeActions: []},
        {nameLink: 'Chasen', name: 'Chasen', age: '31', job: 'IT Account Executive', city: 'San Diego', stateUS: 'CA', status: 'on', imageLink: 'https://cdn1.edgedatg.com/aws/v2/abc/TheBachelorette/person/3529338/7d3b91f31fffd1d64d2b7cf59f710d5f/330x330-Q90_7d3b91f31fffd1d64d2b7cf59f710d5f.jpg', totalpoints: '0', week1points: '0', week1actions:[], week2points: '0', week2actions: [], week3points: '0', week3actions:[], week4points: '0', week4actions: [], week5points: '0', week5actions:[], week6points: '0', week6actions: [], week7points: '0', week7actions:[], week8points: '0', week8actions: [], week9points: '0', week9actions:[], week10points: '0', week10actions: [], oneTimeActions: []},
        {nameLink: 'Chris', name: 'Chris', age: '27', job: 'Landscape Design Salesman', city: 'Salt Lake City', stateUS: 'UT', status: 'on', imageLink: 'https://cdn1.edgedatg.com/aws/v2/abc/TheBachelorette/person/3529339/845eb05085786f3c289f4006002178c5/330x330-Q90_845eb05085786f3c289f4006002178c5.jpg', totalpoints: '0', week1points: '0', week1actions:[], week2points: '0', week2actions: [], week3points: '0', week3actions:[], week4points: '0', week4actions: [], week5points: '0', week5actions:[], week6points: '0', week6actions: [], week7points: '0', week7actions:[], week8points: '0', week8actions: [], week9points: '0', week9actions:[], week10points: '0', week10actions: [], oneTimeActions: []},
        {nameLink: 'Dale', name: 'Dale', age: '31', job: 'Former Pro Football Wide Receiver', city: 'Brandon', stateUS: 'SD', status: 'on', imageLink: 'https://cdn1.edgedatg.com/aws/v2/abc/TheBachelorette/person/3529340/ea081126d1689a55a08b063aa0e0aa86/330x330-Q90_ea081126d1689a55a08b063aa0e0aa86.jpg', totalpoints: '0', week1points: '0', week1actions:[], week2points: '0', week2actions: [], week3points: '0', week3actions:[], week4points: '0', week4actions: [], week5points: '0', week5actions:[], week6points: '0', week6actions: [], week7points: '0', week7actions:[], week8points: '0', week8actions: [], week9points: '0', week9actions:[], week10points: '0', week10actions: [], oneTimeActions: []},
        {nameLink: 'Demar', name: 'Demar', age: '26', job: 'Spin Cycling Instructor', city: 'Scottsdale', stateUS: 'AZ', status: 'on', imageLink: 'https://cdn1.edgedatg.com/aws/v2/abc/TheBachelorette/person/3529343/e4c84b50da2704797d5579eee66bec4b/330x330-Q90_e4c84b50da2704797d5579eee66bec4b.jpg', totalpoints: '0', week1points: '0', week1actions:[], week2points: '0', week2actions: [], week3points: '0', week3actions:[], week4points: '0', week4actions: [], week5points: '0', week5actions:[], week6points: '0', week6actions: [], week7points: '0', week7actions:[], week8points: '0', week8actions: [], week9points: '0', week9actions:[], week10points: '0', week10actions: [], oneTimeActions: []},
        {nameLink: 'Eazy', name: 'Eazy', age: '29', job: 'Sports Marketing Agent', city: 'Newport Beach', stateUS: 'CA', status: 'on', imageLink: 'https://cdn1.edgedatg.com/aws/v2/abc/TheBachelorette/person/3529344/125b88352c867821c152885c7fe56e7f/330x330-Q90_125b88352c867821c152885c7fe56e7f.jpg', totalpoints: '0', week1points: '0', week1actions:[], week2points: '0', week2actions: [], week3points: '0', week3actions:[], week4points: '0', week4actions: [], week5points: '0', week5actions:[], week6points: '0', week6actions: [], week7points: '0', week7actions:[], week8points: '0', week8actions: [], week9points: '0', week9actions:[], week10points: '0', week10actions: [], oneTimeActions: []},
        {nameLink: 'Ed', name: 'Ed', age: '36', job: 'Health Care Salesman', city: 'Miami', stateUS: 'FL', status: 'on', imageLink: 'https://cdn1.edgedatg.com/aws/v2/abc/TheBachelorette/person/3529345/222af39d1f031736e0de3c237235a651/330x330-Q90_222af39d1f031736e0de3c237235a651.jpg', totalpoints: '0', week1points: '0', week1actions:[], week2points: '0', week2actions: [], week3points: '0', week3actions:[], week4points: '0', week4actions: [], week5points: '0', week5actions:[], week6points: '0', week6actions: [], week7points: '0', week7actions:[], week8points: '0', week8actions: [], week9points: '0', week9actions:[], week10points: '0', week10actions: [], oneTimeActions: []},
        {nameLink: 'Garin', name: 'Garin', age: '34', job: 'Professor of Journalism', city: 'North Hollywood', stateUS: 'CA', status: 'on', imageLink: 'https://cdn1.edgedatg.com/aws/v2/abc/TheBachelorette/person/3529346/f70b7c72e480d6ae61b0a2ae7995a9be/330x330-Q90_f70b7c72e480d6ae61b0a2ae7995a9be.jpg', totalpoints: '0', week1points: '0', week1actions:[], week2points: '0', week2actions: [], week3points: '0', week3actions:[], week4points: '0', week4actions: [], week5points: '0', week5actions:[], week6points: '0', week6actions: [], week7points: '0', week7actions:[], week8points: '0', week8actions: [], week9points: '0', week9actions:[], week10points: '0', week10actions: [], oneTimeActions: []},
        {nameLink: 'Ivan', name: 'Ivan', age: '28', job: 'Aeronautical Engineer', city: 'Dallas', stateUS: 'TX', status: 'on', imageLink: 'https://cdn1.edgedatg.com/aws/v2/abc/TheBachelorette/person/3529348/29f2eb05ea1c0a7db91875cd7cace56e/330x330-Q90_29f2eb05ea1c0a7db91875cd7cace56e.jpg', totalpoints: '0', week1points: '0', week1actions:[], week2points: '0', week2actions: [], week3points: '0', week3actions:[], week4points: '0', week4actions: [], week5points: '0', week5actions:[], week6points: '0', week6actions: [], week7points: '0', week7actions:[], week8points: '0', week8actions: [], week9points: '0', week9actions:[], week10points: '0', week10actions: [], oneTimeActions: []},
        {nameLink: 'Jason', name: 'Jason', age: '31', job: 'Former Pro Football Lineman', city: 'Arlington', stateUS: 'VA', status: 'on', imageLink: 'https://cdn1.edgedatg.com/aws/v2/abc/TheBachelorette/person/3529349/7ef90a2b3819e1eb518c5e743737a1b8/330x330-Q90_7ef90a2b3819e1eb518c5e743737a1b8.jpg', totalpoints: '0', week1points: '0', week1actions:[], week2points: '0', week2actions: [], week3points: '0', week3actions:[], week4points: '0', week4actions: [], week5points: '0', week5actions:[], week6points: '0', week6actions: [], week7points: '0', week7actions:[], week8points: '0', week8actions: [], week9points: '0', week9actions:[], week10points: '0', week10actions: [], oneTimeActions: []},
        {nameLink: 'Jay', name: 'Jay', age: '29', job: 'Fitness Director', city: 'Fort Lauderdale', stateUS: 'FL', status: 'on', imageLink: 'https://cdn1.edgedatg.com/aws/v2/abc/TheBachelorette/person/3529350/a60286e904e54944f614c33ce6d4362d/330x330-Q90_a60286e904e54944f614c33ce6d4362d.jpg', totalpoints: '0', week1points: '0', week1actions:[], week2points: '0', week2actions: [], week3points: '0', week3actions:[], week4points: '0', week4actions: [], week5points: '0', week5actions:[], week6points: '0', week6actions: [], week7points: '0', week7actions:[], week8points: '0', week8actions: [], week9points: '0', week9actions:[], week10points: '0', week10actions: [], oneTimeActions: []},
        {nameLink: 'Jeremy', name: 'Jeremy', age: '40', job: 'Banker', city: 'Washington', stateUS: 'DC', status: 'on', imageLink: 'https://cdn1.edgedatg.com/aws/v2/abc/TheBachelorette/person/3529351/a6d85fa9ed8d34d253179ff8ba530f35/330x330-Q90_a6d85fa9ed8d34d253179ff8ba530f35.jpg', totalpoints: '0', week1points: '0', week1actions:[], week2points: '0', week2actions: [], week3points: '0', week3actions:[], week4points: '0', week4actions: [], week5points: '0', week5actions:[], week6points: '0', week6actions: [], week7points: '0', week7actions:[], week8points: '0', week8actions: [], week9points: '0', week9actions:[], week10points: '0', week10actions: [], oneTimeActions: []},
        {nameLink: 'Joe', name: 'Joe', age: '36', job: 'Anesthesiologist', city: 'New York City', stateUS: 'NY', status: 'on', imageLink: 'https://cdn1.edgedatg.com/aws/v2/abc/TheBachelorette/person/3529352/4d89e8daefc7c560c1394b30ce0cb5a9/330x330-Q90_4d89e8daefc7c560c1394b30ce0cb5a9.jpg', totalpoints: '0', week1points: '0', week1actions:[], week2points: '0', week2actions: [], week3points: '0', week3actions:[], week4points: '0', week4actions: [], week5points: '0', week5actions:[], week6points: '0', week6actions: [], week7points: '0', week7actions:[], week8points: '0', week8actions: [], week9points: '0', week9actions:[], week10points: '0', week10actions: [], oneTimeActions: []},
        {nameLink: 'Jordan-C', name: 'Jordan C.', age: '26', job: 'Software Account Executive', city: 'New York City', stateUS: 'NY', status: 'on', imageLink: 'https://cdn1.edgedatg.com/aws/v2/abc/TheBachelorette/person/3529353/344af731985d9a38e443958230c15817/330x330-Q90_344af731985d9a38e443958230c15817.jpg', totalpoints: '0', week1points: '0', week1actions:[], week2points: '0', week2actions: [], week3points: '0', week3actions:[], week4points: '0', week4actions: [], week5points: '0', week5actions:[], week6points: '0', week6actions: [], week7points: '0', week7actions:[], week8points: '0', week8actions: [], week9points: '0', week9actions:[], week10points: '0', week10actions: [], oneTimeActions: []},
        {nameLink: 'Jordan-M', name: 'Jordan M.', age: '30', job: 'Cyber Security Engineer', city: 'Santa Monica', stateUS: 'CA', status: 'on', imageLink: 'https://cdn1.edgedatg.com/aws/v2/abc/TheBachelorette/person/3529354/7080d22b96382d7d8cb092bc6d4f32c2/330x330-Q90_7080d22b96382d7d8cb092bc6d4f32c2.jpg', totalpoints: '0', week1points: '0', week1actions:[], week2points: '0', week2actions: [], week3points: '0', week3actions:[], week4points: '0', week4actions: [], week5points: '0', week5actions:[], week6points: '0', week6actions: [], week7points: '0', week7actions:[], week8points: '0', week8actions: [], week9points: '0', week9actions:[], week10points: '0', week10actions: [], oneTimeActions: []},
        {nameLink: 'Kenny', name: 'Kenny', age: '39', job: 'Boy Band Manager', city: 'Chicago', stateUS: 'IL', status: 'on', imageLink: 'https://cdn1.edgedatg.com/aws/v2/abc/TheBachelorette/person/3529355/4c4abf5013ad8cc81ce083ded7975beb/330x330-Q90_4c4abf5013ad8cc81ce083ded7975beb.jpg', totalpoints: '0', week1points: '0', week1actions:[], week2points: '0', week2actions: [], week3points: '0', week3actions:[], week4points: '0', week4actions: [], week5points: '0', week5actions:[], week6points: '0', week6actions: [], week7points: '0', week7actions:[], week8points: '0', week8actions: [], week9points: '0', week9actions:[], week10points: '0', week10actions: [], oneTimeActions: []},
        {nameLink: 'Mike', name: 'Mike', age: '38', job: 'Digital Media Adviser', city: 'Calgary', stateUS: 'Alberta', status: 'on', imageLink: 'https://cdn1.edgedatg.com/aws/v2/abc/TheBachelorette/person/3529356/5757c5d3d9903d340fb5440654c124aa/330x330-Q90_5757c5d3d9903d340fb5440654c124aa.jpg', totalpoints: '0', week1points: '0', week1actions:[], week2points: '0', week2actions: [], week3points: '0', week3actions:[], week4points: '0', week4actions: [], week5points: '0', week5actions:[], week6points: '0', week6actions: [], week7points: '0', week7actions:[], week8points: '0', week8actions: [], week9points: '0', week9actions:[], week10points: '0', week10actions: [], oneTimeActions: []},
        {nameLink: 'Page', name: 'Page', age: '37', job: 'Chef', city: 'Austin', stateUS: 'TX', status: 'on', imageLink: 'https://cdn1.edgedatg.com/aws/v2/abc/TheBachelorette/person/3529357/91977cfb1b89b90d2649fb326e75038e/330x330-Q90_91977cfb1b89b90d2649fb326e75038e.jpg', totalpoints: '0', week1points: '0', week1actions:[], week2points: '0', week2actions: [], week3points: '0', week3actions:[], week4points: '0', week4actions: [], week5points: '0', week5actions:[], week6points: '0', week6actions: [], week7points: '0', week7actions:[], week8points: '0', week8actions: [], week9points: '0', week9actions:[], week10points: '0', week10actions: [], oneTimeActions: []},
        {nameLink: 'Riley', name: 'Riley', age: '30', job: 'Attorney', city: 'Long Island City', stateUS: 'NY', status: 'on', imageLink: 'https://cdn1.edgedatg.com/aws/v2/abc/TheBachelorette/person/3529358/b5edf00d5ca0c445a94044f919a46c80/330x330-Q90_b5edf00d5ca0c445a94044f919a46c80.jpg', totalpoints: '0', week1points: '0', week1actions:[], week2points: '0', week2actions: [], week3points: '0', week3actions:[], week4points: '0', week4actions: [], week5points: '0', week5actions:[], week6points: '0', week6actions: [], week7points: '0', week7actions:[], week8points: '0', week8actions: [], week9points: '0', week9actions:[], week10points: '0', week10actions: [], oneTimeActions: []},
        {nameLink: 'Robby', name: 'Robby', age: '31', job: 'Insurance Broker', city: 'Tampa', stateUS: 'FL', status: 'on', imageLink: 'https://cdn1.edgedatg.com/aws/v2/abc/TheBachelorette/person/3529359/d2023cf62e39dfcd718c3e0e0cca04fc/330x330-Q90_d2023cf62e39dfcd718c3e0e0cca04fc.jpg', totalpoints: '0', week1points: '0', week1actions:[], week2points: '0', week2actions: [], week3points: '0', week3actions:[], week4points: '0', week4actions: [], week5points: '0', week5actions:[], week6points: '0', week6actions: [], week7points: '0', week7actions:[], week8points: '0', week8actions: [], week9points: '0', week9actions:[], week10points: '0', week10actions: [], oneTimeActions: []},
        {nameLink: 'Tyler-C', name: 'Tyler C.', age: '27', job: 'Lawyer', city: 'Morgantown', stateUS: 'WV', status: 'on', imageLink: 'https://cdn1.edgedatg.com/aws/v2/abc/TheBachelorette/person/3529360/7f52e45b4ea19365f1f02e2ae56026ea/330x330-Q90_7f52e45b4ea19365f1f02e2ae56026ea.jpg', totalpoints: '0', week1points: '0', week1actions:[], week2points: '0', week2actions: [], week3points: '0', week3actions:[], week4points: '0', week4actions: [], week5points: '0', week5actions:[], week6points: '0', week6actions: [], week7points: '0', week7actions:[], week8points: '0', week8actions: [], week9points: '0', week9actions:[], week10points: '0', week10actions: [], oneTimeActions: []},
        {nameLink: 'Tyler-S', name: 'Tyler S.', age: '36', job: 'Music Manager', city: 'Georgetown', stateUS: 'TX', status: 'on', imageLink: 'https://cdn1.edgedatg.com/aws/v2/abc/TheBachelorette/person/3529361/6711f9e2e6ca6d3c1903e9843c823e8b/330x330-Q90_6711f9e2e6ca6d3c1903e9843c823e8b.jpg', totalpoints: '0', week1points: '0', week1actions:[], week2points: '0', week2actions: [], week3points: '0', week3actions:[], week4points: '0', week4actions: [], week5points: '0', week5actions:[], week6points: '0', week6actions: [], week7points: '0', week7actions:[], week8points: '0', week8actions: [], week9points: '0', week9actions:[], week10points: '0', week10actions: [], oneTimeActions: []},
        {nameLink: 'Yosef', name: 'Yosef', age: '30', job: 'Medical Device Salesman', city: 'Daphne', stateUS: 'AL', status: 'on', imageLink: 'https://cdn1.edgedatg.com/aws/v2/abc/TheBachelorette/person/3529362/2109207db187bcbf42131fc51a5d457d/330x330-Q90_2109207db187bcbf42131fc51a5d457d.jpg', totalpoints: '0', week1points: '0', week1actions:[], week2points: '0', week2actions: [], week3points: '0', week3actions:[], week4points: '0', week4actions: [], week5points: '0', week5actions:[], week6points: '0', week6actions: [], week7points: '0', week7actions:[], week8points: '0', week8actions: [], week9points: '0', week9actions:[], week10points: '0', week10actions: [], oneTimeActions: []},
        {nameLink: 'Zac-C', name: 'Zac C.', age: '36', job: 'Addiction Specialist', city: 'Haddonfield', stateUS: 'NJ', status: 'on', imageLink: 'https://cdn1.edgedatg.com/aws/v2/abc/TheBachelorette/person/3529363/f906f9b28fa76a603823d4f39d1b3fcf/330x330-Q90_f906f9b28fa76a603823d4f39d1b3fcf.jpg', totalpoints: '0', week1points: '0', week1actions:[], week2points: '0', week2actions: [], week3points: '0', week3actions:[], week4points: '0', week4actions: [], week5points: '0', week5actions:[], week6points: '0', week6actions: [], week7points: '0', week7actions:[], week8points: '0', week8actions: [], week9points: '0', week9actions:[], week10points: '0', week10actions: [], oneTimeActions: []},
        {nameLink: 'Zach-J', name: 'Zach J.', age: '37', job: 'Cleaning Service Owner', city: 'St. George', stateUS: 'UT', status: 'on', imageLink: 'https://cdn1.edgedatg.com/aws/v2/abc/TheBachelorette/person/3529364/b517dde55774ebaf71c3c1152a9e8ec6/330x330-Q90_b517dde55774ebaf71c3c1152a9e8ec6.jpg', totalpoints: '0', week1points: '0', week1actions:[], week2points: '0', week2actions: [], week3points: '0', week3actions:[], week4points: '0', week4actions: [], week5points: '0', week5actions:[], week6points: '0', week6actions: [], week7points: '0', week7actions:[], week8points: '0', week8actions: [], week9points: '0', week9actions:[], week10points: '0', week10actions: [], oneTimeActions: []}
    ])
        .then(function(){
        console.log("Contestants inserted")  // Success
    }).catch(function(error){
        console.log(error)      // Failure
    });

    Logistics.create({currentWeek: 1, week1eliminated: [], week2eliminated: [], week3eliminated: [], week4eliminated: [], week5eliminated: [], week6eliminated: [], week7eliminated: [], week8eliminated: [], week9eliminated: [], week10eliminated: [],  week11eliminated: [], week12eliminated: [], firstsOccurred: []})
        .then(function(){
            console.log("Logistics inserted")  // Success
        }).catch(function(error){
        console.log(error)      // Failure
    });
};

app.use('/', router);

app.get('/users', async (req, res) => {
    const users = await User.find({});
    res.json(users);
});

app.get('/contestants', async (req, res) => {
    const contestants = await Contestants.find({});
    res.json(contestants);
});

app.post('/addcontestants', async (req, res) => {
    console.log(req.body);
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

app.put('/updatelogistics', (req, res) => {
    Logistics.findOneAndReplace({"_id": req.body.updatedLogistics._id}, req.body.updatedLogistics, {returnOriginal: false})
        .then((err, result) => {
            if (err) {
                res.send(err);
            } else {
                return res.json(result);
            };
        })})

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

app.put('/updatepicks/:id', (req, res) => {
    User.findOne({
        id: req.body.updatedUser.id
    }, (err, user) => {
        if (err) {
            return res.send(err);
        }

        if (user === null) {
            return res.send({
                msg: ('No matching user with name')
            });
        }
        user.picks = req.body.updatedUser.picks
        user.save(err => {
            if (err) {
                res.send(err);
            }
            const payload = {
                id: user.id,
                email: user.email,
                picks: user.picks,
            }
            jwt.sign(payload, 'secret', {
                expiresIn: 3600
            }, (err, token) => {
                if (err) console.error('There is some error in token', err);
                else {
                    res.json({
                        success: true,
                        token: `Bearer ${token}`
                    });
                }
            });
            res.json(user);
        });
    });
});

app.get('/getuser', passport.authenticate('jwt', { session: false }), (req, res) => {
    console.log(req.user.id);
    return res.json({
        id: req.user.id,
        firstname: req.user.firstname,
        email: req.user.email,
        picks: req.user.picks
    });
});

app.put('/updateuser/:_id', (req, res) => {
    User.findOneAndReplace({_id: req.params._id}, req.body.updatedUser, {returnOriginal: false})
        .then((err, result) => {
            if (err) {
                res.send(err);
            } else {
                return res.json(result);
            };
        })})

app.put('/updatecontestant/:nameLink', (req, res) => {
    Contestants.findOneAndReplace({nameLink: req.params.nameLink}, req.body.updatedContestant, {returnOriginal: false})
        .then((err, result) => {
            if (err) {
                res.send(err);
            } else {
                return res.json(result);
            };
        })})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});

