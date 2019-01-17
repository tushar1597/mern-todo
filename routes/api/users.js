const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');

//User Model
const User = require("../../models/User");



router.post("/register",function(req,res){
    const newUser = new User({
        username: req.body.username,
        password: req.body.password,
    });
    
    newUser.save().then(function(user_inserted){
        res.json({user_inserted:user_inserted,
                  error: false});
    })
    .catch(function(err){
        res.json({
            user_inserted:false,
            error:err});
    }) 
    })
router.post("/login",function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    console.log(username,password);
    User.findOne({username,password})
    .then(user => {
     //generating the token.. 
    jwt.sign({username:username,password:password},'secretkey',{ expiresIn : '3000s'},function(err,token){
        if(err){
            res.json({err})
        }else{
            res.json({
                token,user 
            });
        }
    });
    })
    .catch(err => {
        res.json({err})
    });
})

router.post("/verifyToken",function(req,res){
    const token = req.body.token;
    jwt.verify(token, 'secretkey', function(err,authData){
        if(err){
            res.status(403);
        }else{
            res.json({
                message: "Post created...",
                authData: authData,
            });
        }
    });
})

router.get("/:username",function(req,res){
    User.findOne({username:req.params.username})
        .then(function(user){
            res.json({user_status: user})
        })
        .catch(function(err){
            res.json({success:false})
        })
})


module.exports =  router;