const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ListItemSchema = new Schema({
    items : [
        {
            checked: {type:Number, min:0, max:1},
            value : {type:String}

        }
    ],
});

module.exports = ListItem = mongoose.model("listItem",ListItemSchema);