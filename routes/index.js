 var express = require("express");
 var router  = express.Router();
 var passport = require("passport");
 var User     = require("../models/user");


//Root route (home page)
	router.get("/", function(req, res){
		res.render("landing");
	});


/* =====  AUTHENTICATION ROUTES BELOW ===== */

//SHOW REGISTER FORM
router.get("/register", function(req, res){
	res.render("register");
});


//REGISTER LOGIC

router.post("/register", function(req, res){
	//Make a new user with just a password and store it in a variable 
	var newUser = new User({username:req.body.username});
	//Call the 'register' method that came with passport-local-mongoose and pass in the new user that only has a username
	//Pass in the password as a second parameter and then the callback function to handle error's
	User.register(newUser, req.body.password, function(error, user){
		// If there is an error registering the user, return them to the register form
		if(error){
			console.log(error);
			req.flash("error", error.message);
			return res.render("register");
		}
		//If there is no error registering the user, log them in using the passport.authenticate() method
		//Be sure to declare the strategy as 'local'
		//If the login is a success, redirect them to the main campgrounds page
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome " + req.user.username);
			res.redirect("/campgrounds");
		});
	});
});


//SHOW LOGIN FORM 
router.get("/login", function(req, res){
	res.render("login");
});

//LOGIN LOGIC (We use Middleware to handle logins)
//The reason we can use middleware to handle logins is because we presume that the user is already registered 
router.post("/login", passport.authenticate("local", 
	{
		successRedirect:"/campgrounds", 
		failureRedirect:"/login"
	}),
function(req, res){

});

//Logout logic route
router.get("/logout", function(req, res){
	//logout the user 
	req.logout();
	req.flash("success", "You're logged out!");
	res.redirect("/campgrounds");
});



 





module.exports = router;
