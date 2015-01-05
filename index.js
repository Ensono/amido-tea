var EventEmitter = require('events').EventEmitter,
    HeaderView = require('./lib/ui-header'),
    BrewList = require('./lib/ui-brew-list'),
    ocreate = require('./lib/object-create');

module.exports = AmidoTea;

function AmidoTea(isLoggedIn) {
    if (!(this instanceof AmidoTea)) {
        return new AmidoTea(isLoggedIn);
    }

    this.isLoggedIn = isLoggedIn;

    this.headerView = new HeaderView();
    this.headerView
        .create(isLoggedIn)
        .render(document.getElementsByTagName('header')[0]);

    this.brewList = new BrewList();

    this.brewList
        .create(isLoggedIn)
        .render(document.getElementById('current-round'));
}

AmidoTea.version = require('package.version');

AmidoTea.prototype = ocreate(EventEmitter.prototype);