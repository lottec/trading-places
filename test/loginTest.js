require('mocha');
var requireFrom = require('require-from');
var expect = require('expect.js');
var users = requireFrom('testExports', module, '../routes/users.js');
//var riak = require('../index');
//var server = new riak(8087);
//server.start();

describe('Login page', function() {
    it('should login without credentials and session should be inactive', function(done) {

        var req = {body: { }, session: { } };
        var res = { redirect: function(path) {
            expect(req.session.user).to.not.be.an('object');
                expect(path).to.be('/');
                done();
            }
        };
        users.loginPost(req, res);
    });

    it('should login with credentials and session should be active', function(done) {

        var req = {body: { username: 'test', password: 'test' }, session: { }};
        var res = { redirect: function(path) {
            expect(req.session.user).to.be.an('object');
                expect(path).to.be('/?invalid=false');
                done();
            }
        };

        users.loginPost(req, res);
    });
});