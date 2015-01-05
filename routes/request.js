var express = require('express');
var router = express.Router();
var request = require('superagent');
//var host = 'http://db.cistechfutures.net';
//var port = 8098;
var host = 'http://localhost';
var port = 10018;
var nodemailer = require('nodemailer');
var requireFrom = require('require-from');
var eventProcessor = requireFrom('exports', module, '../event_processing/event_router.js');

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

    eventProcessor.sendEvent(
        {
            "event": "mt-requests",
            "timestamp": Date.now(),
            "data": {
                "request_from": req.session.user.username,
                "request_to": req.body.manager,
                "requested_team_member_id": req.body.team_member_id
            }
        },
        function() {
            res.redirect('/find?success=true');
        }
    );
});

module.exports = router;