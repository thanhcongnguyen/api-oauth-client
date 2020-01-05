var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
var logger = require('morgan');
var app = express();
const path = require('path');
var cors = require('cors');

//import routes
const indexRouter = require('./src/routes/index.route');

app.use(express.static(path.resolve('./uploads')));
app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser());
app.use(cors());


//use routes
app.use('/api', indexRouter);
module.exports = app;
