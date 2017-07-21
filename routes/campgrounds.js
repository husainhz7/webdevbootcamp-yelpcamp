var express = require('express')
var router = express.Router()
var Campground = require('../models/campground')
var middleware = require('../middleware')
//INDEX
router.get('/',function(req,res){
	Campground.find({},function(err, allcampgrounds){
		if(err){
			console.log(err);
		}else{
			res.render('campgrounds/index',{campgrounds:allcampgrounds, currentUser: req.user});
			
		}
	})
});

//CREATE
router.post("/",middleware.isLoggedIn,function(req,res){
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var price = req.body.price;
	var author ={
		id: req.user._id,
		username: req.user.username
	}
	var newCamp = {name: name, price: price, image: image, description: desc, author:author};
	Campground.create(newCamp, function(err, campground){
		if(err){
			console.log(err);
			req.flash("error",err.message);
		}else{
			req.flash("success","Campground created");
			res.redirect('/campgrounds');
		}
	});
});

//NEW
router.get('/new',middleware.isLoggedIn,function(req,res){
	res.render('campgrounds/new');
});

//SHOW
router.get('/:id',function(req,res){
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp){
		if(err){
			console.log(err);
		}else{
			res.render('campgrounds/show',{campground: foundCamp});
			
		}
	});
});

//EDIT Route
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findById(req.params.id, function(err, foundCamp){
		if(err){
			req.flash("error","Campground not found");
		}else{
			res.render('campgrounds/edit',{campground:foundCamp})
			
		}
		
	})
});
//UPDATE Route
router.put('/:id',middleware.checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndUpdate(req.params.id,req.body.campground, function(err, updatedCamp){
		if(err){
			req.flash("error",err.message);
			res.redirect('/campgrounds')
		}else{
			req.flash("success","Campground updated");
			res.redirect('/campgrounds/'+req.params.id)
		}
	})
})
//DELETE
router.delete('/:id',middleware.checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/campgrounds");
			req.flash("error",err.message);
		}else{
			req.flash("success","Campground deleted");
			res.redirect("/campgrounds");
		}
	});
});


module.exports=router