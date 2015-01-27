var Q = require('q'),
    schedule = require('node-schedule'),
    moment = require('moment'),
    mailer = require('../mailer'),
    monk = require('monk');

module.exports = BrewRepository;

function BrewRepository() {
    if (!(this instanceof BrewRepository)) {
        return new BrewRepository();
    }

    this.db = monk(process.env.MONGO_URL);
}

BrewRepository.prototype.get = function(id) {
    var deferred = Q.defer();

    var collection = this.db.get('brews');

    collection.findById(id, function(e, brew) {
        if (e) {
            deferred.reject(e);
        } else {
            deferred.resolve(brew);
        }
    });

    return deferred.promise;
}

BrewRepository.prototype.getLocationByIp = function(ipAddress) {
    var deferred = Q.defer();

    var collection = this.db.get('locations');

    collection.find({ipAddresses: { $in: [ipAddress]}}, function(e, brews) {
       if (e) {
           deferred.reject(e);
       } else {
           deferred.resolve(brews && brews.length ? brews[0] : void 0);
       }
    });

    return deferred.promise;
}

BrewRepository.prototype.deleteBrewer = function(userId, location) {
    var deferred = Q.defer();

    var collection = this.db.get('brews');

    this.next(location)
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

BrewRepository.prototype.next = function(location, createIfNotPresent) {
    var deferred = Q.defer();

    var collection = this.db.get('brews');

    collection.find({ when: { $gt: new Date() }, where: location }, { limit: 1, sort: { when: 1 } }, function(e, brews){
        if (e) {
            deferred.reject(e);
        } else {
            if (createIfNotPresent && !brews.length) {
                this.createNext(location)
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
    }.bind(this));

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

BrewRepository.prototype.allFuture = function() {
    var deferred = Q.defer();

    var collection = this.db.get('brews');

    collection.find({ when: { $gt: new Date() } }, function(e, brews){
        if (e) {
            deferred.reject(e);
        } else {
            deferred.resolve(brews);
        }
    });

    return deferred.promise;
}

BrewRepository.prototype.addUserToNextBrew = function(userId, usersName, brewer, location) {
    var deferred = Q.defer();
    var self = this;

    this.next(location, true)
        .then(function(nextBrew) {
            this.deleteBrewer(userId, location)
                .then(function() {
                    var collection = this.db.get('brews');

                    collection.updateById(nextBrew._id, { $push: { brewers: { id: userId, name: usersName, brew: brewer.brew, sugars: brewer.sugars, milk: brewer.milk, comments: brewer.comment } }  }, function(e, brews) {
                        if (e) {
                            deferred.reject(e);
                        } else {
                            deferred.resolve(brews)
                        }
                    });
                }.bind(this))
        }.bind(this));

    return deferred.promise;
}

BrewRepository.prototype.save = function(brew) {
    var deferred = Q.defer();

    var collection = this.db.get('brews');

    collection.updateById(brew._id, brew, function(e, brews) {
        if (e) {
            deferred.reject(e);
        } else {
            deferred.resolve(brew)
        }
    });

    return deferred.promise;
};

BrewRepository.prototype.setRandomBrewer = function(brew) {
    var brewers = brew.brewers;

    var numberOfBrewers = brewers.length;

    brew.hasBrewer = numberOfBrewers > 0;

    if (numberOfBrewers == 0) {
        return brew;
    }

    var brewerIndex = Math.floor(Math.random() * numberOfBrewers)

    brewers[brewerIndex].isBrewing = true;

    brew.brewer = brewers[brewerIndex];

    return brew;
};

BrewRepository.prototype.createNext = function(location) {
    var deferred = Q.defer();

    var collection = this.db.get('brews');

    var nextWhen = moment().add(process.env.BREW_TIME || 10, process.env.BREW_UNIT || 'minutes');
    var self = this;

    collection.insert({ when: nextWhen.toDate(), where: location, brewers: [] }, function(err, doc) {
        if (err) {
            deferred.reject(err);
        } else {
            console.info('scheduling job for ' + doc.when);
            schedule.scheduleJob(doc.when, function() {
                this.get(doc._id)
                    .then(function(brew) {
                        var updatedBrew = this.setRandomBrewer(brew);
                        if (!updatedBrew.hasBrewer) {
                            return;
                        }

                        this.save(updatedBrew);

                        mailer().send(updatedBrew);
                    }.bind(this));
            }.bind(this));
            deferred.resolve(doc);
        }
    }.bind(this));

    return deferred.promise;
}