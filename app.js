var express    = require("express"),
	bodyParser = require("body-parser"),
	mongoose   = require("mongoose"),
	seedDB	   = require("./seeds"),
	Comment    = require("./models/comment"),
	Campground = require("./models/campground"),
	User       = require("./models/user"),
	passport   = require("passport"),
	passportLocal = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose"),
	campgroundroutes = require("./routes/campground"),
	commentroutes = require("./routes/comment"),
	indexroutes = require("./routes/index"),
	methodOverride = require("method-override");
	flash = require("connect-flash");
var app = express();
 app.set("view engine","ejs");
 app.use(express.static(__dirname + "/public"));
 app.use(bodyParser.urlencoded({extended:true}));
 mongoose.connect("mongodb://localhost/Yelp_campv3");
	seedDB();
 //passport routes
 app.use(require("express-session")({
	secret:"I love my INDIA",
	resave:false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
//gives user details to all  webpages
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.success = req.flash("success");
   res.locals.error = req.flash("error");
   next();
});

passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(methodOverride('_newmethod'));
app.use(campgroundroutes);
app.use(commentroutes);
app.use(indexroutes);


 app.listen(process.env.PORT || 3000,function(req,res){
	console.log("Yelcamp server started");
 });
 
 
 
 
 
 
 
 
  /*var campgrounds = [
	{name: "Spiti Valley, Himachal Pradesh" ,image:"https://toib.b-cdn.net/wp-content/uploads/2017/08/spiti-valley-himachal-pradesh.jpg"},
	{name: "Chandratal Lake, Himachal Pradesh" ,image:"https://toib.b-cdn.net/wp-content/uploads/2017/08/chandratal-lake-himachal-pradesh.jpg"},
	{name: "Solang Valley, Manali" ,image:"https://toib.b-cdn.net/wp-content/uploads/2017/08/solang-valley-manali.jpg"},
	{name: "Rishikesh, Uttarakhand" ,image:"https://toib.b-cdn.net/wp-content/uploads/2017/08/rishikesh-uttarakhand.jpg"}
 ];*/
 
