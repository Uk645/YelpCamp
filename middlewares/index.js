var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj={}; 

middlewareObj.isLoggedIn = function(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","please login first")
	res.redirect("/login");
}


middlewareObj.checkCampgroundOwnership = function(req,res,next){
	Campground.findById(req.params.id,function(err,foundcamp){
		if(req.isAuthenticated()){
			if(foundcamp.author.id.equals(req.user._id)){
				next();
			}else{
				req.flash("error","you dont have authority to do that");
				res.redirect("back");
			}
		}else{
			req.flash("error","please login first");
			res.redirect("back");
		}
	});
}


middlewareObj.checkCommentOwnership = function(req,res,next){
	Comment.findById(req.params.comment_id,function(err,foundcomment){
		if(req.isAuthenticated()){
			if(foundcomment.author.id.equals(req.user._id)){
				next();
			}else{
				req.flash("error","you dont have authority to do that");
				res.redirect("back");
			}
		}else{
			req.flash("error","please login first");
			res.redirect("back");
		}
	});
}
module.exports = middlewareObj;