const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');
const cors = require('cors');
const keys = require('./config/keys.js');
const jwt = require('jsonwebtoken');

const users = require('./routes/api/users');
const blogs = require('./routes/api/blogs');

const app = express();


const conn = mongoose.connect('//mongoURI',{ useNewUrlParser: true, useUnifiedTopology: true }, function(){
  console.log("mongo is running")
})


app.use(cors());

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

require('./models/User')
const User = mongoose.model('users')

app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport);

// Use Routes
app.use('/users', users);
app.use('/blogs', blogs);


const port = 8080

//Listen the HTTP Server
app.listen(port, () => {
    console.log("Server Is Running Port: " + port);
});
