var express = require('express');
var bcrypt = require('bcrypt');
var validator = require('validator');
var expect = require('expect.js');
var router = express.Router();
var request = require('superagent');
var host = 'http://db.cistechfutures.net';
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

});