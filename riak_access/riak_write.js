var request = require('superagent');
var host = 'http://db.cistechfutures.net';
var port = 8098;

var write = function(bucket, data, callback) {
    request.post(host + ":" + port + "/riak/" + bucket)
        .set('Content-Type', 'application/json')
        .send(data)
        .end(callback());
};

module.exports = {write: write};