//Seed file is used to generate dummy data, remove old data


var mongoose   = require("mongoose");
var Comment    = require("./models/comment");
var Campground = require("./models/campground");
var data = [

	{
		name:"Bangkock Rock",
		image:"http://www.buyseaislenj.com/sea_isle_city_cape_may_county_campgrounds_island_realty_group_12072011.jpg",
		description:"Lorem ipsum dolor sit amet, atqui nonumy atomorum ut pro, utroque civibus ponderum duo ea, te vix ignota aliquam. Epicurei erroribus est ut, has te nonumes pericula iracundia. Et case alterum per, quo cu facer assueverit. Mutat admodum est cu, cibo consequat ei mei, possim omittam iudicabit et sit. An usu graeci fuisset, ne commodo temporibus mel."
	},
	{
		name:"Tostitos Trails",
		image:"http://theknow.denverpost.com/wp-content/uploads/2017/07/camping_chamber-1080x663.jpg",
		description:"Lorem ipsum dolor sit amet, atqui nonumy atomorum ut pro, utroque civibus ponderum duo ea, te vix ignota aliquam. Epicurei erroribus est ut, has te nonumes pericula iracundia. Et case alterum per, quo cu facer assueverit. Mutat admodum est cu, cibo consequat ei mei, possim omittam iudicabit et sit. An usu graeci fuisset, ne commodo temporibus mel."
	},
	{
		name:"Bursting Sun Road",
		image:"https://www.campjellystone.com/wp/wp-content/uploads/2012/08/WisconsinCampgrounds1.jpg",
		description:"Lorem ipsum dolor sit amet, atqui nonumy atomorum ut pro, utroque civibus ponderum duo ea, te vix ignota aliquam. Epicurei erroribus est ut, has te nonumes pericula iracundia. Et case alterum per, quo cu facer assueverit. Mutat admodum est cu, cibo consequat ei mei, possim omittam iudicabit et sit. An usu graeci fuisset, ne commodo temporibus mel."
	}

];

//Here is the function we will export
function seedDB(){
	//First we want to remove the former data from the DB
	Campground.remove({}, function(error){
		if(error){
			console.log(error);
		}
		console.log("campgrounds removed");
		
		/*//Loop over the array of campgrounds and add each one to the DB.
		data.forEach(function(seed){
			Campground.create(seed, function(error, response){
				if(error){
					console.log(error);
				}else{
					console.log("Campground added");

					//now we create and associate the comments for each campground

					Comment.create({author:"Homer Simpson", text:"This smells like trees and hot dogs!"}, function(error, comment){
						if(error){
							console.log(error);
						}else{
							response.comments.push(comment);
							response.save();
							console.log("Comment saved");
						}
					});

				}
			});*/
		//});
	});
}
	



module.exports = seedDB;