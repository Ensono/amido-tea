var Auth0Lock = require('auth0-lock'),
    _ = require('underscore'),
    Q = require('q');

module.exports = Auth0;

function Auth0() {
    if (!(this instanceof Auth0)) {
        return new Auth0();
    }

    this.auth0 = new Auth0Lock('z71mzjRhKGI4IIFFDuOl0eq57o7amPkE', 'amidoltd.auth0.com');
}

Auth0.prototype.showLogin = function() {
    var deferred = Q.defer();

    this.auth0.show({callbackOnLocationHash: true}, function(err, profile, idToken) {
        if (err) {
            deferred.reject(err);
        } else {
            _.each(profile, function(item, key) {
                if (typeof item === "object") {
                    delete profile[key];
                }
            });

            deferred.resolve({ profile: profile, idToken: idToken })
        }
    })

    return deferred.promise;
}