//Routes related to camogrounds 


var express = require("express"),
	router  = express.Router();

var Campground = require("../models/campground");
//Requiring the middleware file will give use access to the functions used as middleware in our routes. 
//** Note that we aren't directly linking to middleware/index.js, because whenever we require a directory such as middleware, node will automatically search for an index.js file to require... UNLESS we directly specify another file to look for. 
// So basically the below require statement is require("../middleware/index.js");
var middleware = require("../middleware");



//Index Route- Shows all campgrounds
	//Route that displays all campgrounds 
	router.get("/", function(req, res){
		//Use the MongoDB ".find()" function to get all campgrounds from the DB and pass them to the ejs file to be displayed, they will be retured as an array
		Campground.find({}, function(error, allCampgrounds){
			if(error){
				console.log("There was an error getting all campgrounds");
				console.log(error);
			}else{
				//As long as the call was successful we can pass the campgrounds to our ejs file
				res.render("campgrounds/campgrounds",{grounds:allCampgrounds});
			}
		});
	});


	//Create Route - Add new campground to DB
	//This route handles each new campground sent from /campgrounds/new
	//** Note that we also have middleware that checks to see if a user is logged in before we allow them to create a new campground. We have to call the function using the middleware object we required. 
	router.post("/",middleware.isLoggedIn ,function(req, res){

		//Use ".create()" to add new campground to DB, just pass in our object
		//We also need to get the user id and username to add with the particular campground. 
		//Remember all the user information is stored in req.user, as long as the user is logged in.
		//In this case, we can be sure that the user is logged in because we have middleware that checks for that.

		var author = {id:req.user._id, username:req.user.username};
		//After storing the user information in an object, we can set the value of the 'author' object in our campground to that particular data before we actually create the new campground.
		req.body.data.author = author;
		Campground.create(req.body.data, function(error, newCampground){
			if(error){
				console.log("There was an error adding the campground");
				console.log(error);
			}else{
				//After adding the new campground to the DB, redirect back to the campgrounds page
				res.redirect("campgrounds");
			}
		});

	});



	//NEW Route - Shows the form to make new campground
	//This route just displays the new campgrounds form
	//** Note that this route has middleware that checks to make sure a user is logged in before we display the form for adding a campground
	router.get("/new", middleware.isLoggedIn,function(req, res){
		res.render("campgrounds/new");
	});


	//Show Route - Shows details on a specific campground
	//This will show the details of a certain campground
	// ** Note that we have a variable 'id' in the route
	router.get("/:id", middleware.isLoggedIn,function(req, res){
		//first we find the campground with the passed in id
			// ** Since the id will be in the URL, we can retrieve it by using req.params.id
			//** Note that we also have to use the .populate() method on our comments array, this is because we are only storing a reference to the actual comment by the ID in our capmground schema
		Campground.findById(req.params.id).populate("comments").exec(function(error, theCampground){
			if(error){
				console.log(error + "There was an error");
			}else{
				console.log(theCampground.comments);
				//If the campground with the passed id exists and was retrieved successfully: 
				//Then we render the show page using the associating data, be sure to pass the returned value as an object to 'show' using ejs
				res.render("campgrounds/show", {theCampground:theCampground});
			}
		});
		
	});


// EDIT ROUTE (Show the form for editting a particular campground)
//** Note that we call a middleware function on this route to check and see if a user is logged in, and if they created the specific campground.
router.get("/:id/edit", middleware.checkCampgroundOwnership,function(req, res){
	Campground.findById(req.params.id, function(error, campground){
		if(error){
			res.redirect("/campgrounds");
		}else{
			res.render("campgrounds/edit", {campground:campground});
		}
	});
});


//UPDATE ROUTE (logic route that handles updating a particular campground)
//** Note that we call a middleware function on this route to check and see if a user is logged in, and if they created the specific campground.
//** The middleware will prevent people from updating the campground if they aren't the user that made it.
router.put("/:id", middleware.checkCampgroundOwnership ,function(req, res){
	//Remember this mongoose/mongoDB method we can use to find a certain campground and update it all in one swoop. 
	//It takes three arguments, 1. the 'id' to look for, 2. the data to update, 3. the callback function
	Campground.findByIdAndUpdate(req.params.id, req.body.data, function(error, campground){
		if(error){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});


//DELETE ROUTE (Nothing visual, just finds the campground and deletes it)
router.delete("/:id", middleware.checkCampgroundOwnership ,function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(error){
		if(error){
			console.log(error);
		}else{
			res.redirect("/campgrounds");
		}
	});
});




module.exports = router;