const express = require("express");
const bodyParser = require("body-parser");
// const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _  = require("lodash");

const app = express();

mongoose.connect('mongodb://localhost:27017/todolistDB', {useNewUrlParser: true, useUnifiedTopology: true});
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];

const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Item 1"
});

const item2 = new Item({
  name: "Item 2"
});

const item3 = new Item({
  name: "Item 3"
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);


app.get("/", function(req, res) {

// const day = date.getDate();

  Item.find(function(err, items){
    if(items.length==0){
      Item.insertMany(defaultItems, function(err){
        if(err){
          console.log(err);
        }else{
          console.log("Success default items added to data");
        }
      });
      res.redirect("/");
    }else{
      res.render("list", {listTitle: "Today", newListItems: items});
    }
  });

});

app.post("/", function(req, res){

  const item = req.body.newItem;
  const listTitle = req.body.list;

  newItem = new Item({
    name: item
  });

  if(listTitle=="Today"){
    newItem.save();
    res.redirect("/");
  }else{
    List.findOne({name:listTitle},function(err, foundItem){
      if(!err){
        foundItem.items.push(newItem);
        foundItem.save();
        res.redirect("/"+listTitle);
      }
    });
  };
});


app.post("/delete", function(req, res){

  const itemID = req.body.itemID;
  const listName = req.body.listName;

  if(listName=="Today"){
    Item.findByIdAndRemove(itemID, function(err){
      if(err){
        console.log(err);
      }else{
        console.log("Ok deleted");
        res.redirect("/");
      }
    });
  } else{
    List.findOneAndUpdate({name:listName}, {$pull: {items: {_id:itemID}}}, function(err, foundList){
      if(!err){
        res.redirect("/"+foundList.name);
      }
    });
  }
});


app.get("/:customListName", function(req,res){
  
  const listName = _.capitalize(req.params.customListName);

  List.findOne({name:listName}, function(err, foundList){
    if(!err){
      if(!foundList){
        const list = new List({
          name: listName,
          items: defaultItems
        });
        list.save();
        res.redirect("/"+listName);
      }
      else{
        res.render("list", {listTitle: foundList.name, newListItems: foundList.items});      }
    };
  });

});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
