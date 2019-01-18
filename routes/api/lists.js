const express = require("express");
const router = express.Router();

//Item Model
const ListItem = require("../../models/ListItem");
const List = require("../../models/List");

// router.post("/:username/:id/:item",function(req,res){
//     let username = req.params.username;
//     let id = req.params.id;
//     let item_to_be_added=req.params.item;
//     console.log(id);
//     //Checking if the list exist or not in the listItems..   
//     ListItem.findById(id)
//     .then(retrievedList =>{
//         if(!retrievedList){
//             //generating error 
//             let item = {
//                 d:cv
//             }
//         }
//         //The list is already present .. thus appending the item in the list
//         console.log("Id found==>>>>")
//         let newItem = {value:item_to_be_added, checked:0};
//         ListItem.update({_id:id},{$push:{items:newItem}}).then(updatedList=>{res.json({updatedList})}).catch(updateErr=>{updateErr});
//         //res.json({retrievedList});

//     }).catch(err=>{
//         console.log("not found id Error=====>");
//         //the list doesnot exist thus creating a new list 
//         let newListItems = new ListItem({
//             items: [
//                 {
//                     value: req.params.item,
//                     checked: 0,
//                 }
//             ]
//         })
//         console.log("new_item",newListItems);

//         newListItems.save()
//         .then(newList=>{
//               //add the new list to the user in List model..
//               console.log("================>>>>>>>>>>>",newList);
//               console.log(newList._id);
//               List.findOne({username:username})
//               .then(user=>{
//                    if(user){
//                     //Appending the listId to the existing user items array.. 
//                      List.update({username:username},{$push:{list:newList._id}}).then(appendedList=>res.json({appendedList})).catch(err=>res.json({err}));
//                       //res.json({"Tushare":"sd"});
//                    }else{
//                      //When the user dont exist in the List Collection..
//                        let newListRecord = new List({
//                            username:username,
//                            list:[
//                                newList._id
//                            ]
//                        })
//                     //saving the new User and the initial list in list model 
//                     newListRecord.save()
//                        .then(newUserList=>{
//                            res.json(newUserList);
//                        })
//                        .catch(err=>{
//                            res.json(err)
//                        })
//                        console.log("The user do not exist..");
//                 //res.json({user});
//                    }
         
//               })
//               .catch(err=>{
//                   console.log("error===>><<====")
//                   res.json({err});
//               })

//               //res.json({newList});

//         }) 
//         .catch(
//             err=>{
//                 res.json({err});
//             }
//         )
//         //res.json({err})
//     })

//     })

//get all list ids:
router.get("/getAllLists/:username",function(req,res){
    let username= req.params.username;
    List.find({username:username},{list:1}).then(allLists=>{
        res.json({allLists});
    }).catch(err=>{
        res.json(null)
    })
})

//Checked
router.get("/checkToogle/:listId/:itemId",function(req,res){
    let listId = req.params.listId;
    let itemId = req.params.itemId
    ListItem.updateOne({_id:listId,"items._id":itemId},{$set:{"items.$.checked":1}}).then(ans=>{
        res.json({status:"value set to 1"})
    }).catch(ans=>{
        res.json({status:"value not set to 1"})
    })
})
//unchecked
router.get("/uncheckToogle/:listId/:itemId",function(req,res){
    let listId = req.params.listId;
    let itemId = req.params.itemId
    ListItem.updateOne({_id:listId,"items._id":itemId},{$set:{"items.$.checked":0}}).then(ans=>{
        res.json({status:"value set to 0"})
    }).catch(ans=>{
        res.json({status:"value not set to 0"})
    })
})

//Delete an item from a list ..
router.get("/deleteItem/:listId/:itemId",function(req,res){
    let listId = req.params.listId;
    let itemId = req.params.itemId;
    ListItem.update({_id:listId},{ $pull: { items: {_id:itemId} } }).then(ans=>{
        res.json({status:"value deleted"})
    }).catch(ans=>{
        res.json({status:"value not deleted"});
    })
})

//delete by value
router.get("/deleteItemByValue/:listId/:value",function(req,res){
    let listId = req.params.listId;
    let value = req.params.value;
    ListItem.update({_id:listId},{ $pull: { items: {value:value} } }).then(ans=>{
        res.json({status:"value deleted"})
    }).catch(ans=>{
        res.json({status:"value not deleted"});
    })
})

//Delete entire List ..
router.get("/deleteList/:username/:listId",function(req,res){
    let username = req.params.username;
    let listId = req.params.listId;
    List.update({username:username},{ $pull: { list: listId } }).then(delId=>{
        ListItems.remove({_id:listId}).then(ans=>{
            res.json({status:"removed list"})
        }).catch(err=>{
            res.json("list not removed");
        })
    }).catch(err=>{
        res.json({status:"list not removed.."});
    })
})



//Creating a new List if a record in the List to that user exist or not.. 
router.get("/newList/:username",function(req,res){
    let username = req.params.username;
    List.findOne({username:username})
    .then(user=>{
        if(user){
            let newListItemRecord = new ListItem({
                items:[]
            })
            newListItemRecord.save()
            .then(newList=>{
                //creates a new list and returns the id
                let newListId = newList._id;
                //Adding the new List to the user ie List Model corresponding to the username
                List.update({username:username},{$push:{list:newList._id}}).then(appendedList=>res.json({appendedList})).catch(err=>res.json({err}));
            })
            .catch(error=>{
                res.json({error});
            })
        }else{
            //if the username don't exist thus adding a new user as well.
            let newListRecord = new List({
                list:[],
                username:username,
            })
            newListRecord.save()
            .then(newUser=>{
                let newListItemRecord = new ListItem({
                    items:[]
                })
                newListItemRecord.save()
                .then(newList=>{
                    //creates a new list and returns the id
                    let newListId = newList._id;
                    //Adding the new List to the user ie List Model corresponding to the username
                    List.update({username:username},{$push:{list:newList._id}}).then(appendedList=>res.json({appendedList})).catch(err=>res.json({err}));
                })
                .catch(error=>{
                    res.json({error});
                })   
            }).catch(errm=>res.json({errm}));
            //res.json({"no user":1})
        }

    })
    .catch(err=>{
        res.json({err});
    })
})

//get all list items:
router.get("/getAllItems/:listId",function(req,res){
    let listId = req.params.listId;
    ListItem.find({_id:listId})
    .then(listItems=>{
        res.json({listItems});
    }).catch(err=>{
        res.json({err});
    })
})

//adding a new item to the list ..
router.get("/addItem/:listId/:item",function(req,res){
    console.log("Item Added...");
    let listId = req.params.listId;
    let item_to_be_added = req.params.item;
    console.log(listId);
    console.log(item_to_be_added);
    ListItem.findById(listId).then(list=>{
        //adding the item to list if the list exist..
        console.log("list exists..");
        let newItem = {value:item_to_be_added, checked:0};
        ListItem.update({_id:listId},{$push:{items:newItem}}).then(updatedList=>{res.json({status:"item inserted in the list"})}).catch(updateErr=>{error:"item not inserted in List"});       
    })
    .catch(err=>{
        console.log(err);
        console.log("The list Id is invalid");
        res.json({error:"The list Id is invalid"});
    })
})

//blank url
router.post("/",function(req,res){
    let username = req.params.username;
    let id = req.params.id;   
    ListItem.findById(id)
    .then(listId =>{
        res.json(listId);
    })

    })


module.exports =  router;