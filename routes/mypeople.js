var express = require('express');
var router = express.Router();
var request = require('superagent');
var host = 'http://db.cistechfutures.net';
var port = 8098;

router.get('/', function(req,res) {
    res.render('mypeople', { title: 'My People', team: queryRes});
});

var addPost = function(req, res) {
    //var invalid = false;
    //
    //if (!validator.isLength(req.body.username, 3) ||
    //    !validator.isLength(req.body.password, 3) ||
    //    !validator.isLength(req.body.password_confirmation, 3) ||
    //    !validator.equals(req.body.password, req.body.password_confirmation) ||
    //    !validator.isEmail(req.body.email) ||
    //    !validator.isLength(req.body.first_name, 1) || !validator.isLength(req.body.surname, 1) ||
    //    !validator.isLength(req.body.department, 1) ||
    //    !validator.isNumeric(req.body.num_team_members)) {
    //    invalid = true;
    //}

    //if (invalid) {
    //    res.redirect('/register');
    //} else {
    //    request
    //        .get(host + ":" + port + "/riak/mt-register/" + username)
    //        .end(function(result){
    //            if (result.body.data) {
    //                res.redirect('/register/?user_exists=true');
    //            } else {
                    request.post(host + ":" + port + "/riak/mt-add-team-member/testthis")
                        .set('Content-Type', 'application/json')
                        //.set('x-riak-index-manager_bin', 'testing')
                        .send({
                            "event": "addTeamMember",
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
                            res.redirect('/');
                        });
            //    }
            //});
    //}
};

router.post('/add_team_member', addPost);



module.exports = router;