var express = require('express');
var router = express.Router();

router.get('/', function(req,res) {
  res.render('register', { title: 'Register - Trading Places', user_exists: req.param("user_exists")});
});

module.exports = router;
