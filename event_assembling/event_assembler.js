var requireFrom = require('require-from');
var riakWrite = requireFrom('exports', module, '../riak_access/riak_write.js');

var event = {"timestamp": 12345 ,
    "data": {
        "username": "username",
        "password": "hash",
        "email": req.body.email,
        "first_name": req.body.first_name,
        "surname": req.body.surname,
        "num_team_members": req.body.num_team_members,
        "department": req.body.department
    }
};

var sendEvent = function(event, callback) {
    var eventJSON = {timestamp: Date.now(), data: event.data};
    riakWrite.post(event.event, null, eventJSON, callback);
};


var eventToObjectDB = function(type, data) {

    //Convention: bucket-key-action

    var types = type.split('-');
    var bucket = types[0];
    var key = types[1];
    var action = types[2];

    if (action == 'create'){

        riakWrite.post(bucket, key, data);

    } else if (action == 'update'){

        riakWrite.put(bucket, key, data);

    } else if (action == 'delete'){

        riakWrite.del(bucket, key, data);
    }

};

module.exports = {eventToObjectDB: eventToObjectDB}