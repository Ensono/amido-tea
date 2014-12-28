var React = require('react'),
    BrewListView = require('./brew-list-view');

module.exports = BrewListUi;

function BrewListUi() {}

BrewListUi.prototype.create = function() {
    return this;
};

BrewListUi.prototype.render = function(element) {
    React.render(
        <BrewListView url="/brews/next"/>,
        element
    );
};
