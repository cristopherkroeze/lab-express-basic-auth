var express = require('express');
var router = express.Router();

const bcrypt = require('bcryptjs')
const saltRounds = 10
const User = require('../models/User.model')


router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/signup', (req, res, next) => {
  res.render('signup.hbs')
})

router.post("/signup", (req, res) => {
  const { username, password } = req.body;

  bcrypt
    .genSalt(saltRounds)
    .then((salt) => bcrypt.hash(password, salt))
    .then((passwordHash) => {
      return User.create({
        username,
        password: passwordHash,
      });
    })
    .then(() => {
      res.redirect('/users/login')
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get('/login', (req, res, next) => {
  res.render('login.hbs')
})

router.post("/login", (req, res, next) => {
  const { username, password } = req.body;

  if (username === "" || password === "") {
    res.render("login.hbs", {
      errorMessage: "Please enter both, username and password to login.",
    });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        res.render("login.hbs", {
          errorMessage: "Username or password is incorrect.",
        });
        return;
      } else if (bcrypt.compareSync(password, user.password)) {
        req.session.user = user;
        res.redirect(`/`);
      } else {
        res.render("login.hbs", {
          errorMessage: "Username or password is incorrect.",
        });
      }
    })
    .catch((error) => next(error));
});


router.get('/logout', (req, res, next) => {
  req.session.destroy(err => {
    if (err) next(err);
    res.redirect('/');
  });
});

module.exports = router;