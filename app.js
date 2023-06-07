const express = require("express");
const app = express();
require("dotenv").config();
const csrf = require("csurf");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const PORT = process.env.PORT || 5000;

const { CreateSampleUsers } = require("./sample");

// middlewares
app.use(cors());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 },
  })
);

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// commented out this code for development purpose

// app.use(csrf());
// app.use((req, res, next) => {
//   res.set("csrf-token", req.csrfToken());
//   next();
// });

// app.use((err, req, res, next) => {
//   if (err.code !== "EBADCSRFTOKEN") return next(err);
//   res.status(403).json({ error: "Invalid CSRF token" });
// });

// loading all routes
fs.readdirSync("./routes/").forEach(function (file) {
  var route = "./routes/" + file;
  app.use(require(route));
});

app.get("/", (req, res) => {
  res.json({
    status: "ok",
  });
});

// test route
app.get("/session", (req, res) => {
  //   console.log(req.session);
  res.json(req.session);
});

app.listen(PORT, () => {
  console.log("Server started at port ", PORT);
});

// run this below code to quickly generate 3 user (admin,support and user) to get start testing apis
// run this below code only once to avoide any duplications

// CreateSampleUsers()
//   .then(() => {
//     console.log("all sample users created");
//   })
//   .catch((err) => {
//     console.log(err);
//   });
