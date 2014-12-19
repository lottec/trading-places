var requireFrom = require('require-from');
var objectDB = requireFrom('exports', module, '../db_access/riak.js'); // require library for database being used for events
var request = require('superagent');

var getObjectWithKey = function(bucket, key, callback) {
    request
        .get(host + ":" + port + "/riak/" + bucket + "/" + key)
        .end(callback);
};


var getAllObjectsInBucket = function(object) {

    //request
    //    .get(host + ":" + port + "/buckets/mt-add-team-member/keys?keys=true")
    //    .end(function (error, result) {
    //        var keys = JSON.parse(result.text).keys;
    //
    //        keys.forEach(function (key) {
    //            request
    //                .get(host + ":" + port + "/riak/mt-add-team-member/" + key)
    //                .end(function (error, result) {
    //
    //                    try {
    //                        var json = JSON.parse(result.text);
    //
    //                        if (json.data.manager == req.session.user.username) {
    //                            json.data['key'] = key;
    //                            teamMembers.push(json);
    //                        }
    //                    } catch (e) {
    //
    //                    }
    //
    //                    if (i == keys.length) {
    //                        callback(teamMembers);
    //                    }
    //                    i++;
    //                });
    //
    //        });
    //    });

};

var getObjectsWithAttr = function(object, attr, val) {
    //Multiple attributes to match??

    //request
    //    .get(host + ":" + port + "/buckets/mt-add-team-member/keys?keys=true")
    //    .end(function (error, result) {
    //        var keys = JSON.parse(result.text).keys;
    //
    //        keys.forEach(function (key) {
    //            request
    //                .get(host + ":" + port + "/riak/mt-add-team-member/" + key)
    //                .end(function (error, result) {
    //
    //                    try {
    //                        var json = JSON.parse(result.text);
    //
    //                        if (json.data.manager == req.session.user.username) {
    //                            json.data['key'] = key;
    //                            teamMembers.push(json);
    //                        }
    //                    } catch (e) {
    //
    //                    }
    //
    //                    if (i == keys.length) {
    //                        callback(teamMembers);
    //                    }
    //                    i++;
    //                });
    //
    //        });
    //    });

};

module.exports = {getObjectWithKey: getObjectWithKey};