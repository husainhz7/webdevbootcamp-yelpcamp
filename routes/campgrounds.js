var express = require('express')
var router = express.Router()
var Campground = require('../models/campground')
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
router.post("/",isLoggedIn,function(req,res){
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var author ={
		id: req.user._id,
		username: req.user.username
	}
	var newCamp = {name: name, image: image, description: desc, author:author};
	Campground.create(newCamp, function(err, campground){
		if(err){
			console.log(err);
		}else{
		}
	});
	res.redirect('/campgrounds');
});

//NEW
router.get('/new',isLoggedIn,function(req,res){
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
router.get("/:id/edit",checkCampGroundOwnership,function(req,res){
	Campground.findById(req.params.id, function(err, foundCamp){
		res.render('campgrounds/edit',{campground:foundCamp})
		
	})
});
//UPDATE Route
router.put('/:id',checkCampGroundOwnership,function(req,res){
	Campground.findByIdAndUpdate(req.params.id,req.body.campground, function(err, updatedCamp){
		if(err){
			res.redirect('/campgrounds')
		}else{
			res.redirect('/campgrounds/'+req.params.id)
		}
	})
})
//DELETE
router.delete('/:id',checkCampGroundOwnership,function(req,res){
	Campground.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/campgrounds");
			console.log(err);
		}else{
			res.redirect("/campgrounds");
		}
	});
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next()
	}
	res.redirect('/login');
}
function checkCampGroundOwnership(req, res, next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCamp){
			if(err){
				res.redirect('back')
			}else{
				if(foundCamp.author.id.equals(req.user._id))
					next();
				else
					res.redirect('back')
			}
		})
	} else {
		res.redirect("back");
	}
}
module.exports=router