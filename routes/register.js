var express = require('express');
var router = express.Router();

router.get('/', function(req,res) {
  res.render('register', { title: 'Register details' });
});

module.exports = router;
