var React = require('react'),
    $ = require('jquery'),
    Repository = require('../brew-repository'),
    Auth0 = require('../auth0'),
    LightBox = require('../ui-lightbox'),
    BrewForm = require('../ui-brew-form'),
    Session = require('../session'),
    constants = require('../constants');

var session = Session(),
    auth0 = Auth0();

var Nav = React.createClass({
    getInitialState: function() {
        return { isLoggedIn: this.props.isLoggedIn };
    },
    handleAuthentication: function(e) {
        this.setState({ isLoggedIn: e.state.isLoggedIn });
    },
    componentDidMount: function() {
        window.addEventListener('user_authentication', this.handleAuthentication)
    },
    componentWillUnmount: function() {
        window.removeEventListener('user_authentication', this.handleAuthentication)
    },
    onAddBrewClicked: function() {
        LightBox.displayComponent(<BrewForm onSuccess={LightBox.removeCurrentComponent} />);
    },
    onLoginClicked: function() {
        auth0.showLogin()
            .then(function(loginDetails) {
                session.save(constants.COOKIE_LOGIN, loginDetails, 15);
                // ping api
                return $.ajax({
                    url: '/auth',
                    type: 'POST',
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader('Authorization', 'bearer ' + loginDetails.idToken);
                    }
                });
            }.bind(this))
            .then(function(success) {
                var event = new CustomEvent('user_authentication');
                event.state = { isLoggedIn: true, userId: session.get(constants.COOKIE_LOGIN, true).profile.user_id };
                window.dispatchEvent(event);
            }.bind(this));
    },
    render: function() {
        var callback = this.state.isLoggedIn ? this.onAddBrewClicked : this.onLoginClicked;
        var text = this.state.isLoggedIn ? "I Want a Brew" : "Log In";

        return <a className="btn" onClick={callback}>{text}</a>;
    }
});

module.exports = Nav;