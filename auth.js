var express 			= require("express"),
	bodyParser 			= require("body-parser"),
	mongoose 			= require("mongoose"),
	flash				= require("connect-flash"),
	methodOverride 		= require("method-override"),
	expressSanitizer 	= require("express-sanitizer"),
	passport			= require("passport"),
	LocalStrategy		= require("passport-local"),
	router				= express.Router(),
	User				= require("./models/user");


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

router.get("/", function(req, res){
	res.render("landingPage");
});

//PASSPORT CONFIGURATION
router.use(require("express-session")({
	secret: "General Kakera",
	resave: false,
	saveUninitialized: false
}));
router.use(passport.initialize());
router.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//AUTH ROUTES
router.get("/register", function(req, res){
	res.render("register");
});
router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/blogs");
		});
	});
});

router.get("/login", function(req, res){
	res.render("login");
});
router.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/blogs",
		failureRedirect: "/login"
	}), function(req, res){
});
router.get("/logout", function(req, res){
	req.logout();
	res.redirect("/blogs");
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}



module.exports = router;