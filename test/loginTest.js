var requireFrom = require('require-from');
var expect = require('expect.js');
var users = requireFrom('testExports', module, '../routes/users.js');

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

    it('should return session user when logged in', function(done){
        var req = {session: { user: 'test'}};
        var res = { send: function(sessionUser) {
                expect(sessionUser).to.be('test');
                done();
            }
        };
        users.isLoggedInGet(req, res);
    });

    it('should not return session user when not logged in', function(done){
        var req = {session: {}};
        var res = { send: function(sessionUser) {
            expect(sessionUser).to.be(undefined);
            done();
        }
        };
        users.isLoggedInGet(req, res);
    });

    it('should set session to null on logout', function(done){
        var req = {session: {user: 'test'}};
        var res = { redirect: function(path){
            expect(req.session.user).to.be(null);
            expect(path).to.be('/');
            done();
        }};
        users.logoutGet(req, res);
    });

});