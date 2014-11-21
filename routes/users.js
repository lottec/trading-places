var express = require('express');
var router = express.Router();

router.post('/register', function(req, res){
  res.redirect('/');
});

var loginPost = function(req, res) {
  var userName = req.body.userName;
  if (userName)
    req.session.user = {name: userName};

  res.redirect('/');
};

router.post('/login', loginPost);

var isLoggedInGet = function(req, res){
  if (req.session.user) {
    res.send(req.session.user);
  }  else {
    res.send();
  }
};

router.get('/isLoggedIn', isLoggedInGet);

var logoutGet = function(req, res) {
  if (req.session.user) {
    req.session.user = null;
  }
  res.redirect('/');
};

router.get('/logout', logoutGet);

module.exports = router;
module.testExports = {loginPost: loginPost, isLoggedInGet: isLoggedInGet, logoutGet: logoutGet};