var express = require('express'),
    moment = require('moment'),
    Q = require('q'),
    _ = require('underscore'),
    constants = require('../constants'),
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

    var brew = req.body;

    if ('' + brew.minutes) {
        if (brew.minutes < 5 || brew.minutes > 10) {
            return res.status(400).json(new Error("Invalid brew minutes"));
        }
    }

    if (brew.comments && brew.comments.length > 256) {
        return res.status(400).json(new Error("Comment too long"));
    }

    if (!brew.sugars || constants.SUGAR_CHOICES.indexOf(brew.sugars) == -1) {
        return res.status(400).json(new Error("Invalid sugars"));
    }

    Auth0().getUser(userId)
        .then(function(user) {
            return repo.addUserToNextBrew(userId, user.name, brew, req.location)
        })
        .then(function(brew) {
            res.status(200).json(brew);
        })
        .fail(function(error) {
            res.status(400).json(error);
        });
});

router.delete('/', function(req, res) {
    var userId = req.session.user.sub;

    repo.deleteBrewer(userId, req.location)
        .then(function(result) {
            res.status(200).json({ status: 'ok' });
        })
        .fail(function(e) {
            res.status(400).json(e);
        })
});

/* GET root of brews. */
router.get('/next', function(req, res) {
    repo.next(req.location)
        .then(function(brew) {
            res.status(200).json(brew || {});
        })
        .fail(function(e) {
            res.status(400).json(e);
        });
});

router.get('/last', function(req, res) {
    var i = 0;
    var userId = req.session.user.sub;
    repo.getLastBrewForUserId(userId)
        .then(function(brew) {
            if (!brew) {
                res.status(200).json({});
            }
            var lastBrew = _.filter(brew.brewers, function(item) {
                return item.id === userId;
            });
            res.status(200).json(lastBrew.length ? lastBrew[0] : {})
        })
});

module.exports = router;