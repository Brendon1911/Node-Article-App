const express     = require("express"),
      path        = require("path"),
      mongoose    = require("mongoose"),
      bodyParser  = require("body-parser"),
      expressValidator = require("express-validator"),
      flash = require("connect-flash"),
      session = require("express-session");

mongoose.connect("mongodb://brendon:pass123@ds215502.mlab.com:15502/node-article-app");
let db = mongoose.connection;

// Check connection
db.once("open", () => {
  console.log("Connected to database");
});

// Check for DB errors
db.on("error", (err) => {
  console.log(err);
});

// Init App
const app = express();

// Bring in Models
const Article = require("./models/article");

// Load View Engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

// Set Public Folder
app.use(express.static(path.join(__dirname, "public")));

// Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware
app.use(expressValidator());

// Home Route
app.get("/", (req, res) => {
  Article.find({}, (err, articles) => {
    if (err) {
      console.log(err);
    } else {
      res.render("index", {
        title: "Articles",
        articles: articles
      });
    }
  });
});

// Route Files
let articles = require("./routes/articles");
let users = require("./routes/users");
app.use("/articles", articles);
app.use("/users", users);

// Start Server
app.listen(3000, () => {
  console.log("Server started on port 3000...");
});