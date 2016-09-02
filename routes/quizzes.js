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
			res.redirect("quizzes/"+newQuiz._id+"/questions/new");
		}
	});
});


// router.get("/:id/questions/new", function(req, res){
// 	Quiz.findById(req.params.id, function(err, quiz){
// 		if(err){
// 			console.log(err);
// 		} else{
// 			res.render("quizzes/question", {quiz: quiz});
// 		}
// 	});
// });

// router.post("/:id/questions", function(req, res){
// 	Quiz.findById(req.params.id, function(err, quiz){
// 		if(err){
// 			console.log(req.params.id);
// 			console.log(err);
// 		} else{
// 			var question = req.body.question;
// 			var correctAnswer = req.body.correctAnswer;
// 			var answer = [];
// 			answer.push(req.body.correctAnswer, req.body.answer1, req.body.answer2, req.body.answer3);
// 			var newQuestion = {question: question, correctAnswer: correctAnswer, answer: answer}
// 			Question.create(newQuestion, function(err, question){
// 				if(err){
// 					console.log(err);
// 				} else{
// 					quiz.questions.push(question);
// 					quiz.save();
// 					res.redirect("back");
// 				}
// 			});
// 		}
// 	});
// });

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

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = router;