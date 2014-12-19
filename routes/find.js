var express = require('express');
var router = express.Router();
var request = require('superagent');
var host = 'http://db.cistechfutures.net';
var port = 8098;

router.get('/', function(req,res) {
    getAllTeamMembers(req, function(teamMembers) {
        res.render('find', { title: 'Find - Trading Places', team_members: teamMembers, success: req.param("success"), route: 'find'});
    });
});

var getAllTeamMembers = function(req, callback) {

    var teamMembers = [];
    var i = 1;

    request
        .get(host + ":" + port + "/buckets/test-team-member_create/keys?keys=true")
        .end(function(error, result){

            var keys = JSON.parse(result.text).keys;
            keys.forEach(function(key) {
                request
                    .get(host + ":" + port + "/riak/test-team-member_create/" + key)
                    .end(function(error, result){

                        try {
                            var json = JSON.parse(result.text);
                            json.data['key'] = key;

                            if (json.data.availability == true && json.data.manager != req.session.user.username) {
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

module.exports = router;
module.testExports = {getAllTeamMembers: getAllTeamMembers, request: request, host: host, port: port};