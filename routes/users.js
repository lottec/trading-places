var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();
var request = require('superagent');
var host = 'http://db.cistechfutures.net'
var port = 8098;

var loginPost = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  if (username && password) {

    request
    .get(host + ":" + port + "/riak/mt-register/" + username)
    .end(function(result){
      var hash = result.body.data.password;
      var invalid = true;

      if (hash) {
        if (bcrypt.compareSync(password, hash)) {
          invalid = false;
          req.session.user = {username: username};
        }
      }
      res.redirect('/?invalid=' + invalid);
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
    var username = req.body.username;
    var password = req.body.password;

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);

    request.post(host + ":" + port + "/riak/mt-register/" + username)
    .set('Content-Type', 'application/json')
    .send({
      "event": "registration",
      "timestamp": Date.now(),
      "data": {
        "username": username,
        "password": hash,
        "email": req.body.email,
        "first_name": req.body.firstName,
        "surname": req.body.surname,
        "num_team_members": req.body.numberOfTeamMembers,
        "department": req.body.department
      }
    })
    .end(function() {
      res.redirect('/');
    });

  };

  router.post('/register', registerPost);

  module.exports = router;
  module.testExports = {loginPost: loginPost, isLoggedInGet: isLoggedInGet, logoutGet: logoutGet, registerPost: registerPost};
