const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const LogisticsSchema = new Schema({
    currentWeek: {
        type: String,
        required: true,
        default: "0"
    },

    week1eliminated: {
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
    week2eliminated: {
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
    week3eliminated: {
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
    week4eliminated: {
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
    week5eliminated: {
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
    week6eliminated: {
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
    week7eliminated: {
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
    week8eliminated: {
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
    week9eliminated: {
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
    week10eliminated: {
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
    week11eliminated: {
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
    week12eliminated: {
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
    week13eliminated: {
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
    week14eliminated: {
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
    alleliminated: {
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
    firstsOccurred: {
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

const Logistics = mongoose.model('logistics', LogisticsSchema);
module.exports = LogisticsSchema

