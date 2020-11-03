const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ContestantBackendSchema = new Schema({
    nameLink: {
        type: String,
        required: true
    },
    name: {
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
    week1points: {
        type: String,
        required: true
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
        required: true
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
});

const ContestantBackend = mongoose.model('contestants', ContestantBackendSchema);

module.exports = ContestantBackendSchema

