var eventDB = require('../db_access/riak.js'); // require library for database being used for events
var assembler = require('../event_assembling/event_assembler.js');

var sendEvent = function(event, callback) {
    var key = null;
    var eventJSON = {timestamp: Date.now(), data: event.data};
    eventDB.post(event.type, key, eventJSON, callback);
    assembler.eventToObjectDB(event);
};

module.exports = {sendEvent: sendEvent};