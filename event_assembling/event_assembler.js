var requireFrom = require('require-from');
var objectDB = requireFrom('exports', module, '../db_access/riak.js');

var eventToObjectDB = function(event) {

    //Convention: [test-]bucket_action
    var key = event.key || null;
    var data = event.data;
    var types = event.type.split('_');
    var bucket = types[0];
    var action = types[1];

    if (action == 'create'){
        objectDB.post(bucket, key, data);
    } else if (action == 'update'){
        objectDB.put(bucket, key, data);
    } else if (action == 'delete'){
        objectDB.del(bucket, key, data);
    }

};

module.exports = {eventToObjectDB: eventToObjectDB}