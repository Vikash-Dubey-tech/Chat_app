const mongoose = require("mongoose");

const msgSchema = new mongoose.Schema({
    username: String,
    text: String,
    time: {
        type: Date,
        default:Date.now
    }
});

module.exports = mongoose.model("message",msgSchema);