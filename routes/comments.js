	
//This is the file that stores the comments routes
//We have split up routes by category for this application to modularize it 

var express = require("express");
var router  = express.Router({mergeParams:true});
var Campground = require("../models/campground");
var Comment    = require("../models/comment");
var middleware = require("../middleware");


// =============================================
//  COMMENT ROUTES BELOW
// =============================================


//Note that before we show the add comment form, we check to make sure a user is logged in
// ** SHOWS the form for new comment
router.get("/new", middleware.isLoggedIn ,function(req, res){

	//Find the campgrounds associated with the particular ID
	Campground.findById(req.params.id, function(error, campground){
		if(error){
			console.log(error);
		}else{
			res.render("comments/new", {ground:campground});
		}
	});

});

//Note that we have a middleware function that makes sure a user is logged in before they can post a comment
// ** BACKEND LOGIC FOR NEW COMMENT
router.post("/", middleware.isLoggedIn ,function(req, res){
	//Find the campgrounds associated with the particular ID
	Campground.findById(req.params.id, function(error, campground){
		if(error){
			console.log(error);
		}else{
			// Here we are going to create a new comment and push the comment to the 'comments' array on the particular campground
			Comment.create(req.body.comment, function(error, comment){
				if(error){
					console.log(error);
				}else{
					//We need to add the username and id to our 'comment', remember the model has a property of 'author' and requires an id and username.
					// So we add both of those from the 'req.user' object and save them to the author property.
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					campground.comments.push(comment);
					campground.save(function(error, data){
						if(error){
							console.log(error);
						}else{
							console.log(campground);
							res.redirect("/campgrounds/"+req.params.id);
						}
					});
				}
			});
			
		}
	});
});

//EDIT ROUTE
//SHOWS the form for editting comment
router.get("/:comment_id/edit", middleware.checkCommentOwnership ,function(req, res){
	//We need to get the id for the campground and the id for the comment 
	Comment.findById(req.params.comment_id, function(error, comment){
		if(error){
			console.log(error);
		}else{
			res.render("comments/edit", {campground_id:req.params.id, comment:comment});
		}
	});

});

//UPDATE ROUTE 
// ** BACKEND LOGIC FOR UPDATING AN EDITTED COMMENT
router.put("/:comment_id", middleware.checkCommentOwnership,function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(error, comment){
		if(error){
			res.redirect("back");
		}else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});


//DELETE ROUTE
router.delete("/:comment_id",middleware.checkCommentOwnership ,function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(error){
		if(error){
			res.redirect("back");
		}else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});




//Be sure to export the actual 'router' which stores all of the routes

module.exports = router;