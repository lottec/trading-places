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
}

var sendEvent = function(event, callback) {
    var eventJSON = {timestamp: Date.now(), data: event.data};
    riakWrite.write(event.event, eventJSON, callback);
};