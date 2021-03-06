//hello world express.js app

//import the expressjs framework
const express = require("express");

//instanciate the app and start it to listen on a port
const app = express();

// use body parser : Todo: find out why body parser three lines below does not work when you put it after the other app.use lines
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));

//connect to our mongodb database via mongoose
const db = require("./config/keys").mongoURI;

const mongoose = require("mongoose");
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("Mongo DB connection success!"))
  .catch(err => console.log(err));

//Handle your first default request
// app.get('/', (req, res) => res.send("Hello World Kunal"));

//import all the resources
const users = require("./routes/api/users");
app.use("/api/users", users);

/* add passport, but only after user schema is registered above */

const passport = require("passport");
app.use(passport.initialize());
// add passport config
require("./config/passport")(passport);

const profiles = require("./routes/api/profiles");
app.use("/api/profiles", profiles);
const posts = require("./routes/api/posts");
app.use("/api/posts", posts);

const transactions = require("./routes/api/transaction");
app.use("/api/transactions", transactions);

// node path module helps you get the current directory
const path = require("path");
// Server static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder which will be generated from post build step
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
