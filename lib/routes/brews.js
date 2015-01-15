var express = require('express'),
    moment = require('moment'),
    Q = require('q'),
    Repository = require('../brew-repository'),
    Auth0 = require('../auth0-promises'),
    router = express.Router();

var repo = Repository();

router.get('/', function(req, res) {
    repo.all()
        .then(function(brews) {
            res.status(200).json(brews);
        })
        .catch(function(error) {
            res.status(400).json(error);
        });
});

router.post('/', function(req, res) {
    var userId = req.session.user.sub;

    Auth0().getUser(userId)
        .then(function(user) {
            console.log(userId + '|' + user.name + "|" + JSON.stringify(req.body));
            return repo.addUserToNextBrew(userId, user.name, req.body)
        })
        .then(function(brew) {
            res.status(200).json(brew);
        })
        .fail(function(error) {
            res.status(400).json(error);
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