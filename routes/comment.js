var express = require("express");
var router =  express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewares = require("../middlewares/index");

router.get("/campgrounds/:id/comments/new",middlewares.isLoggedIn,function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log("error");
		}else{
			res.render("comments/new",{campground:campground});
		}
	});
});
router.post("/campgrounds/:id/comments",middlewares.isLoggedIn,function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log("error");
		}else{
			Comment.create(req.body.comments,function(err,comment){
				if(err){
					console.log("error");
				}else{
						var author = {
							id: req.user._id,
							username:req.user.username
						}
					comment.author = author;
					comment.save();
					console.log(comment.author);
					campground.comments.push(comment);
					campground.save(function(err,campground){
						if(!err){
							req.flash("success","comment created successfully");
							res.redirect("/campgrounds/" + campground._id);
						}else{
							console.log(campground);
						}
					});
				}
			});
		}
	});
});

router.get("/campgrounds/:id/comments/:comment_id/edit",middlewares.checkCommentOwnership,function(req,res){
	Comment.findById(req.params.comment_id,function(err,foundcomment){
		if(err){
			res.send("error");
		}else{
			res.render("comments/edit",{campid:req.params.id,comment:foundcomment});
		}
	});
})

router.put("/campgrounds/:id/comments/:comment_id",middlewares.checkCommentOwnership,function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.newcomment,function(err,updateComment){
		if(err){
			res.send("error");
		}else{
			req.flash("success","comment updated");
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
});

router.delete("/campgrounds/:id/comments/:comment_id",middlewares.checkCommentOwnership,function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id,function(err){
		if(err){
			res.send("error");
		}else{
			req.flash("success","comment deleted successfully");
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
})

module.exports = router;