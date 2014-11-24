var express = require('express');
var router = express.Router();
var request = require('superagent');
var host = 'http://db.cistechfutures.net'
var port = 8098;
var bcrypt = require('bcrypt');

var loginPost = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  if (username && password) {

    request
    .get(host + ":" + port + "/riak/mt-register/" + username)
    .end(function(result){
      var hash = result.body.password;
      if (hash) {
        if (bcrypt.compareSync(password, hash)) {
          req.session.user = {username: username};
        }
      }
      res.redirect('/');
    });


  } else {
    res.redirect('/');
  }
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

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);

    request.post(host + ":" + port + "/riak/mt-register/" + username)
    .set('Content-Type', 'application/json')
    .send({
      "username": username,
      "password": hash,
      "email": email,
      "first_name": firstName,
      "surname": surname,
      "num_team_members": numberOfTeamMembers,
      "department": department
    })
    .end(function() {
      res.redirect('/');
    });

  };

  router.post('/register', registerPost);

  module.exports = router;
  module.testExports = {loginPost: loginPost, isLoggedInGet: isLoggedInGet, logoutGet: logoutGet, registerPost: registerPost};
