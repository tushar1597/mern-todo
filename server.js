const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const items = require("./routes/api/items");
const users = require("./routes/api/users");
const lists = require("./routes/api/lists");
const path = require("path");


const app = express();

app.use(bodyParser.json());

//db config
const db = require("./config/keys").mongoURI;

//connect to mongo
mongoose.connect(db)
    .then(function(){
        console.log("mongo connected");
    })
    .catch(function(err){console.log(err)});

    const port = process.env.PORT || 5000;

app.use("/api/items",items);
app.use("/api/users",users);
app.use("/api/lists",lists);

//Serve static assets in production 
if(process.env.NODE_ENV === 'production'){
    //set static folder 
    app.use(express.static("/client/build"));
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,"client",'build','index.html'));
    });
}

    app.listen(port,function(){
        console.log("Server started on port "+port);
    });