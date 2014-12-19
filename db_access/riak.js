var request = require('superagent');
var host = 'http://db.cistechfutures.net';
var port = 8098;

var post = function(bucket, key, data, callback) {
    request.post(host + ":" + port + "/riak/" + bucket + (key?('/' + key):''))
        .set('Content-Type', 'application/json')
        .send(data)
        .end(callback());
};

var put = function(bucket, key, data, callback) {
    request.put(host + ":" + port + "/riak/" + bucket + (key?('/' + key):''))
        .set('Content-Type', 'application/json')
        .send(data)
        .end(callback());
};

var del = function(bucket, key, data, callback) {
    request.del(host + ":" + port + "/buckets/" + bucket + (key?('/' + key):''))
        .set('Content-Type', 'application/json')
        .send(data)
        .end(callback());
};


var get = function(bucket, key, data, callback) {
    //request.get(host + ":" + port + "/riak/" + bucket +  (key?('/' + key):"/keys?keys=true"))
    request.get(host + ":" + port + "/riak/" + bucket + '/' + key)
        .set('Content-Type', 'application/json')
        .send(data)
        .end(callback());
};

module.exports = {post: post, put: put, del: del};