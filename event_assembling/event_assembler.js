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

receive event
compile into object
save in riak db




var sendEvent = function(event, callback) {
    var eventJSON = {timestamp: Date.now(), data: event.data};
    riakWrite.write(event.event, eventJSON, callback);
};


var eventToObject = function(type, data) {
    take first part of type name (eg user) and use as riak bucket name
    take second part of type name (eg create/update/del) and translate to http verb



    user-create
    user-update
    user-del
    teammember-create
    teammember-update
    teammember-del

    user-login
    user-logout

    var typeSplit = type.split('-');
    var bucket = typeSplit[0];
    var action = typeSplit[1];






    riakWrite.write(bucket, data);


}