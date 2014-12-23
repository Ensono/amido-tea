var EventEmitter = require('events').EventEmitter,
    HeaderView = require('./lib/ui-header'),
    Brews = require('./lib/brews'),
    BrewList = require('./lib/ui'),
    ocreate = require('./lib/object-create');

module.exports = AmidoTea;

function AmidoTea() {
    if (!(this instanceof AmidoTea)) {
        return new AmidoTea();
    }
    this.brews = new Brews();
    this.headerView = new HeaderView(this.brews);

    this.brewList = new BrewList();
    this.brewList.render('current-round');
}

AmidoTea.version = require('package.version');

AmidoTea.prototype = ocreate(EventEmitter.prototype);

document.addEventListener("DOMContentLoaded", function(event) {
    window.amidoTea = new AmidoTea();
});