var requireFrom = require('require-from');
var expect = require('expect.js');
var sinon = require('sinon');
var users = requireFrom('testExports', module, '../routes/users.js');

describe('Register page', function() {
    it('should not register without credentials', function(done) {
        var req = {body: {  } };
        var res = { redirect: function(path) {
                expect(path).to.be('/register');
                done();
            }
        };
        users.registerPost(req, res);

    });

    it('should not register with one or more credentials in incorrect format', function(done) {
        var req = {
            body: {
                username: "TestMocha",
                password: "whatever",
                password_confirmation: "whatever",
                email: "arg@sdfs.ca",
                first_name: "test",
                surname: "test",
                num_team_members: "invalid",
                department: "dept"
            }
        };
        var res = {
            redirect: function(path) {
                expect(path).to.be('/register');
                done();
            }
        };
        users.registerPost(req, res);

    });

    it('should not register with one or more credentials missing', function(done) {
        var req = {
            body: {
                username: "TestMocha",
                password: "whatever",
                first_name: "test",
                surname: "test"
            }
        };
        var res = {
            redirect: function(path) {
                expect(path).to.be('/register');
                done();
            }
        };
        users.registerPost(req, res);

    });

    it('should register with all correct credentials', function(done) {
        var req = {
            body: {
                username: "camila",
                password: "whatever",
                password_confirmation: "whatever",
                email: "arg@asd.asd",
                first_name: "test",
                surname: "test",
                num_team_members: 12,
                department: "dept"
            }
        };

        var requestStub = sinon.stub(users.request, "get", function() { return {end: function(callback) { callback({body: {}}); }} });
        var requestPostStub = sinon.stub(users.request, "post", function() { return { set: function() { return {send: function() { return {end: function(callback) {callback();}}}}}} });

        var res = {
            redirect: function(path) {
                expect(path).to.be('/');
                requestStub.restore();
                requestPostStub.restore();
                done();
            }
        };
        users.registerPost(req, res);

    });

    it('should not register with username that already exists', function(done) {
        var req = {
            body: {
                username: "Test",
                password: "whatever",
                password_confirmation: "whatever",
                email: "arg@asd.asd",
                first_name: "test",
                surname: "test",
                num_team_members: 12,
                department: "dept"
            }
        };

        var requestStub = sinon.stub(users.request, "get", function() { return {end: function(callback) { callback({body: { data: { } }}); }} });
        var res = {
            redirect: function(path) {
                expect(path).to.be('/register/?user_exists=true');
                requestStub.restore();
                done();
            }
        };
        users.registerPost(req, res);

    });

});