const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ContestantBackendSchema = new Schema({
    nameLink: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    season: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: true
    },
    job: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    stateUS: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    imageLink: {
        type: String,
        required: true
    },
    totalpoints: {
        type: String,
        required: true
    },
    week1points: {
        type: String,
        required: true,
        default: "0",
    },
    week1actions: {
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
    week2points: {
        type: String,
        required: true,
        default: "0",
    },
    week2actions: {
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
    week3points: {
        type: String,
        required: true,
        default: "0"
    },
    week3actions: {
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
    week4points: {
        type: String,
        required: true,
        default: "0"
    },
    week4actions: {
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
    week5points: {
        type: String,
        required: true,
        default: "0"
    },
    week5actions: {
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
    week6points: {
        type: String,
        required: true,
        default: "0"
    },
    week6actions: {
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
    week7points: {
        type: String,
        required: true,
        default: "0"
    },
    week7actions: {
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
    week8points: {
        type: String,
        required: true,
        default: "0"
    },
    week8actions: {
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
    week9points: {
        type: String,
        required: true,
        default: "0"
    },
    week9actions: {
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
    week10points: {
        type: String,
        required: true,
        default: "0"
    },
    week10actions: {
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
    week11points: {
        type: String,
        required: true,
        default: "0"
    },
    week11actions: {
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
    week12points: {
        type: String,
        required: true,
        default: "0"
    },
    week12actions: {
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
    week13points: {
        type: String,
        required: true,
        default: "0"
    },
    week13actions: {
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
    week14points: {
        type: String,
        required: true,
        default: "0"
    },
    week14actions: {
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
    week15points: {
        type: String,
        required: true,
        default: "0"
    },
    week15actions: {
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
    week16points: {
        type: String,
        required: true,
        default: "0"
    },
    week16actions: {
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
    oneTimeActions: {
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
});

const Contestants = mongoose.model('contestants', ContestantBackendSchema);
module.exports = ContestantBackendSchema
