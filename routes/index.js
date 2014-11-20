var express = require('express');
var router = express.Router();
//Get user session!!!
var user = '';

///* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Trading Places', user: user});
});

module.exports = router;
