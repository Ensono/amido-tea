var moment = require('moment'),
    $ = require('jquery'),
    schedule = require('node-schedule'),
    Q = require('q');

module.exports = BrewRepository;

function BrewRepository() {
    if (!(this instanceof BrewRepository))
        return new BrewRepository();
}

BrewRepository.prototype.getNextRound = function() {
    var deferred = Q.defer();
    var self = this;

    if (this.currentRound) {
        deferred.resolve(this.currentRound);
    } else {
        $.ajax({
            url: '/brews',
            type: 'post',
            contentType: 'application/json'
        }).done(function(data) {
            self.currentBrew = data;
            deferred.resolve(data);
        })
            .fail(function(err) {
                deferred.reject(err);
            })
    }

    return deferred.promise;
}

BrewRepository.prototype.scheduleJobEmail = function(brew) {
    this.getNextRound().then(function(nextBrew) {
        console.log('scheduling job for ' + nextBrew.when);
        schedule.scheduleJob(brew.when, function() {
            console.log('RUNNING!');
        });
    });
}

BrewRepository.prototype.addToCurrentRound = function() {
    var self = this;
    this.getNextRound()
        .then(function(nextRound) {
            return $.ajax({
                url: '/brews/' + nextRound._id,
                type: 'post',
                contentType: 'application/json'
            })
        })
        .then(function(nextRound) {
            self.currentRound = nextRound;
            self.render();

            schedule.scheduleJob(nextRound.when, function() {
                console.log('RUNNING!');
            });
        });
}