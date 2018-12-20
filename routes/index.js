var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile("splash960.html", {root: "./public"});
});

/* GET play page. */
router.get('/play', function(req, res, next) {
  res.sendFile("game960.html", {root: "./public"});
});

/* GET rules page. */
router.get('/rules', function(req, res, next) {
  res.sendFile("rules.html", {root: "./public"});
});

module.exports = router;
