var express = require('express');
var router = express.Router();
//var bcrypt = require('bcrypt');

router.post('/register', function(req, res){
  var userName = req.body.user;
  res.redirect('/');
});

router.post('/login', function(req, res) {
  console.log('login here');
  //var userName = req.body.user;
  //req.session.user = {user: userName};
  res.send();
});

//router.get('/isLoggedIn', function(req, res){
//  if (req.session.user) {
//    res.send(req.session.user);
//  }  else {
//    res.send();
//  }
//});
//router.get('/logout', function(req, res) {
//  if (req.session.user) {
//    req.session.user = null;
//  }
//  res.send();
//});

module.exports = router;
