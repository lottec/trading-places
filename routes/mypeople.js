var express = require('express');
var router = express.Router();
var request = require('superagent');
var host = 'http://db.cistechfutures.net';
var port = 8098;
var validator = require('validator');

router.get('/', function(req,res) {
    getTeamMembers(req, function(teamMembers) {
        res.render('mypeople', { title: 'My People - Trading Places', team_members: teamMembers, route: 'mypeople' });
    });
    
});

var addPost = function(req, res) {
    if (!req.session.user) {
        res.redirect('/');
    } else {
<<<<<<< HEAD
        console.log(req.session.user.username);
        request
            .get(host + ":" + port + "/riak/mt-register/" + req.session.user.username)
            .end(function(result) {
                console.log(result);
                var manager_email = result.body.data.email;
                var invalid = false;

                if (!validator.isLength(req.body.first_name, 1) || !validator.isLength(req.body.surname, 1) ||
                    !validator.isLength(req.body.job_title, 1)) {
                    invalid = true;
                }

                if (invalid) {
                    res.redirect('/mypeople?invalid=true');
                } else {
                    request.post(host + ":" + port + "/riak/mt-add-team-member/")
                        .set('Content-Type', 'application/json')
                        //.set('x-riak-index-manager_bin', 'testing')
                        .send({
                            "event": "add_team_member",
                            "timestamp": Date.now(),
                            "data": {
                                "manager_email": manager_email,
                                "first_name": req.body.first_name,
                                "surname": req.body.surname,
                                "job_title": req.body.job_title,
                                "expert": req.body['expert_skills[]'],
                                "intermediate": req.body['intermediate_skills[]'],
                                "basic": req.body['basic_skills[]'],
                                "availability": req.body.availability?true:false,
                                "availability_duration": {
                                    "equality": req.body.equality,
                                    "number": req.body.num,
                                    "unit": req.body.unit
                                },
                                "manager": req.session.user.username
                            }
                        })
                        .end(function () {
                            res.redirect('/mypeople');
                        });
                }
            });
=======

        var invalid = false;

        if (!validator.isLength(req.body.first_name, 1) || !validator.isLength(req.body.surname, 1) ||
            !validator.isLength(req.body.job_title, 1)) {
            invalid = true;
        }

        if (invalid) {
            res.redirect('/mypeople?invalid=true');
        } else {
            request.post(host + ":" + port + "/riak/mt-add-team-member/")
                .set('Content-Type', 'application/json')
                //.set('x-riak-index-manager_bin', 'testing')
                .send({
                    "event": "add_team_member",
                    "timestamp": Date.now(),
                    "data": {
                        "first_name": req.body.first_name,
                        "surname": req.body.surname,
                        "job_title": req.body.job_title,
                        "expert": req.body['expert_skills[]'],
                        "intermediate": req.body['intermediate_skills[]'],
                        "basic": req.body['basic_skills[]'],
                        "availability": req.body.availability?true:false,
                        "availability_duration": {
                            "equality": req.body.availability?req.body.equality:null,
                            "number": req.body.availability?req.body.num:null,
                            "unit": req.body.availability?req.body.unit:null
                        },
                        "manager": req.session.user.username
                    }
                })
                .end(function () {
                    res.redirect('/mypeople');
                });
        }
>>>>>>> 8b3e69cf6f370020e3a24b8e61210fe2db511509
    }
};

router.post('/add_team_member', addPost);

var getTeamMembers = function(req, callback) {

    var teamMembers = [];
    var i = 1;

    request
        .get(host + ":" + port + "/buckets/mt-add-team-member/keys?keys=true")
        .end(function(error, result){
            var keys = JSON.parse(result.text).keys;

            keys.forEach(function(key) {
                request
                    .get(host + ":" + port + "/riak/mt-add-team-member/" + key)
                    .end(function(error, result){

                        try {
                            var json = JSON.parse(result.text);
                            if (json.data.manager == req.session.user.username) {
                                teamMembers.push(json);
                            }
                        } catch (e) {

                        }

                        if (i == keys.length) {
                            callback(teamMembers);
                        }
                        i++;
                    });

            });
        });
};


router.get('/get_team_members', getTeamMembers);

module.exports = router;
module.testExports = {addPost: addPost, getTeamMembers: getTeamMembers, request: request, host: host, port: port};
