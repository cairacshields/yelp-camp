var mongoose = require("mongoose");


var commentSchema = new mongoose.Schema({
	text:String,
	//Here we are embedding some User data into our comment model by referencing the 'id' and 'username' 
	// ** We are referncing comments using the below structure 
	author:{
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref:"User"
		},
		username:String
	}
});


module.exports = mongoose.model("Comment", commentSchema);