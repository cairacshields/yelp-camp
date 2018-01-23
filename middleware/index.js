var Campground = require("../models/campground"),
	Comment     = require("../models/comment");

var middlewareObj  = {};


//Add any middleware functions to the middleware object, and export the object at the end. Be sure to require this file in the other file you with to use these functions in.


//Checks if user is logged in and if user 'id' matches the author 'id' on a particular campground
//This is known as managing authorization (NOT AUTHENTICATION). Basically, with this middleware function, we'll be able to ensure a certain user is the creator or a certain campground before they gain permission to delete or update it!
middlewareObj.checkCampgroundOwnership = function(req, res, next){
	//first thing to do is to see if the user is logged in or not
	if(req.isAuthenticated()){

		//Next, we need to find a particular campground 
		Campground.findById(req.params.id, function(error, campground){
			if(error){
				console.log(error);
				req.flash("error", "Item not found");
				res.redirect("back");
			}else{
				//Once we've found the campground, we need to make sure that the author.id on the campground matches the 'id' of the logged in user
				//We will have to use the '.equals()' mongoose function to test the values of each id.  
				if(campground.author.id.equals(req.user._id)){
					//As long as the two id's match, call the next function in line
					next();
				}else{
					req.flash("error", "You don't have permission to do that!");
					res.redirect("back");
				}
			}
		});

	}else{
		//User is not logged in.
		//We can pass in 'back' to res.redirect and it will take the user back to the previous page.
		req.flash("error", "You must log in.");
		res.redirect("back");
	}
}


//Checks if user is logged in and if user 'id' matches the author 'id' on a particular comment
//This is known as managing authorization (NOT AUTHENTICATION). Basically, with this middleware function, we'll be able to ensure a certain user is the creator of a certain comment before they gain permission to delete or update it!
middlewareObj.checkCommentOwnership = function(req, res, next){
	//first thing to do is to see if the user is logged in or not
	if(req.isAuthenticated()){

		//Next, we need to find a particular comment 
		Comment.findById(req.params.comment_id, function(error, comment){
			if(error){
				console.log(error);
				res.redirect("back");
			}else{
				//Once we've found the comment, we need to make sure that the author.id on the comment matches the 'id' of the logged in user
				//We will have to use the '.equals()' mongoose function to test the values of each id.  
				if(comment.author.id.equals(req.user._id)){
					//As long as the two id's match, call the next function in line
					next();
				}else{
					req.flash("error", "You don't have permission to do that!");
					res.redirect("back");
				}
			}
		});

	}else{
		//User is not logged in.
		//We can pass in 'back' to res.redirect and it will take the user back to the previous page.
		req.flash("error", "You need to be logged in.")
		res.redirect("back");
	}
}

//Check if a user is logged in
middlewareObj.isLoggedIn = function(req,res, next){
	if(req.isAuthenticated()){
		// If the user is logged in, we will simply call the 'next' function in line
		return next();
	}
	//If the user is NOT logged in, we will redirect them to the 'login' form and show the flash message
	req.flash("error", "You need to be logged in!");
	res.redirect("/login");
	
}

module.exports = middlewareObj;