var express = require('express');
var bcrypt = require('bcrypt');
var validator = require('validator');
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

    var invalid = false;
    console.log("entered register post");

    if (!validator.isLength(req.body.username, 3)) {
      invalid = true;
      console.log('failed form validation username');

    } else if (!validator.isLength(req.body.password, 3) || !validator.isLength(req.body.password_confirmation, 3)) {
      invalid = true;
      console.log('failed form validation password');

    } else if (!validator.equals(req.body.password, req.body.password_confirmation)) {
      invalid = true;
      console.log('failed form validation password_confirmation');

    } else if (!validator.isEmail(req.body.email)) {
      invalid = true;
      console.log('failed form validation email');

    } else if (!validator.isLength(req.body.first_name, 1) || !validator.isLength(req.body.surname, 1)) {
      invalid = true;
      console.log('failed form validation first_name surname');

    } else if (!validator.isLength(req.body.department, 1)) {
      invalid = true;
      console.log('failed form validation department');

    } else if (!validator.isNumeric(req.body.num_team_members)) {
      invalid = true;
      console.log('failed form validation num_team_members');

    }

    if (invalid) {
      console.log('failed form validation');
      res.redirect('/register');
    } else {
      console.log('passed form validation');
      request
          .get(host + ":" + port + "/riak/mt-register/" + username)
          .end(function(result){
            if (result.body.data) {
              console.log('username exists');
              res.redirect('/register/?user_exists=true');
            } else {
              console.log('username does not exist, creating');
              request.post(host + ":" + port + "/riak/mt-register/" + username)
                  .set('Content-Type', 'application/json')
                  .send({
                    "event": "registration",
                    "timestamp": Date.now(),
                    "data": {
                      "username": username,
                      "password": hash,
                      "email": req.body.email,
                      "first_name": req.body.first_name,
                      "surname": req.body.surname,
                      "num_team_members": req.body.num_team_members,
                      "department": req.body.department
                    }
                  })
                  .end(function () {
                    res.redirect('/');
                  });
            }
          });
    }
  };

  router.post('/register', registerPost);

  module.exports = router;
  module.testExports = {loginPost: loginPost, isLoggedInGet: isLoggedInGet, logoutGet: logoutGet, registerPost: registerPost};
