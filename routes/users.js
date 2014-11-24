var express = require('express');
var router = express.Router();
var request = require('superagent');
var host = 'http://db.cistechfutures.net'
var port = 8098;

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


  var registerPost = function(req, res) {
    console.log('entered register post function');
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
    var department = req.body.department;
    var numberOfTeamMembers = req.body.numberOfTeamMembers;
    var firstName = req.body.firstName;
    var surname = req.body.surname;

    request.post(host + ":" + port + "/riak/mt-register/" + username)
    .set('Content-Type', 'application/json')
    .send({
      "username": username,
      "password": password,
      "email": email
    })
    .end(function() {
      res.redirect('/');
    });

  };

  router.post('/register', registerPost);

  module.exports = router;
  module.testExports = {loginPost: loginPost, isLoggedInGet: isLoggedInGet, logoutGet: logoutGet, registerPost: registerPost};
