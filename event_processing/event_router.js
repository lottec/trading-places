var requireFrom = require('require-from');
var eventDB = requireFrom('exports', module, '../db_access/riak.js'); // require library for database being used for events
var assembler = requireFrom('exports', module, '../event_assembling/event_assembler.js');

var sendEvent = function(event, callback) {
    var key = event.key || null;
    var eventJSON = {timestamp: Date.now(), data: event.data};
    eventDB.post(event.type, key, eventJSON, callback);
    assembler.eventToObjectDB(event);
};

module.exports = {sendEvent: sendEvent};