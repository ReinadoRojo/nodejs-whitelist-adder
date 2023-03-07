require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const path = require('path');


// Const setup
const app = express();


// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



// Middleware
// const logger = function (req, res, next) {
//   console.log(`New request: ${req.method} ${req.url} - ${req.ip}`);
//   next();
// }

// app.use(logger)
app.use(function (err, req, res, next) {
  res.status(500).send('Internal Server Error! We are working on it.');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

// Routes
app.use('/', require('./routes/index.routes'));



// Set static folder
app.use(express.static(path.join(__dirname, 'public')));


// Start the server
app.listen(process.env.PORT || 3000, () => {
  console.log('Server is running on port', process.env.PORT || 3000);
})