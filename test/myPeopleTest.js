var express = require('express');
var bcrypt = require('bcrypt');
var validator = require('validator');
var expect = require('expect.js');
var router = express.Router();
var request = require('superagent');
var host = 'http://db.cistechfutures.net';
var sinon = require('sinon');
var port = 8098;
var requireFrom = require('require-from');
var mypeople = requireFrom('testExports', module, '../routes/mypeople.js');


describe('Add team member page', function() {
    it('should not add team member without logging in', function(done) {
        var req = {
            body: {
                "first_name": "Test",
                "surname": "Test",
                "job_title": "Job",
                "expert": "Expert skills",
                "intermediate": "Intermediate skills",
                "basic": "Basic skills",
                "availability": true
            },
            session: { }
        };

        var res = { redirect: function(path) {
            expect(path).to.be('/');
            done();
        }
        };
        mypeople.addPost(req, res);

    });

    it('should not add team member with one or more form fields missing', function(done) {
        var req = {
            body: {
                "first_name": "Test",
                "job_title": "Job",
                "expert": "Expert skills",
                "intermediate": "Intermediate skills",
                "basic": "Basic skills",
                "availability": true
            },
            session: { user: { username: "Test" } }
        };

        var res = { redirect: function(path) {
            expect(path).to.be('/mypeople?invalid=true');
            done();
        }
        };
        mypeople.addPost(req, res);

    });

    it('should add team member with correct information', function(done) {
        var req = {
            body: {
                "first_name": "Test",
                "surname": "Test",
                "job_title": "Job",
                "expert": "Expert skills",
                "intermediate": "Intermediate skills",
                "basic": "Basic skills",
                "availability": true,
                "manager": "Whatever"
            },
            session: { user: { username: "Test" } }
        };

        var res = { redirect: function(path) {
            expect(path).to.be('/mypeople');
            done();
        }
        };
        mypeople.addPost(req, res);

    });

    it('should retrieve team members for logged in manager', function(done) {

        var req = {
            session: { user: { username: "Test" } }
        };

        var mockData = [{
            "event": "add_team_member",
            "timestamp": "",
            "data": {
                "first_name": "Test",
                "surname": "Minion",
                "job_title": "Dev",
                "expert": "Something",
                "intermediate": "",
                "basic": "Else",
                "availability": true,
                "manager": "Gru"
            }
        },
            {
                "event": "add_team_member",
                "timestamp": "",
                "data": {
                    "first_name": "Test",
                    "surname": "Minion",
                    "job_title": "Dev",
                    "expert": "Something",
                    "intermediate": "",
                    "basic": "Else",
                    "availability": true,
                    "manager": "Test"
                }
            }]

        var mockResult = '{\
            "keys": [0,1]\
        }';


        var requestStub1 = sinon.stub(mypeople.request, "get", function() { return {end: function(callback) { callback(null, mockResult); }} });
        
        var requestStub2 = sinon.stub(mypeople.request, "get", function() { return {end: function(callback) { callback(null, mockData[mockResult.keys[0]]); }} });
        var requestStub3 = sinon.stub(mypeople.request, "get", function() { return {end: function(callback) { callback(null, mockData[mockResult.keys[1]]); }} });

        mypeople.getTeamMembers(req, function(teamMembers) {
            console.log(teamMembers);
            requestStub1.restore();
            requestStub2.restore();
            requestStub3.restore();
            done();
        });
    });

    });