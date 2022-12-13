const path = require('path');

const express = require('express');
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

const blogRoutes = require('./routes/blog');

const app = express();

// Activate EJS view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true })); // Parse incoming request bodies
app.use(express.static('public')); // Serve static files like CSS files

// Set Cookie Parser, sessions and flash
app.use(cookieParser("NotSoSecretStringForCookies"));
app.use(session({
  secret : "NotSoSecretStringForCookies",
  cookie: { maxAge: 60000 },
  resave: true,
  saveUninitialized: true
}));
app.use(flash());

app.use(blogRoutes);

app.use(function (error, req, res, next) {
  // Default error handling function
  // Will become active whenever any route / middleware crashes
  console.log(error);
  res.status(500).render('500');
});

app.listen(3000);
