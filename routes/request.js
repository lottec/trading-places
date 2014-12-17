var express = require('express');
var router = express.Router();
var request = require('superagent');
var host = 'http://db.cistechfutures.net';
var port = 8098;
var nodemailer = require('nodemailer');

router.post('/', function(req,res) {

    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'test.tradingplaces@gmail.com',
            pass: 'samsminions'
        }
    });

    var header = '** This is an automatically generated email sent via the Sky Trading Places app. We\'d very much appreciate if you could keep the '
                + 'keep us in the loop by using "Reply All" and keeping us cc\'d in - this is for analytics purposes so that we can improve the app '
                + 'as effectively as possible. **\r\r';

    var mailOptions = {
        from: req.session.user.full_name + ' <' + req.body.from_email + '>',
        to: req.body.to_email,
        cc: 'test.tradingplaces@gmail.com',
        subject: req.body.subject,
        text: header + req.body.body
    };

    console.log(mailOptions);

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        }else{
            console.log('Message sent: ' + info.response);
        }
    });


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
            console.log(error);
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

