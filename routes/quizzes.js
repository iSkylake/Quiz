var express = require("express"),
	router = express.Router(),
	Quiz = require("../models/quiz"),
	Question = require("../models/question");

router.get("/", function(req, res){
	Quiz.find({}, function(err, quizzes){
		if(err){
			console.log(err);
		} else{
			res.render("quizzes/index", {quizzes: quizzes});
		}
	});
});

router.get("/new", isLoggedIn, function(req, res){
	res.render("quizzes/new");
});

router.post("/", function(req, res){
	var name = req.body.name;
	var image = req.body.category;
	var creator = {
		id: req.user._id,
		username: req.user.username
	};
	var newQuiz = {name: name, image: image, creator: creator};
	Quiz.create(newQuiz, function(err, newQuiz){
		if(err){
			console.log(err);
		} else{
			console.log(newQuiz._id);
			res.redirect("quizzes/new/"+newQuiz._id);
		}
	});
});

router.get("/new/:id", function(req, res){
	Quiz.findById(req.params.id, function(err, quizId){
		if(err){
			console.log(err);
		} else{
			res.render("quizzes/question", {quizId: quizId})
		}
	});
});

router.post("/new/:id", function(req, res){
	var question = req.body.question;
	var correctAnswer = req.body.correctAnswer;
	var answer = [];
	answer.push(req.body.correctAnswer, req.body.answer1, req.body.answer2, req.body.answer3);
	// var quiz = {
	// 	id: req.params.id
	// };
	var newQuestion = {question: question, correctAnswer: correctAnswer, answer: answer}
	Question.create(newQuestion, function(err, newQuestion){
		if(err){
			console.log(err);
		} else{
			res.redirect("/quizzes");
		}
	});
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = router;