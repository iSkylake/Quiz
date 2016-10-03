var Quiz = require("../models/quiz"),
	User = require("../models/user");

var middlewareObj = {};

middlewareObj.checkQuizOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Quiz.findById(req.params.id, function(err, quiz){
			if(err){
				res.redirect("back");
			} else{
				if(quiz.author.id.equals(req.user._id)){
				next()
				} else{
					res.redirect("back");
				}
			}
		});
	}
}

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You must login");
	res.redirect("/login");
}

module.exports = middlewareObj