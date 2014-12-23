var table = require('./table.ejs'),
    moment = require('moment'),
    $ = require('jquery'),
    Q = require('q'),
    latestBrew = require('./latest-brew.ejs');

module.exports = Brews;

function Brews() {

}

Brews.prototype.showLatest = function() {
    var self = this;
    $.getJSON('/brews/next')
        .done(function(brew) {
            if (brew.brewers) {
                self.currentRound = brew;
                self.render.call(self);
            }
        })
        .fail(function(err) {
            console.log(err);
        });
};

Brews.prototype.render = function() {
    var brew = this.currentRound;

    brew.whenFormatted = moment(brew.when).fromNow();
    var html = latestBrew(brew);
    $('section.current-tea-round .container').html(html);
};

Brews.prototype.getNextRound = function() {
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

Brews.prototype.addToCurrentRound = function() {
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
        });
}