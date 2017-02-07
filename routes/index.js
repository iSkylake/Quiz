var express = require("express"),
	passport = require("passport"),
	router = express.Router();

var User = require("../models/user");

// Landing page
router.get("/", function(req, res){
	res.render("newlanding");
})

// Login page
router.get("/login", function(req, res){
	res.render("login");
});

// Sign up page
router.get("/register", function(req, res){
	res.render("register");
});

// Create account
router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/");
		});
	});
});

// Login
router.post("/login", passport.authenticate("local",
	{
		successRedirect: "/",
		failureRedirect: "/login"
	}), function(req, res){
});

// Logout
router.get("/logout", function(req, res){
	req.logout();
	// req.flash("success", "Successfully logged out");
	res.redirect("/");
});

module.exports = router;