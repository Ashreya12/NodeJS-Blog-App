var mongoose = require("mongoose");
var Blog = require("./models/blog");
var Comment = require("./models/comment");

var data = [
	{
		title: "Blog1",
		image: "https://images.pexels.com/photos/292442/pexels-photo-292442.jpeg?auto=compress&cs=tinysrgb&h=350",
		body: "blah blah blah",
		//created: ,
	},
	{
		title: "Blog2",
		image: "https://images.pexels.com/photos/707915/pexels-photo-707915.jpeg?auto=compress&cs=tinysrgb&h=350",
		body: "blah blah blah",
		//created: ,
	},
	{
		title: "Blog3",
		image: "https://images.pexels.com/photos/87840/daisy-pollen-flower-nature-87840.jpeg?auto=compress&cs=tinysrgb&h=350",
		body: "blah blah blah",
		//created: ,
	}
]

function seedDB(){
	//Remove all blogs
	Blog.remove({}, function(err){
//		if(err){
//			console.log(err);
//		}
//		console.log("removed blogs");
//
//		//Add blogs
//		data.forEach(function(seed){
//		Blog.create(seed, function(err, blog){
//			if(err){
//				console.log(err);
//			} else{
//				console.log("added a blog");
//				//Create a comment
//				Comment.create(
//						{
//							text: "Hello there!",
//							author: "Loki"
//						}, function(err, comment){
//							if(err){
//								console.log(err);
//							} else{
//								console.log("added a comment");
//								blog.comments.push(comment);
//								blog.save();
//							}
//							});
//			}
//		});
//	});
	});

	
};

 module.exports = seedDB;