var objectDB = require('../db_access/riak.js');

var eventToObjectDB = function(event) {

    //Convention: [test-]bucket_action
    var key = event.key || null;
    var data = event.data;
    var types = event.type.split('_');
    var bucket = types[0];
    var action = types[1];

    console.log('key: ' + key);
    console.log('bucket: ' + bucket);
    console.log('action: ' + action);

    if (action == 'create'){
        objectDB.post(bucket, key, data);
    } else if (action == 'update'){
        objectDB.put(bucket, key, data);
    } else if (action == 'delete'){
        objectDB.del(bucket, key, data);
    }

};

module.exports = {eventToObjectDB: eventToObjectDB}