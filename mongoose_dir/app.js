const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/peopleDB", {useNewUrlParser: true, useUnifiedTopology:true});

const personSchema = new mongoose.Schema({
    name: String,
    age: Number
});

const People = mongoose.model("Person", personSchema);

const people = new People({
    name:"Ankit Singh",
    age: 21
});

people.save();