var requireFrom = require('require-from');
var riakWrite = requireFrom('exports', module, '../riak_access/riak_write.js');

var sendEvent = function(event, callback) {
    var eventJSON = {timestamp: Date.now(), data: event.data};
    riakWrite.post(event.event, null, eventJSON, callback);
};

module.exports = {sendEvent: sendEvent};