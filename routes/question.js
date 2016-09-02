var express = require("express"),
	router = express.Router({mergeParams: true}),
	Quiz = require("../models/quiz"),
	Question = require("../models/question");

router.get("/questions/new", function(req, res){
	Quiz.findById(req.params.id, function(err, quiz){
		if(err){
			console.log(err);
		} else{
			res.render("quizzes/question", {quiz: quiz});
		}
	});
});

router.post("/questions", function(req, res){
	Quiz.findById(req.params.id, function(err, quiz){
		if(err){
			console.log(req.params.id);
			console.log(err);
		} else{
			var question = req.body.question;
			var correctAnswer = req.body.correctAnswer;
			var answer = [];
			answer.push(req.body.correctAnswer, req.body.answer1, req.body.answer2, req.body.answer3);
			var newQuestion = {question: question, correctAnswer: correctAnswer, answer: answer}
			Question.create(newQuestion, function(err, question){
				if(err){
					console.log(err);
				} else{
					quiz.questions.push(question);
					quiz.save();
					res.redirect("back");
				}
			});
		}
	});
});

module.exports = router;