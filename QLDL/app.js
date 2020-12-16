var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var logger = require("morgan");
const mongoose = require("mongoose");
var passport = require("passport");
var flash = require("connect-flash");
var bodyParser = require("body-parser");
require("dotenv").config();
var cron = require("node-cron");
var sythentic = require("./handling_data/warehouse");
require("./middlewares/passport");

const userRouter = require("./routes/user");
const docRouter = require("./routes/document");
const themeRouter = require("./routes/theme");

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/QLDL_V1",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  }
);

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: "tlcn",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(express.static(path.join(__dirname, "public")));

app.use("/api/user", userRouter);
app.use("/api/doc", docRouter);
app.use("/api/theme", themeRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

cron.schedule("50 17 * * *", function () {
  console.log("---------------------");
  console.log("Running Cron Job");
  sythentic.update_warehouse();
});

module.exports = app;
