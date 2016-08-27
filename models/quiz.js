var mongoose = require("mongoose");

var quizSchema = new mongoose.Schema({
	name: String,
	image: String,
	creator: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	}
});

module.exports = mongoose.model("Quiz", quizSchema);