var express = require("express"),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	methodOverride = require("method-override"),
	passport = require("passport"),
	localStrategy = require("passport-local"),
	flash = require("connect-flash"),
	app = express();

// DB Models
var User = require("./models/user");

// Routes
var indexRoutes = require("./routes/index"),
	quizzesRoutes = require("./routes/quizzes"),
	questionRoutes = require("./routes/question");

mongoose.Promise = global.Promise; // Used to debug mpromise deprecation
mongoose.connect(process.env.DATABASEURL || "mongodb://localhost/quiz");
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(flash());

app.use(require("express-session")({
	secret: "Some random text for secret",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use(indexRoutes);
app.use("/quizzes", quizzesRoutes);
app.use("/quizzes/:id", questionRoutes);

app.listen(process.env.PORT || 3000, function(){
	console.log("Server Started");
});