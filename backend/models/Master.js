const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MasterSchema = new Schema({
    currentSeason: {
        type: String,
        required: true,
        unique: true,
        default: "BiP-9"
    },
    currentWeek: {
        type: String,
        required: true,
        default: "1"
    },
});

const Master = mongoose.model('master', MasterSchema);
module.exports = MasterSchema;
