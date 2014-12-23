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

router.get('/', function(req, res) {
    var db = req.db;
    var collection = db.get('brews');

    collection.find({},{}, function(e, brews){
        res.status(200).json(brews);
    });

});

router.post('/', function(req, res) {
    var db = req.db;
    var collection = db.get('brews');

    var nextWhen = req.body.when;

    if (!nextWhen) {
        nextWhen = moment().add(10, 'minutes');
    }
    else if (nextWhen instanceof Date) {
        nextWhen = moment(nextWhen);
    }

    collection.insert({ when: nextWhen.toDate(), brewers: [] }, function(e, brews) {
        nextBrew(db)
            .then(function(nb) {
                console.log(nb);
                res.status(200).json(nb);
            });
    })
});

router.post('/:id', function(req, res) {
    var id = req.params.id,
        brewDetails = req.body.brewDetails;

    var userId = req.session.user.sub;

    Auth0().getUser(userId)
        .then(function(user) {
            var db = req.db;

            var collection = db.get('brews');

            collection.updateById(id, { $push: { brewers: { id: userId, name: user.name, brew: 'tea', sugars: 0, milk: false, comments: 'nom' } }  }, function(e, brews) {
                res.status(200).json(brews);
            });
        });
});

/* GET root of brews. */
router.get('/next', function(req, res) {
    var db = req.db;
    var collection = db.get('brews');

    collection.find({ when: { $gt: new Date() } }, { limit: 1, sort: { when: 1 } }, function(e, brews){
        res.status(200).json(brews[0] || {});
    });

});

/* GET root of brews. */
router.get('/add/:id', function(req, res) {
    var id = req.params.id;
    var db = req.db;
    var collection = db.get('brews');

    collection.find({ when: { $lt: new Date() } }, { limit: 1 }, function(e, brews){
        res.status(200).json(brews);
    });

});

module.exports = router;