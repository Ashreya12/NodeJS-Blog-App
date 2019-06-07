var express 		= require("express"),
	bodyParser 		= require("body-parser"),
	mongoose 		= require("mongoose"),
	methodOverride 	= require("method-override"),
	app 			= express(),
	blogs 			= require("./blogs"),
	auth 			= require("./auth");


//APP CONFIGURATION
mongoose.connect("mongodb://127.0.0.1/myFirstApp");
app.set("view engine" , "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));














app.use(auth);
app.use("/blogs", blogs);
app.listen(3000, "127.0.0.1", function(){
	console.log("Server running on port 3000.");
});