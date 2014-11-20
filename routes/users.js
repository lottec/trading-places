var express = require('express');
var router = express.Router();
//var bcrypt = require('bcrypt');

router.post('/register', function(req, res){
  //console.log(req.body.userName);
  res.render('index', { title: 'Registered!!', user: req.body.name});

});

router.post('/login', function(req, res) {
  console.log('login here');
  var userName = req.body.user;
  //var password = req.body.password;
  res.render('index', { title: 'Trading Places', user: userName});
});

//router.get('/isLoggedIn', function(req, res){
//  if (req.session.user) {
//    res.send(req.session.user);
//  }  else {
//    res.send();
//  }
//});
//
//router.get('/logout', function(req, res) {
//  if (req.session.user) {
//    req.session.user = null;
//  }
//  res.send();
//});

module.exports = router;
