var express = require("express"),
	passport = require("passport"),
	router = express.Router();

var User = require("../models/user");

router.get("/", function(req, res){
	res.render("landing");
})

router.get("/login", function(req, res){
	res.render("login");
});

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
			res.redirect("/");
		});
	});
});

router.post("/login", passport.authenticate("local",
	{
		successRedirect: "/",
		failureRedirect: "/login"
	}), function(req, res){
});

router.get("/logout", function(req, res){
	req.logout();
	res.redirect("/");
});

module.exports = router;