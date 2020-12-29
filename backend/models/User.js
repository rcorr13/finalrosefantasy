const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSeasonSchema = new Schema({
    season: {
        type: String,
        required: true
    },

    picks: {
        type: "array",
        items: {
            type: "object",
            properties: {
                name: {
                    type: "string"
                }
            }
        }
    },
    week1team: {
        type: "array",
        items: {
            type: "object",
            properties: {
                name: {
                    type: "string"
                }
            }
        },
        default: []
    },
    week1total: {
        type: String,
        default: '0'
    },
    week2team: {
        type: "array",
        items: {
            type: "object",
            properties: {
                name: {
                    type: "string"
                }
            }
        },
        default: []
    },
    week2total: {
        type: String,
        default: '0'
    },
    week3team: {
        type: "array",
        items: {
            type: "object",
            properties: {
                name: {
                    type: "string"
                }
            }
        },
        default: []
    },
    week3total: {
        type: String,
        default: '0'
    },
    week4team: {
        type: "array",
        items: {
            type: "object",
            properties: {
                name: {
                    type: "string"
                }
            }
        },
        default: []
    },
    week4total: {
        type: String,
        default: '0'
    },
    week5team: {
        type: "array",
        items: {
            type: "object",
            properties: {
                name: {
                    type: "string"
                }
            }
        },
        default: []
    },
    week5total: {
        type: String,
        default: '0'
    },
    week6team: {
        type: "array",
        items: {
            type: "object",
            properties: {
                name: {
                    type: "string"
                }
            }
        },
        default: []
    },
    week6total: {
        type: String,
        default: '0'
    },
    week7team: {
        type: "array",
        items: {
            type: "object",
            properties: {
                name: {
                    type: "string"
                }
            }
        },
        default: []
    },
    week7total: {
        type: String,
        default: '0'
    },
    week8team: {
        type: "array",
        items: {
            type: "object",
            properties: {
                name: {
                    type: "string"
                }
            }
        },
        default: []
    },
    week8total: {
        type: String,
        default: '0'
    },
    week9team: {
        type: "array",
        items: {
            type: "object",
            properties: {
                name: {
                    type: "string"
                }
            }
        },
        default: []
    },
    week9total: {
        type: String,
        default: '0'
    },
    week10team: {
        type: "array",
        items: {
            type: "object",
            properties: {
                name: {
                    type: "string"
                }
            }
        },
        default: []
    },
    week10total: {
        type: String,
        default: '0'
    },
    week11team: {
        type: "array",
        items: {
            type: "object",
            properties: {
                name: {
                    type: "string"
                }
            }
        },
        default: []
    },
    week11total: {
        type: String,
        default: '0'
    },
    week12team: {
        type: "array",
        items: {
            type: "object",
            properties: {
                name: {
                    type: "string"
                }
            }
        },
        default: []
    },
    week12total: {
        type: String,
        default: '0'
    },
    week13team: {
        type: "array",
        items: {
            type: "object",
            properties: {
                name: {
                    type: "string"
                }
            }
        },
        default: []
    },
    week13total: {
        type: String,
        default: '0'
    },
    week14team: {
        type: "array",
        items: {
            type: "object",
            properties: {
                name: {
                    type: "string"
                }
            }
        },
        default: []
    },
    week14total: {
        type: String,
        default: '0'
    },
    totalpoints: {
        type: String,
        default: '0'
    }
})


const UserSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    picksAndTeams: [UserSeasonSchema],

});

const User = mongoose.model('users', UserSchema);
module.exports = UserSchema;
