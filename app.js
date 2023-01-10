const path = require('path');

const express = require('express');
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const mongoDbStore = require("connect-mongodb-session");

const blogRoutes = require('./routes/blog');
const app = express();

const MongoDBStore = mongoDbStore(session);

const sessionStore = new MongoDBStore({
  uri: "mongodb://127.0.0.1:27017",
  databaseName: "dbs-project-sessions",
  collection: "sessions",
});


// Activate EJS view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true })); // Parse incoming request bodies
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

//Set Cookie Parser, sessions and flash
app.use(cookieParser("NotSoSecretStringForCookies"));
//registering the session package
app.use(
  session({
    secret: "NotSoSecretStringForCookies",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
  })
);
app.use(flash());

app.use(blogRoutes);

app.use(function (error, req, res, next) {
  // Default error handling function
  // Will become active whenever any route / middleware crashes
  console.log(error);
  res.status(500).render('500');
});

app.listen(3000);
