var Auth0 = require('auth0'),
    _ = require('underscore'),
    Q = require('q');

module.exports = Auth0Promises;

function Auth0Promises() {
    if (!(this instanceof Auth0Promises)) {
        return new Auth0Promises();
    }

    this.api = new Auth0({
        domain: process.env.AUTH0_DOMAIN,
        clientID: process.env.AUTH0_CLIENTID,
        clientSecret: process.env.AUTH0_CLIENT_SECRET
    });
}

Auth0Promises.prototype.getUser = function(userId) {
    var deferred = Q.defer();
    this.api.getUser(userId, function(e, u) {
        if (e) {
            console.error('error loading user from api ' + JSON.stringify(e));
            deferred.reject(e);
        } else {
            deferred.resolve(u);
        }
    });

    return deferred.promise;
};

