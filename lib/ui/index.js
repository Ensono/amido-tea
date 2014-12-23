var React = require('react'),
    moment = require('moment'),
    BrewListView = require('./brew-list-view');

module.exports = BrewListUi;


function BrewListUi() {

}

BrewListUi.prototype.render = function(elementId) {
    React.render(
        <BrewListView url="/brews/next"/>,
        document.getElementById(elementId)
    );
};
