var requireFrom = require('require-from');
var express = require('express');
var router = express.Router();
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
        query.getObjectWithKey("test-user", req.session.user.username, function(result) {
            var manager_email = result.body.email;
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

    query.getAllObjectsInBucket('test-team-member', function(error, result) {
        var keys = JSON.parse(result.text).keys;
        console.log(keys);

        if (keys.length) {
            keys.forEach(function (key) {

                query.getObjectWithKey('test-team-member', key,
                    function(error, result){
                        //console.log(result);
                        try {
                            var member = JSON.parse(result.text);
                            console.log("HHHHHHEEERE");
                            console.log(member);

                            if (member.manager == req.session.user.username) {
                                member['key'] = key;
                                teamMembers.push(member);
                            }
                        } catch (e) {

                        }

                        if (i == keys.length) {
                            console.log(teamMembers);
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


var updateTeamMember = function(req, res) {

    if (!req.session.user) {
        res.redirect('/');
    } else {
        query.getObjectWithKey("test-team-member", req.body.key, function(result) {
            console.log(result);

            var invalid = false;

            console.log(req.body.first_name);
            console.log(req.body.surname);
            console.log(req.body.job_title);
            console.log(req.body.key);

            if (!validator.isLength(req.body.first_name, 1) || !validator.isLength(req.body.surname, 1) ||
                !validator.isLength(req.body.job_title, 1)) {
                invalid = true;
            }

            if (invalid) {
                res.redirect('/mypeople?invalid_update=true');
            } else {
                console.log("********** 1");
                eventProcessor.sendEvent(
                    {
                        "key": req.body.key,
                        "type": "test-team-member_update",
                        "data": {
                            "manager_email": result.manager_email,
                            "first_name": result.first_name,
                            "surname": req.body.surname,
                            "job_title": req.body.job_title,
                            "expert": req.body['expert_skills[]'],
                            "intermediate": req.body['intermediate_skills[]'],
                            "basic": req.body['basic_skills[]'],
                            "availability": result.availability?true:true,
                            "availability_duration": {
                                "equality": result.availability_duration.equality,
                                "number": result.availability_duration.num,
                                "unit": result.availability_duration.unit
                            },
                            "manager": result.manager,
                            "manager_name": result.manager_name
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

router.post('/update_team_member', updateTeamMember);



module.exports = router;
module.testExports = {addPost: addPost, getTeamMembers: getTeamMembers, updateTeamMember: updateTeamMember};
