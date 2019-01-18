const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ListSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    list:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'listItem'
        }
    ],
    date: {
        type : Date,
        default : Date.now,
    }
});

module.exports = Item = mongoose.model("list",ListSchema);