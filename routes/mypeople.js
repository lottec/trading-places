var express = require('express');
var router = express.Router();
var request = require('superagent');
var host = 'http://db.cistechfutures.net';
var port = 8098;
var validator = require('validator');

router.get('/', function(req,res) {
    getTeamMembers(req, function(teamMembers) {
        res.render('mypeople', { title: 'My People', team_members: teamMembers});
    });
    
});

var addPost = function(req, res) {
    if (!req.session.user) {
        res.redirect('/');

    } else {

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
                        "expert": req.body.expert,
                        "intermediate": req.body.intermediate,
                        "basic": req.body.basic,
                        "availability": req.body.availability,
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
