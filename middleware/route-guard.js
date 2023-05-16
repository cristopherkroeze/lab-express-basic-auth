const User = require('../models/User.model.js');

const isLoggedIn = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/users/login');
  }
  User.findById(req.session.user._id)
    .then(()=>
      next()
    )
    .catch(error => console.log(error));
};

const isLoggedOut = (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/');
  }
  next();
};

module.exports = {
  isLoggedIn,
  isLoggedOut
};