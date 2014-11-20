var express = require('express');
var router = express.Router();

router.get('/', function(req,res) {
  res.render('register', { title: 'Register details' });
});

//router.post('/', function(req,res) {
//  console.log('asdfadsfadf');
//  res.render('index', { title: 'registering' });
//});


module.exports = router;
