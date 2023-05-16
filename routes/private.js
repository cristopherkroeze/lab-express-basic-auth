const router = require("express").Router();
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');

router.get("/", isLoggedIn, (req, res, next) => {
  res.render("gif");
});

module.exports = router;