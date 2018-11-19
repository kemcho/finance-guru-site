//hello world express.js app

//import the expressjs framework
const express = require('express');


//instanciate the app and start it to listen on a port
const app = express();
const port = process.env.PORT || 5000;
app.listen(port, () => console.log (`Server running on port ${port}`));

//connect to our mongodb database via mongoose
const db = require("./config/keys").mongoURI;

const mongoose = require('mongoose');
mongoose.connect(db,{useNewUrlParser:true})
    .then(() => console.log("Mongo DB connection success!"))
    .catch((err) => console.log(err))

//Handle your first default request
app.get('/', (req, res) => res.send("Hello World Kunal"));


//import all the resources
const users = require('./routes/api/users');
app.use('/api/users', users);
const profiles = require('./routes/api/profiles')
app.use('/api/profiles', profiles);
const posts = require('./routes/api/posts')
app.use('/api/posts', posts);





