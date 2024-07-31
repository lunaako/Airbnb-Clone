const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const { environment } = require('./config');
const isProduction = environment === 'production'; // True if environment is in production or not by checking environment key in config/index.js file

const app = express();  // Initialize the Express app

const routes = require('./routes');

app.use(morgan('dev')); // Connect the morgan middleware for logging information about requests and responses

app.use(cookieParser());  // Parses cookies
app.use(express.json());  // Parses JSON bodies of 'application/json' requests

// Security Middleware
if (!isProduction) {
  // enable cors only in development
  app.use(cors());
}

// helmet helps set a variety of headers to better secure your app
app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin"
  })
);

// Set the _csrf token and create req.csrfToken method
app.use(
  csurf({
    cookie: {
      secure: isProduction,
      sameSite: isProduction && "Lax",
      httpOnly: true
    }
  })
);

app.use(routes); // Connect all the routes

module.exports = app;