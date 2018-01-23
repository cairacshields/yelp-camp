	var mongoose = require("mongoose");
	// ** Create a Schema for our campgrounds

	var campgroundSchema = new mongoose.Schema({
		name: String,
		price:String,
		image:String,
		description: String,
		author:{
			id:{
				type:mongoose.Schema.Types.ObjectId,
				ref:"User"
			},
			username:String
		},
		 comments: [
		    {
		      type: mongoose.Schema.Types.ObjectId,
		      ref: "Comment"
		    },
		  ]

	}, {usePushEach: true});

	// ** Be sure to create the model from your Schema in order to utilize the Mongodb methods, and export it so we can use it in other files
	module.exports = mongoose.model("Campground", campgroundSchema);


