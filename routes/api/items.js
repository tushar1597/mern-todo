const express = require("express");
const router = express.Router();

//Item Model
const Item = require("../../models/Item");

router.get("/:username",function(req,res){
    let username = req.params.username;  
    Item.findOne({username:username},{items:1})
        .then(function(user){
            res.json(user.items);
        })
})

router.post("/:username",function(req,res){
    let username = req.params.username;   
    Item.findOne({username:username})
    .then(user =>{
        if(user){
            Item.update({username:username},{$push:{items:req.body.name}})
            .then(value=>{
                res.json({value});
            }).catch(err=>{
                console.log(err);
            })
        }else{
            let itemsArray = [req.body.name];
            const newItem = new Item({
                username: username,
                items : itemsArray,
            });

            newItem.save().then(function(item_inserted){
                res.json(item_inserted);
            })
            .catch(err=> {
                res.json(err);
            }); 

        }
    })

    })


router.delete("/:name/:username",function(req,res){
    console.log(req.params.name);
    console.log(req.params.username);
    Item.update({username:req.params.username},{$pull:{items:req.params.name}})
    .then(delItem=>{
        res.json({"deleted":true})
    })
    .catch(err=>{
        res.json({err});
    })
    })

module.exports =  router;