var express 			= require("express"),
	methodOverride 		= require("method-override"),
	expressSanitizer 	= require("express-sanitizer"),
	bodyParser 			= require("body-parser"),
	mongoose 			= require("mongoose"),
	flash				= require("connect-flash"),
	router				= express.Router(),
//	seedDB				= require("./seeds"),
	Blog 				= require("./models/blog"),
	Comment 			= require("./models/comment");
	



//seedDB();
router.use(expressSanitizer());
router.use(methodOverride("_method"));
router.use(flash());
router.use(function timeLog (req, res, next) {
  //console.log('Time: ', Date.now())
  next()
});
router.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});



//ROUTES



//INDEX ROUTE
router.get("/", function(req, res){
	Blog.find({}, function(err, blogs){
		if(err){
			console.log("Error");
		} else{
			res.render("blogs/index", {blogs: blogs});
		}
	});
});

//NEW ROUTE
router.get("/new", isLoggedIn, function(req, res){
	res.render("blogs/new");
});

//CREATE ROUTE
router.post("/", isLoggedIn, function(req, res){
	//Create blog
	req.body.blog.body = req.sanitize(req.body.blog.body);
	var title = req.body.blog.title;
	var image = req.body.blog.image;
	var body = req.body.blog.body;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var nblog = {
		title: title,
		image: image,
		body: body,
		author: author
	};
	Blog.create(nblog, function(err, newBlog){
		//console.log(req.body.blog.body);
		if(err){
			res.render("blogs/new");
		} else{
			//Redirect to Index
			console.log(newBlog);
			res.redirect("/blogs");
		}
	});
});

//SHOW ROUTE
router.get("/:id", function(req, res){
	Blog.findById(req.params.id).populate("comments").exec(function(err, foundBlog){
		if(err){
			console.log(err);
			res.redirect("/blogs");
		} else {
			res.render("blogs/show", {blog: foundBlog});
		}
	});
});

//EDIT ROUTE
router.get("/:id/edit", checkUserOwner, function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		} else{
			res.render("blogs/edit", {blog: foundBlog});
		}
	});
	
});

//UPDATE ROUTE
router.put("/:id", checkUserOwner, function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		if(err){
			res.redirect("/blogs");
		} else{
			res.redirect("/blogs/" + req.params.id);
		}
	});
});

//DELETE ROUTE
router.delete("/:id", checkUserOwner, function(req, res){
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/blogs");
		} else{
			res.redirect("/blogs");
		}
	});
});

//COMMENT ROUTES

//router.get("/:id/comments/new", isLoggedIn, function(req, res){
//	Blog.findById(req.params.id, function(err, blog){
//		if(err){
//			console.log(err);
//		} else{
//			res.render("comments/new", {blog: blog});
//		}
//	});
//});

router.post("/:id/comments", isLoggedIn, function(req, res){
	Blog.findById(req.params.id, function(err, blog){
		if(err){
			console.log(err);
			res.redirect("/blogs");
		} else{
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
				} else{
					//Add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					//save comment
					blog.comments.push(comment);
					blog.save();
					res.redirect("/blogs/" + blog._id);
				}
			})
		}
	})
});

//EDIT COMMENT ROUTE
router.get("/:id/comments/:comment_id/edit", checkCommentOwner, function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			res.redirect("back");
		} else{
			res.render("comments/new", {blog_id: req.params.id, comment: foundComment});	
		}
	});
});
 
 //UPDATE COMMENT ROUTE
router.put("/:id/comments/:comment_id", checkCommentOwner, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			res.redirect("back");
		} else{
			res.redirect("/blogs/" + req.params.id);
		}
	})
});

//DESTROY COMMENT ROUTE
router.delete("/:id/comments/:comment_id", checkCommentOwner, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		} else{
			res.redirect("/blogs/" + req.params.id);
		}
	});
});


function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

function checkUserOwner(req, res, next){
	if(req.isAuthenticated()){
		Blog.findById(req.params.id, function(err, foundBlog){
			if(err){
				res.redirect("back");
			} else {
				if(foundBlog.author.id.equals(req.user.id)){
					next();
				} else{
					res.redirect("back");
				}
			}
		});
	} else{
		res.redirect("back");
	}
}

function checkCommentOwner(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				res.redirect("back");
			} else {
				if(foundComment.author.id.equals(req.user.id)){
					next();
				} else{
					res.redirect("back");
				}
			}
		});
	} else{
		res.redirect("back");
	}
}



module.exports = router;