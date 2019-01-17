const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    items : [String],
    date: {
        type : Date,
        default : Date.now,
    }
});

module.exports = Item = mongoose.model("item",ItemSchema);