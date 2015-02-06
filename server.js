var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    schedule = require('node-schedule'),
    Q = require('q'),
    jwt = require('express-jwt'),
    session = require('cookie-session'),
    util = require('util'),
    https = require('https'),
    _ = require('underscore'),
    brewRoutes = require('./lib/routes/brews'),
    homeRoutes = require('./lib/routes/home'),
    Repo = require('./lib/brew-repository'),
    mailer = require('./lib/mailer');

var jwtCheck = jwt({
    secret: new Buffer(process.env.AUTH0_CLIENT_SECRET, 'base64'),
    audience: process.env.AUTH0_CLIENTID
});

var repo = Repo();

var locations = {};

app.use(session({
    keys: ['b15cuits', 'c4kes']
}));

app.use( bodyParser.json() );

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next();
});

app.use(function(req, res, next) {
    var header = req.headers['x-forwarded-for'];
    var ip = req.ip || (header ? header.split(':')[0] : "");
    repo.getLocationByIp(ip)
        .then(function(location) {
            if (!location) {
                res.status(401).json({error: util.format("Sorry, your IP is not recognised (%s)", ip)})
            } else {
                req.location = location.name;
                next();
            }
        })
});


app.use('/brews', function(req, res, next) {
    if (!req.session || !req.session.user || req.session.user.aud !== process.env.AUTH0_CLIENTID) {
        res.status(401).json({ status: 'unauthorized' })
    }
    else {
        next();
    }
});

app.use('/auth', jwtCheck);

app.use('/', homeRoutes);
app.use('/brews', brewRoutes);

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(express.static(__dirname + '/public'));
app.use( bodyParser.json() );

app.post('/auth', function(req, res) {
    req.session.user = req.user;

    res.status(200).json({ok: true});
});

app.listen(process.env.PORT || 3000);

repo.allFuture()
    .then(function(brews) {
        _.each(brews, function(futureBrew) {
            console.info('scheduling job for ' + futureBrew.when);
            schedule.scheduleJob(futureBrew.when, function() {
                repo.get(futureBrew._id)
                    .then(function(brew) {
                        mailer().send(brew);
                    });
            });
        });
    });

module.exports = app;
