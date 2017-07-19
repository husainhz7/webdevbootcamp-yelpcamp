var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var methodOverride = require("method-override");
var passport = require('passport');
var LocalStrategy = require("passport-local");
var User = require('./models/user');
var seedDB = require("./seeds");

var commentRoutes = require('./routes/comments')
	campgroundRoutes = require('./routes/campgrounds')
	indexRoutes = require('./routes/index')

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine','ejs');
app.use(express.static(__dirname+"/public"))
app.use(methodOverride("_method"));
// seedDB(); Seed the database

//PASSPORT
app.use(require('express-session')({
	secret: "LMAO",
	resave: false,
	saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next()
})

app.use(indexRoutes)
app.use('/campgrounds/:id/comments',commentRoutes)
app.use('/campgrounds',campgroundRoutes)


app.listen(process.env.PORT || 3000,function(){
	console.log("YelpCamp Server Started");
});