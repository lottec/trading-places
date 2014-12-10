var express = require('express');
var router = express.Router();
var request = require('superagent');
var host = 'http://db.cistechfutures.net';
var port = 8098;

router.post('/', function(req,res) {
    request.post(host + ":" + port + "/riak/mt-requests/")
        .set('Content-Type', 'application/json')
        .send({
            "event": "initiate_request",
            "timestamp": Date.now(),
            "data": {
                "request_from": req.session.user.username,
                "request_to": req.body.manager,
                "requested_team_member_id": req.body.team_member_id
            }
        })
        .end(function (error, result) {
            if (error) {
                res.redirect('/find?success=false');
            } else {
                res.redirect('/find?success=true');
            }
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

