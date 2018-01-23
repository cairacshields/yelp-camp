// Beginning of YelpCamp code 

// Import packages below 
var expressSanitizer = require("express-sanitizer"),
	methodOverride   = require("method-override"),
	expressSession   = require("express-session"),
	bodyParser       = require("body-parser"),
	LocalStrategy    = require("passport-local"),
	express          = require("express"),
	mongoose         = require("mongoose"),
	flash			 = require("connect-flash"),
	passport		 = require("passport"),
	seedDB           = require("./seed.js"),
	User             = require("./models/user"),
	Comment          = require("./models/comment"),
	Campground       = require("./models/campground"),
	request          = require("request"),
	app              = express();

var campgroundRoutes = require("./routes/campgrounds"),
	commentRoutes    = require("./routes/comments"),
	indexRoutes      = require("./routes/index");
 
//Application settings
//mongoose.connect("mongodb://localhost/yelp_camp");
mongoose.connect("mongodb://cairacshields:Babygirl21@ds111598.mlab.com:11598/ycampv1")
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash()); 
app.set("view engine", "ejs");

//Seed the DB first
//seedDB();   


// PASSPORT CONFIGURATION //

app.use(expressSession({

	secret:"love your life",
	resave:false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); 

//The below app.use() contains a middleware function that stores the req.user value in a local variable called currentUser.
//Remember that any value in res.locals is accessible in all templates.
//So this line will run with every route and update the currentUser variable as needed. We use this to properly set up our navbar 
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

//The below app.use() statements will give us access to all of our routes.
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use(indexRoutes);

app.get("*", function(req, res){
	res.send("Wrong page");
});


app.listen(process.env.PORT || 2000, function(){
	console.log("Server Started!");
}) ;