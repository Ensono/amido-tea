var Q = require('q'),
    moment = require('moment'),
    monk = require('monk');

module.exports = BrewRepository;

function BrewRepository() {
    if (!(this instanceof BrewRepository)) {
        return new BrewRepository();
    }

    this.db = monk('localhost:27017/amidotea');
}

BrewRepository.prototype.deleteBrewer = function(userId) {
    var deferred = Q.defer();

    var collection = this.db.get('brews');

    this.next()
        .then(function(nextBrew) {
            collection.updateById(nextBrew._id, { $pull: { brewers: { id: userId } } }, function(e, brews) {
                if (e) {
                    deferred.reject(e);
                } else {
                    deferred.resolve(brews);
                }
            });
        });

    return deferred.promise;

}

BrewRepository.prototype.next = function(createIfNotPresent) {
    var deferred = Q.defer();

    var self = this;

    var collection = this.db.get('brews');

    collection.find({ when: { $gt: new Date() } }, { limit: 1, sort: { when: 1 } }, function(e, brews){
        if (e) {
            deferred.reject(e);
        } else {
            if (createIfNotPresent && !brews.length) {
                self.createNext()
                    .then(function(nextBrew) {
                        deferred.resolve(nextBrew);
                    })
                    .fail(function(error) {
                        deferred.reject(error);
                    });
            } else {
                deferred.resolve(brews && brews.length ? brews[0] : {})
            }
        }
    });

    return deferred.promise;
}

BrewRepository.prototype.all = function() {
    var deferred = Q.defer();

    var collection = this.db.get('brews');

    collection.find({},{}, function(e, brews){
        if (e) {
            deferred.reject(e);
        } else {
            deferred.resolve(brews);
        }
    });

    return deferred.promise;
}

BrewRepository.prototype.addUserToNextBrew = function(userId, usersName, brewer) {
    var deferred = Q.defer();
    var self = this;

    this.next(true)
        .then(function(nextBrew) {
            if (!nextBrew) {

            }
            var collection = self.db.get('brews');
            console.log(nextBrew);
            collection.updateById(nextBrew._id, { $push: { brewers: { id: userId, name: usersName, brew: brewer.brew, sugars: brewer.sugars, milk: brewer.milk, comments: brewer.comment } }  }, function(e, brews) {
                if (e) {
                    console.log("x" + e);
                    deferred.reject(e);
                } else {
                    console.log("x2" + brews);
                    deferred.resolve(brews)
                }
            });
        });

    return deferred.promise;
}

BrewRepository.prototype.createNext = function() {
    var deferred = Q.defer();

    var collection = this.db.get('brews');

    var nextWhen = moment().add(10, 'minutes');

    collection.insert({ when: nextWhen.toDate(), brewers: [] }, function(err, doc) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(doc);
        }
    });

    return deferred.promise;
}