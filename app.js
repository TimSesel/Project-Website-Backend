var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var mongoose = require("mongoose");
var mongoDB =
  "mongodb+srv://dyanamo:deepseadive@ms2cluster.ja7eaq8.mongodb.net/";
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error"));

var aedes = require("aedes")();
aedes.on("publish", (packet, client) => {
  console.log(
    `|===[Aedes]===|
     | Client: ${client ? client.id : "N/A"}
     | Topic: ${packet.topic}
     | Message: ${packet.payload.toString()}
     |=============|`
      .split("\n")
      .map((s) => s.trimStart())
      .join("\n"),
  );
});

var aedesTcpServer = require("net").createServer(aedes.handle);
aedesTcpServer.listen(1883);
var aedesHttpServer = require("http").createServer(aedes.handle);
require("websocket-stream").createServer(
  { server: aedesHttpServer },
  aedes.handle,
);
aedesHttpServer.listen(8888);

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/userRoutes");
var dataRouter = require("./routes/dataRoutes");

var app = express();

var cors = require("cors");
var allowedOrigins = ["http://localhost:3000", "http://localhost:3001"];
app.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          "The CORS policy does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  }),
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

var session = require("express-session");
var MongoStore = require("connect-mongo"); // session shranjujemo v mongoDB, za lažji development
// const { default: aedes } = require('aedes');
app.use(
  session({
    secret: "stjr 4lfe", // Default je 'work hard' thus I changed it PS: if session doesn't work, this is probably the cause
    resave: true,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: mongoDB }), // tle storamo session v mongo
  }),
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/datas", dataRouter);

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
  //res.render('error');
  res.json(err);
});

module.exports = app;
