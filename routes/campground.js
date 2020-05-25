var express = require("express");
var router =  express.Router();
var Campground = require("../models/campground");
var middlewares = require("../middlewares/index");

router.get("/campgrounds",function(req,res){
	 Campground.find({},function(err,campgrounds){
		if(err){
			console.log("error");
		}else{
			console.log(campgrounds);
			res.render("campgrounds/campgrounds",{campgrounds:campgrounds});
		}
	 });
 });

router.post("/campgrounds",middlewares.isLoggedIn,function(req,res){
	var name = req.body.name;
	var image = req.body.image;
	var author =  {
		id:req.user._id,
		username:req.user.username
	}
	var newcampground = {name:name,image:image,author:author};
	Campground.create(newcampground,function(err,campground){
		if(err){
			console.log("error");
		}else{
			console.log(campground);
			req.flash("success","new campground added successfully");
			res.redirect("/campgrounds");
		}
	});
});


router.get("/campgrounds/new",middlewares.isLoggedIn,function(req,res){
	res.render("campgrounds/new");
});

router.get("/campgrounds/:id",function(req,res){
	Campground.findById(req.params.id).populate("comments").exec(function(err,newcampground){
		if(err){
			console.log(err);
		}else{
				console.log(newcampground);
				res.render("campgrounds/view",{campground:newcampground});
		}
	});

});

router.get("/campgrounds/:id/edit",middlewares.checkCampgroundOwnership,function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			res.send("error");
		}else{
			res.render("campgrounds/edit",{campground:campground});
		}
	})
})

router.put("/campgrounds/:id",middlewares.checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCamp){
		if(err){
			res.send("error")
		}else{
			req.flash("success","campground updated successfully");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
	//res.send("put route");
})

router.delete("/campgrounds/:id",middlewares.checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.send("error");
		}else{
			req.flash("success","campground deleted successfully");
			res.redirect("/campgrounds");
		}
	});
})


module.exports = router;