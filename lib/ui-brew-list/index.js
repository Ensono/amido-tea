var React = require('react'),
    BrewListView = require('./brew-list-view');

module.exports = BrewListUi;

function BrewListUi() {
    this.currentComponent = null;
}

BrewListUi.prototype.create = function(isLoggedIn) {
    this.isLoggedIn = isLoggedIn;
    return this;
};

BrewListUi.prototype.render = function(element) {
    React.render(
        <BrewListView isLoggedIn={this.isLoggedIn} url="/brews/next"/>,
        element
    );
};
