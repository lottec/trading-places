var requireFrom = require('require-from');
var eventProcessor = requireFrom('exports', module, '../event_processing/event_router.js');
var express = require('express');
var bcrypt = require('bcrypt');
var validator = require('validator');
var router = express.Router();
var query = require('../query/query.js');

var loginPost = function(req, res) {
  var username = req.body.username.toLowerCase();
  var password = req.body.password;

  if (username && password) {

      query.getObjectWithKey('test-user', username, function(result) {
          var invalid = true;

          try {
              var hash = result.body.password;

              if (hash) {
                  if (bcrypt.compareSync(password, hash)) {
                      invalid = false;
                      req.session.user = {username: username, full_name: result.body.first_name + ' ' + result.body.surname, email: result.body.email};
                  }
              }
          } catch(error) {
              invalid = true;
          }
          var callbackURLParam = req.body.callbackURL;

          if (!invalid) {

              res.redirect(callbackURLParam?callbackURLParam:'/mypeople');

          } else {

              var url = '/?invalid=' + invalid;
              if (callbackURLParam) {
                  url = url + '&callbackURL=' + callbackURLParam;
              }

              res.redirect(url);

          }
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
    var username = req.body.username.toLowerCase();
    var password = req.body.password;
    var salt;
    var hash;

    if (password) {
      salt = bcrypt.genSaltSync(10);
      hash = bcrypt.hashSync(password, salt);
    }

    var invalid = false;

    if (!validator.isLength(req.body.username, 3) ||
        !validator.isLength(req.body.password, 3) ||
        !validator.isLength(req.body.password_confirmation, 3) ||
        !validator.equals(req.body.password, req.body.password_confirmation) ||
        !validator.isEmail(req.body.email) ||
        !validator.isLength(req.body.first_name, 1) || !validator.isLength(req.body.surname, 1) ||
        !validator.isLength(req.body.department, 1) ||
        !validator.isNumeric(req.body.num_team_members)) {
      invalid = true;
    }

    if (invalid) {
      res.redirect('/register');
    } else {

        query.getObjectWithKey("test-user", username, function(result){
            try {
                if (result.body.password) {
                    invalid = true;
                }
            } catch(error) {

            }

            if (invalid) {
                res.redirect('/register/?user_exists=true');
            } else {
                eventProcessor.sendEvent(
                    {
                        "type": "test-user_create",
                        "key": username,
                        "data": {
                            "username": username,
                            "password": hash,
                            "email": req.body.email,
                            "first_name": req.body.first_name,
                            "surname": req.body.surname,
                            "num_team_members": req.body.num_team_members,
                            "department": req.body.department
                        }
                    },
                    function() {
                        res.redirect('/');
                    }
                );

            }
        });
    }
  };

  router.post('/register', registerPost);

  module.exports = router;
  module.testExports = {loginPost: loginPost, isLoggedInGet: isLoggedInGet, logoutGet: logoutGet, registerPost: registerPost};
