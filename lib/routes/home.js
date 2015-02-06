var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('home/index', { location: req.location, isLoggedIn: req.session && req.session.user && req.session.user.aud === process.env.AUTH0_CLIENTID });
});
module.exports = router;
