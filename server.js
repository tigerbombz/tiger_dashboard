// Require the Express Module
var express = require("express");
// Create an Express App
var app = express();
var mongoose = require('mongoose');
// Require body-parser (to receive post data from clients)
var bodyParser = require("body-parser");
// Integrate body-parser with our App
app.use(bodyParser.urlencoded());
// Require path
var path = require("path");
// Setting our Static Folder Directory
app.use(express.static(__dirname + "./static"));
// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');
// Routes
// Root Request
app.get('/', function(req, res) {
    // This is where we will retrieve the users from the database and include them in the view page we will be rendering.
    Tiger.find({}, function(err, tigers){
      console.log(tigers);
    res.render("index", {tigers: tigers});
    })
  })

//NEW PAGE
app.get('/tigers', function(req, res){
  res.render("new");
})

//CREATE
app.post('/tigers', function(req, res){
  console.log("POST DATA", req.body);
  var tiger = new Tiger({name: req.body.name, skin: req.body.skin});

  tiger.save(function(err){
    if(err) {
      console.log("Something went wrong");
      res.render("new")
    } else {
      console.log("Successfully added a tiger");
      res.redirect("/");
    }
  })
})

//SHOW PAGE
app.get('/tigers/:id', function(req, res){
  Tiger.find({_id: req.params.id}, function(err, tigers){
    console.log(tigers);
    res.render('show', { tiger: tigers[0] });
  })
})

//EDIT PAGE
app.get('/tigers/:id/edit', function(req, res){
  Tiger.find({_id: req.params.id}, function(err, tigers){
  res.render("edit", {tigers: tigers[0]});
})
})

//UPDATE PAGE
app.post('/tigers/:id', function(req,res){
  Tiger.update( {_id: req.params.id}, {name: req.body.name, skin: req.body.skin}, function(err,tigers){
    console.log(tigers);
    res.redirect("/tigers/" + req.params.id);
  })
})

//DESTROY TIGER
app.post('/tigers/:id/destroy', function(req, res){
  Tiger.remove( {_id: req.params.id}, function(err, tiger){
    res.redirect('/');
  })
})

mongoose.connect('mongodb://localhost/tiger_dashboard');

app.listen(8000, function() {
    console.log("listening on port 8000");
})


var TigerSchema = new mongoose.Schema({
   name: String,
   skin: String
  })
  mongoose.model('Tiger', TigerSchema); // We are setting this Schema in our Models as 'User'
  var Tiger = mongoose.model('Tiger') // We are retrieving this Schema from our Models, named 'User'
