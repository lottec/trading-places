var requireFrom = require('require-from');
var expect = require('expect.js');
var users = requireFrom('testExports', module, '../../routes/users.js');

describe('Login page', function() {
    it('should login without credentials and session should be inactive', function(done) {

        var req = {body: { }, session: { } };
        var res = { redirect: function(path) {
                expect(path).to.be('/');
                done();
            }
        };
        users.loginPost(req, res);
        expect(req.session.user).to.not.be.an('object');
    });

    it('should login with credentials and session should be active', function(done) {

        var req = {body: { userName: 'Gru' }, session: { }};
        var res = { redirect: function(path) {
                expect(path).to.be('/');
                done();
            }
        };

        users.loginPost(req, res);
        expect(req.session.user).to.be.an('object');
    });
});