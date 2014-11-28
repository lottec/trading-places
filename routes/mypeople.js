var express = require('express');
var router = express.Router();
var request = require('superagent');
var host = 'http://db.cistechfutures.net';
var port = 8098;
var validator = require('validator');

router.get('/', function(req,res) {

    //res.render('mypeople', { title: 'My People'});
    res.render('mypeople', { title: 'My People', team_members: mockTeamMembers()});
    //request.get('/mypeople/get_team_members')
    //    .end(function(error, result) {
    //        console.log(error);
    //
    //    });
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
            request.post(host + ":" + port + "/riak/mt-add-team-member")
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


var getTeamMembers = function(req, res) {
    res.send(
        mockTeamMembers()
    );
};

var mockTeamMembers = function() {
    return [{
        "event": "add_team_member",
        "timestamp": "",
        "data": {
            "first_name": "Carl",
            "surname": "Minion",
            "job_title": "Dev",
            "expert": "Java",
            "intermediate": "",
            "basic": "",
            "availability": true,
            "manager": "Gru"
        }
    },
        {
            "event": "add_team_member",
            "timestamp": "",
            "data": {
                "first_name": "Lotte",
                "surname": "Minion",
                "job_title": "Dev",
                "expert": "Objective-C",
                "intermediate": "Node",
                "basic": "",
                "availability": false,
                "manager": "Gru"
            }
        },
        {
            "event": "add_team_member",
            "timestamp": "",
            "data": {
                "first_name": "Andrew",
                "surname": "Minion",
                "job_title": "Dev",
                "expert": "Everything",
                "intermediate": "",
                "basic": "",
                "availability": true,
                "manager": "Gru"
            }
        },
        {
            "event": "add_team_member",
            "timestamp": "",
            "data": {
                "first_name": "Test",
                "surname": "Minion",
                "job_title": "Dev",
                "expert": "Something",
                "intermediate": "",
                "basic": "Else",
                "availability": true,
                "manager": "Gru"
            }
        }]
}


router.get('/get_team_members', getTeamMembers);

module.exports = router;
module.testExports = {addPost: addPost, request: request, host: host, port: port};
