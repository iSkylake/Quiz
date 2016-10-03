var express = require("express"),
	router = express.Router(),
	Quiz = require("../models/quiz"),
	Question = require("../models/question"),
	middleware = require("../middleware");

router.get("/", function(req, res){
	Quiz.find({}, function(err, quizzes){
		if(err){
			console.log(err);
		} else{
			res.render("quizzes/index", {quizzes: quizzes});
		}
	});
});

router.get("/new", middleware.isLoggedIn, function(req, res){
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
			res.redirect("quizzes/"+newQuiz._id+"/questions/new");
		}
	});
});

router.get("/:id", function(req, res){
	Quiz.findById(req.params.id).populate("questions").exec(function(err, quiz){
		if(err){
			console.log(err);
		} else{
			res.render("quizzes/quiz", {quiz: quiz})
		}
	});
});

router.post("/:id/score", function(req, res){
	Quiz.findById(req.params.id).populate("questions").exec(function(err, quiz){
		if(err){
			console.log(err);
		} else{
			console.log("Correct: ", req.body.answer[2]);
			console.log(req.params.id);
			var correct = 0;
			var totalQuestion = quiz.questions.length;
			for(i=0; i<totalQuestion; i++){
				// temporal = "answer["+i+"]";
				// console.log(temporal);
				console.log(req.body.answer[i]);
				if(req.body.answer[i] === quiz.questions[i].correctAnswer){
					correct++;
				}
			}
			var score = Math.round(correct/totalQuestion*100);
			var quizId = req.params.id;
			console.log(score);
			res.render("quizzes/score", {score: score, correct: correct, totalQuestion: totalQuestion, quizId: quizId});
		}
	});
});


module.exports = router;