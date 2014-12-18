var requireFrom = require('require-from');
var riakWrite = requireFrom('exports', module, '../riak_access/riak_write.js');

var eventToObjectDB = function(type, key, data) {

    //Convention: bucket_action

    var types = type.split('_');
    var bucket = types[0];
    var action = types[1];

    if (action == 'create'){

        riakWrite.post(bucket, key, data);

    } else if (action == 'update'){

        riakWrite.put(bucket, key, data);

    } else if (action == 'delete'){

        riakWrite.del(bucket, key, data);
    }

};

module.exports = {eventToObjectDB: eventToObjectDB}