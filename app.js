var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var booksRouter = require("./routes/books");
var indexRouter = require("./routes/index");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/books", booksRouter);

// 404- Any server error
app.use(function(err, req, res, next) {
  next(createError(404));
});

// 500 - Any server error
app.use(function(err, req, res, next) {
  next(createError(500));
});

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get("env") === "development" ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render("error");
// });

app.use((req, res, next) => {
  const error = new Error("PAGE NOT FOUND!!");
  error.status = 404;
  next(error);
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  if (err.status === 404) {
    console.log("404 - PAGE NOT FOUND!");
    res.render("page-not-found");
  } else {
    console.log("500 - INTERNAL SERVER ERROR");
    res.render("error");
  }
});

app.get("*", function(res) {
  res.render("page-not-found");
});
module.exports = app;
