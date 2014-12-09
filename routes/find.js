var express = require('express');
var router = express.Router();
var request = require('superagent');
var host = 'http://db.cistechfutures.net';
var port = 8098;

router.get('/', function(req,res) {
    getAllTeamMembers(req, function(teamMembers) {
        res.render('find', { title: 'Find', team_members: teamMembers});
    });
});

var getAllTeamMembers = function(req, callback) {

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
                            json.data['key'] = key;
                            if (json.data.availability == true && json.data.manager != req.session.user.username) {
                                json.data['manager_email'] = getManagerEmail(json.data.manager);
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

var getManagerEmail = function(key) {

    request
        .get(host + ":" + port + "/riak/mt-register/" + key)
        .end(function(error, result) {
            console.log(result);
            var email = result.body.data.email;
            return email;
        });
};

module.exports = router;
module.testExports = {getAllTeamMembers: getAllTeamMembers, request: request, host: host, port: port};

//for jade updateModalFields
//                var href = "mailto:' + manager.email +
//                '?subject=' + subject +
//                '&bcc=' + bcc +
//                '&body=' + body +
//
//                $("mail").attr("href",href);