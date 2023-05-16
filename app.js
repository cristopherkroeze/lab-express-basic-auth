// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv/config');
require('dotenv');

// ℹ️ Connects to the database
require('./db');

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require('express');
var mongoose = require('mongoose')
var session = require('express-session')
var MongoStore = require('connect-mongo')
var path = require('path');

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require('hbs');
const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.set('trust proxy', 1);

// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require('./config')(app);

app.use(
    session({
      secret: process.env.SESS_SECRET,
      resave: true,
      saveUninitialized: false,
      cookie: {
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 60000
      }, 
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI

      })
    })
  );

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// 👇 Start handling routes here
const index = require('./routes/index');
var usersRouter = require('./routes/users');
var mainRouter = require('./routes/main')
var privateRouter = require('./routes/private')

app.use('/', index);
app.use('/users', usersRouter);
app.use('/main', mainRouter)
app.use('/private', privateRouter)

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(x => {
    console.log(`Connected to Mongo database: "${x.connections[0].name}"`);
  })
  .catch(err => {
    console.log(`An error occurred while connecting to the Database: ${err}`);
  });

module.exports = app;

