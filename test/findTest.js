var express = require('express');
var expect = require('expect.js');
var request = require('superagent');
var host = 'http://db.cistechfutures.net';
var sinon = require('sinon');
var port = 8098;
var requireFrom = require('require-from');
var find = requireFrom('testExports', module, '../routes/find.js');


describe('Find people page', function() {
    it('should retrieve all team members who are both available and not belonging to the logged in manager', function(done) {

        var req = {
            session: { user: { username: "Test" } }
        };

        var mockData = [{"text": '{\
            "event": "add_team_member",\
            "timestamp": "",\
            "data": {\
                "first_name": "Test",\
                "surname": "Minion",\
                "job_title": "Dev",\
                "expert": "This guy should not show up",\
                "intermediate": "",\
                "basic": "Else",\
                "availability": "off",\
                "manager": "Gru"\
            } }'
        },
        {"text": '{\
            "event": "add_team_member",\
            "timestamp": "",\
            "data": {\
                "first_name": "Test",\
                "surname": "Minion",\
                "job_title": "Dev",\
                "expert": "This guy should show up",\
                "intermediate": "",\
                "basic": "Else",\
                "availability": "on",\
                "manager": "NotTest"\
            } }'
        },
        {"text": '{\
            "event": "add_team_member",\
            "timestamp": "",\
            "data": {\
                "first_name": "Test",\
                "surname": "Minion",\
                "job_title": "Dev",\
                "expert": "Something",\
                "intermediate": "This guy should not show up",\
                "basic": "Else",\
                "availability": "on",\
                "manager": "Test"\
            } }'
            }];

        var mockResult = {text: '{"keys": [0,1,3]}'};

        var requestStub = sinon.stub(find.request, "get");

        requestStub.onCall(0).returns({end: function(callback) { callback(null, mockResult); }});
        requestStub.onCall(1).returns({end: function(callback) { callback(null, mockData[0]); }});
        requestStub.onCall(2).returns({end: function(callback) { callback(null, mockData[1]); }});
        requestStub.onCall(3).returns({end: function(callback) { callback(null, mockData[2]); }});

        find.getAllTeamMembers(req, function(teamMembers) {
            console.log(teamMembers);
            expect(teamMembers.length).to.be(1);
            requestStub.restore();
            done();
        });
    });

});
