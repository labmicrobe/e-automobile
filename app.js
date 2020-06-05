var express        = require("express"),
    app            = express(),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    passport       = require("passport"),
    LocalStrategy  = require("passport-local"),
    methodOverride = require("method-override"),
    Store          = require("./models/stores"),
    Comment        = require("./models/comment"),
    User           = require("./models/user")
    
//requiring routes
var commentRoutes    = require("./routes/comments"),
    storeRoutes      = require("./routes/stores"),
    indexRoutes      = require("./routes/index")
       
 // mongoose.connect('mongodb://localhost/automobile', {
	// useNewUrlParser: true,
	// useCreateIndex: true
 // }).then(() => {
	// console.log('Connected to DB!');
 // }).catch(err => {
	// console.log('ERROR:', err.message);
 // });

  mongoose.connect('mongodb+srv://dikshant:dikki99@cluster0-ox0zq.mongodb.net/<dbname>?retryWrites=true&w=majority', {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
  }).then(() => {
	console.log('Connected to DB!');
  }).catch(err => {
	console.log('ERROR:', err.message);
  });

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

// mongoose.set('useNewUrlParser', true);
// mongoose.set('useUnifiedTopology', true);
// mongoose.set('useCreateIndex', true); 
// mongoose.set('useNewUrlParser', true);
// mongoose.set('useUnifiedTopology', true);

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});

app.use("/", indexRoutes);
app.use("/stores", storeRoutes);
app.use("/stores/:id/comments", commentRoutes);

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");
});