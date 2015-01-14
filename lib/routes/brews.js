var express = require('express'),
    moment = require('moment'),
    Q = require('q'),
    Auth0 = require('../auth0-promises'),
    router = express.Router();

var nextBrew = function(db) {
    var deferred = Q.defer();

    var collection = db.get('brews');

    collection.find({ when: { $gt: new Date() } }, { limit: 1, sort: { when: 1 } }, function(e, brews){
        if (e) {
            deferred.reject(e);
        } else {
            deferred.resolve(brews[0]);
        }
    });

    return deferred.promise;
};

var createNextBrew = function(db) {
    var deferred = Q.defer();

    var collection = db.get('brews');

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

router.get('/', function(req, res) {
    var db = req.db;
    var collection = db.get('brews');

    collection.find({},{}, function(e, brews){
        res.status(200).json(brews);
    });

});

router.post('/', function(req, res) {
    var db = req.db;
    var userId = req.session.user.sub;

    createNextBrew(db)
        .then(function(nb) {
            Auth0().getUser(userId)
                .then(function(user) {
                    var brewDetails = req.body;

                    var collection = db.get('brews');

                    collection.updateById(nb._id, { $push: { brewers: { id: userId, name: user.name, brew: brewDetails.brew, sugars: brewDetails.sugars, milk: brewDetails.milk, comments: brewDetails.comment } }  }, function(e, brews) {
                        res.status(200).json(brews);
                    });
                });
        });
});

router.delete('/', function(req, res) {
    var db = req.db;
    var collection = db.get('brews');

    var userId = req.session.user.sub;

    nextBrew(db)
        .then(function(nb) {
            collection.updateById(nb._id, { $pull: { brewers: { id: userId } } }, function(e, brews) {
                res.status(200).json(brews);
            });
        });
});

/* GET root of brews. */
router.get('/next', function(req, res) {
    var db = req.db;
    var collection = db.get('brews');

    collection.find({ when: { $gt: new Date() } }, { limit: 1, sort: { when: 1 } }, function(e, brews){
        res.status(200).json(brews && brews.length ? brews[0] : {});
    });

});

module.exports = router;