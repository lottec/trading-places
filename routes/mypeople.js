var requireFrom = require('require-from');
var express = require('express');
var router = express.Router();
var request = require('superagent');
var host = 'http://db.cistechfutures.net';
var port = 8098;
var validator = require('validator');
var eventProcessor = requireFrom('exports', module, '../event_processing/event_router.js');
var query = require('../query/query.js');


router.get('/', function(req,res) {
    getTeamMembers(req, function(teamMembers) {
        res.render('mypeople', { title: 'My People - Trading Places', team_members: teamMembers, route: 'mypeople', team_member_id: req.param("team_member_id")});
    });
    
});

var addPost = function(req, res) {
    if (!req.session.user) {
        res.redirect('/');
    } else {
        request
            .get(host + ":" + port + "/riak/test-user_create/" + req.session.user.username)
            .end(function(result) {
                var manager_email = result.body.data.email;
                var invalid = false;

                if (!validator.isLength(req.body.first_name, 1) || !validator.isLength(req.body.surname, 1) ||
                    !validator.isLength(req.body.job_title, 1)) {
                    invalid = true;
                }

                if (invalid) {
                    res.redirect('/mypeople?invalid=true');
                } else {
                    eventProcessor.sendEvent(
                        {
                            "type": "test-team-member_create",
                            "data": {
                                "manager_email": manager_email,
                                "first_name": req.body.first_name,
                                "surname": req.body.surname,
                                "job_title": req.body.job_title,
                                "expert": req.body['expert_skills[]'],
                                "intermediate": req.body['intermediate_skills[]'],
                                "basic": req.body['basic_skills[]'],
                                "availability": req.body.availability?true:true,
                                "availability_duration": {
                                    "equality": req.body.equality,
                                    "number": req.body.num,
                                    "unit": req.body.unit
                                },
                                "manager": req.session.user.username,
                                "manager_name": req.session.user.full_name
                            }
                        },
                        function() {
                                    res.redirect('/mypeople');
                                }
                    );
                }
            });
    }
};

router.post('/add_team_member', addPost);

var getTeamMembers = function(req, callback) {

    var teamMembers = [];
    var i = 1;

    request
        .get(host + ":" + port + "/buckets/test-team-member_create/keys?keys=true")
        .end(function(error, result) {
            var keys = JSON.parse(result.text).keys;
            console.log(keys);

            if (keys.length) {
                keys.forEach(function (key) {

                    //query.getObjectWithKey('team-member', key,
                    //    function(error, result){
                    //        try {
                    //            var json = JSON.parse(result.text);
                    //
                    //            if (json.data.manager == req.session.user.username) {
                    //                json.data['key'] = key;
                    //                teamMembers.push(json);
                    //            }
                    //        } catch (e) {
                    //
                    //        }
                    //
                    //        if (i == keys.length) {
                    //            callback(teamMembers);
                    //        }
                    //        i++;
                    //    });


                    request
                        .get(host + ":" + port + "/riak/test-team-member_create/" + key)
                        .end(function (error, result) {

                            try {
                                var json = JSON.parse(result.text);

                                if (json.data.manager == req.session.user.username) {
                                    json.data['key'] = key;
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
            } else {
                callback(teamMembers);
            }
        });
};


router.get('/get_team_members', getTeamMembers);

module.exports = router;
module.testExports = {addPost: addPost, getTeamMembers: getTeamMembers, request: request, host: host, port: port};
