var EventEmitter = require('events').EventEmitter,
    HeaderView = require('./lib/ui-header'),
    Session = require('./lib/session'),
    constants = require('./lib/constants'),
    React = require('react'),
    BrewListView = require('./lib/ui-brew-list'),
    ocreate = require('./lib/object-create');

module.exports = AmidoTea;

function AmidoTea(isLoggedIn) {
    if (!(this instanceof AmidoTea)) {
        return new AmidoTea(isLoggedIn);
    }

    this.isLoggedIn = isLoggedIn;
    this.session = new Session();

    React.render(
        <HeaderView isLoggedIn={isLoggedIn} />,
        document.getElementsByTagName('header')[0]
    );

    React.render(
        <BrewListView userId={this.getUserId()} isLoggedIn={isLoggedIn} url="/brews/next" />,
        document.getElementById('current-round')
    )

}

AmidoTea.version = require('package.version');

AmidoTea.prototype = ocreate(EventEmitter.prototype);

AmidoTea.prototype.getUserId = function() {
    return this.getProfileAttribute('user_id');
}

AmidoTea.prototype.getProfile = function() {
    var cookie = this.session.get(constants.COOKIE_LOGIN, true);
    return cookie && cookie.profile || {};
}

AmidoTea.prototype.getProfileAttribute = function(key) {
    if (!this.getProfile()) return '';

    return this.getProfile()[key];
}