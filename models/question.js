var mongoose = require("mongoose");

var questionSchema = new mongoose.Schema({
	question: String,
	answer: [String],
	correctAnswer: String,
	quiz: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Quiz"
		}
	}
});

module.exports = mongoose.model("Question", questionSchema);