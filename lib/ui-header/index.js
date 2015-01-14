var React = require('react'),
    $ = require('jquery'),
    Repository = require('../brew-repository'),
    Auth0 = require('../auth0'),
    LightBox = require('../ui-lightbox'),
    Nav = require('./nav'),
    BrewForm = require('../ui-brew-form'),
    Session = require('../session'),
    constants = require('../constants');

var HeaderView = React.createClass({
    render: function() {
        return (
            <div className="container">
                <a href="/">
                    <h1 className="logo">ATeaDo></h1>
                </a>
                <nav>
                    <Nav isLoggedIn={this.props.isLoggedIn} />
                </nav>
            </div>
            )
    }
});

module.exports = HeaderView;