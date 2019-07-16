var express = require("express");
var router = express.Router();

// Redirect to paginated page
router.get("/", function(req, res, next) {
  res.redirect("/books/pages/1");
});

router.get("/books", function(req, res, next) {
  res.redirect("/books/pages/1");
});

module.exports = router;
