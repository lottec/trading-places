var request = require('superagent');
var host = 'http://db.cistechfutures.net';
var port = 8098;

var post = function(bucket, data, callback) {
    request.post(host + ":" + port + "/riak/" + bucket)
        .set('Content-Type', 'application/json')
        .send(data)
        .end(callback());
};

var put = function(bucket, data, callback) {
    request.put(host + ":" + port + "/riak/" + bucket)
        .set('Content-Type', 'application/json')
        .send(data)
        .end(callback());
};

var del = function(bucket, data, callback) {
    //.del(host + ":" + port + "/buckets/" + req.param("bucket") + "/keys/" + key)
    request.del(host + ":" + port + "/riak/" + bucket)
        .set('Content-Type', 'application/json')
        .send(data)
        .end(callback());
};

module.exports = {post: post};