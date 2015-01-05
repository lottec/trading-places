/**
 * REMOVE THIS FILE IN PRODUCTION CODE
 */
var express = require('express');
var router = express.Router();
var request = require('superagent');
//var host = 'http://db.cistechfutures.net';
//var port = 8098;
var host = 'http://localhost';
var port = 10018;
router.get('/deletebucket/:bucket', function(req,res) {
    //res.render('find', { title: 'Find' });
    purgeBucket(req, function(teamMembers) {
        //res.render('find', { title: 'Find', team_members: teamMembers});
        //res.send(teamMembers);
    });
});

var purgeBucket = function(req, callback) {

    request
        .get(host + ":" + port + "/buckets/" + req.param("bucket") + "/keys?keys=true")
        .end(function(error, result) {
            if (error) {
                console.log("Error retrieving keys");
            } else {
                var keys = JSON.parse(result.text).keys;

                keys.forEach(function (key) {

                    request
                        .del(host + ":" + port + "/buckets/" + req.param("bucket") + "/keys/" + key)
                        .end(function (error, result) {
                            console.log(error ? error : "Successfully deleted key: " + key);
                            callback();
                        });
                });
            }
        });
};

module.exports = router;
module.testExports = {purgeBucket: purgeBucket, request: request, host: host, port: port};