var $ = require('jquery'),
    bind = require('../bind'),
    Session = require('../session'),
    moment = require('moment'),
    stop = require('../stop-event'),
    constants = require('../constants'),
    Auth0 = require('../auth0');

module.exports = HeaderView;

function HeaderView(brews) {
    if(!(this instanceof HeaderView)) {
        return new HeaderView();
    }

    this.create();

    this.query('#log-in').on('click', bind(this.login, this));

    this.query('#i-want-tea').on('click', bind(this.addToCurrentRound, this));
    this.query('#brews').on('click', bind(this.showBrews, this));
    this.query('#brewers').on('click', bind(this.showBrewers, this));
    this.brews = brews;

//    if ($('section.current-tea-round').length) {
//        this.brews.showLatest();
//    }

    this.auth0 = new Auth0();
    this.session = new Session();
}

HeaderView.prototype.create = function() {
    this.el = $('header');

    return this;
};

HeaderView.prototype.query = function(selector) {
    return $(selector, this.el);
};

HeaderView.prototype.addToCurrentRound = function(e) {
    this.brews.addToCurrentRound();
};

HeaderView.prototype.showBrews = function(e) {

};

HeaderView.prototype.showBrewers = function(e) {

};

HeaderView.prototype.login = function(e) {
    stop(e);

    var self = this;

    this.auth0.showLogin()
        .then(function(loginDetails) {

            self.session.save(constants.COOKIE_LOGIN, loginDetails);
            // ping api
            return $.ajax({
                url: '/auth',
                type: 'POST',
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', 'bearer ' + loginDetails.idToken);
                }
            });
        })
        .then(function(data) {
            window.location.reload(true);
        })
        .fail(function(err) {
            console.error('something went wrong ' + err.message);
        })
}