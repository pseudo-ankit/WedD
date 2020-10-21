const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

var items = ["Eat", "Sleep", "Code"];
var workItems = [];

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  var options = {
    weekday: "long",
    // year: "numeric",
    month: "long",
    day: "numeric",
  };

  // var today = new Date();

  //   console.log(today.toLocaleDateString("en-US", options));

  var today = new Date();
  var currentDay = today.getDay();
  var day = today.toLocaleDateString("en-US", options);
  res.render("list", { kindOfDay: day, items: items });
});

app.post("/", function (req, res) {
  var item = req.body.newItem;
  // console.log(req.body);

  if(req.body.button==="work"){
    workItems.push(item);
    res.redirect("/work");
  }
  else{
  items.push(item);
  res.redirect("/");
  }
  
});

app.get("/work", (req, res) => {
  // console.log(req.body);
  res.render("list", {kindOfDay:"work", items: workItems});
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
