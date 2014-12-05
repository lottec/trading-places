var express = require('express');
var router = express.Router();

router.get('/', function(req,res) {
    res.render('register', {title: 'Register details', user_exists: req.param("user_exists")});

    request.post(host + ":" + port + "/riak/mt-add-team-member/")
        .set('Content-Type', 'application/json')
        //.set('x-riak-index-manager_bin', 'testing')
        .send({
            "event": "initiate_request",
            "timestamp": Date.now(),
            "data": {
                "request_from": req.session.user.username,
                "request_to": req.body.manager,
                "requested_team_member_id": req.body.team_member_id
            }
        })
        .end(function () {
            res.redirect('/mypeople');
        });
});

module.exports = router;


////TEMPLATE EMAIL
//"Hi *name of supplying manager*,\
//    Hope you are well.\
//    I am wondering if it\'s possible to borrow *minion id* for a bit to help solve a problem we have.\
//    \
//    Ideally I would need them until *data*, but completely understand this might not be possible.\
//    \
//    The details of the project are:\
//    *insert details*\
//    \
//    If this is okay please follow this link *insert link to manage, with highlighted minion* and set an initial date I can have them until.\
//    If we need to discuss more tehn let me know the details.\
//    \
//    Kind regards,\
//    *insert requesting manager*

