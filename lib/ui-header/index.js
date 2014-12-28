var React = require('react'),
    $ = require('jquery'),
    Repository = require('../brew-repository'),
    Auth0 = require('../auth0'),
    Session = require('../session'),
    constants = require('../constants');

module.exports = HeaderView;

var Element;

function HeaderView() {
    if(!(this instanceof HeaderView)) {
        return new HeaderView();
    }

    this.repo = new Repository();
    this.auth0 = new Auth0();
    this.session = new Session();
}

var createNav = function(isLoggedIn) {
    var self = this;
    return React.createClass({
        onAddBrewClicked: function() {

        },
        onLoginClicked: function() {
            self.auth0.showLogin()
                .then(function(loginDetails) {
                    this.session.save(constants.COOKIE_LOGIN, loginDetails);
                    // ping api
                    return $.ajax({
                        url: '/auth',
                        type: 'POST',
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader('Authorization', 'bearer ' + loginDetails.idToken);
                        }
                    });
                }.bind(self))
                    .then(function(success) {
                        this.props.isLoggedIn = true;
                        this.render();
                    }.bind(this));
        },
        render: function() {
            var callback = this.props.isLoggedIn ? this.onAddBrewClicked.bind(this) : this.onLoginClicked.bind(this);
            var text = this.props.isLoggedIn ? "I Want a Brew" : "Log In";

            return <a className="btn" onClick={callback}>{text}</a>;
        }
    });
}

HeaderView.prototype.create = function(isLoggedIn) {
    var Nav = createNav(isLoggedIn);

    this.el = React.createClass({
        render: function() {
            return (
                <div className="container">
                    <a href="/">
                        <h1 className="logo">ATeaDo></h1>
                    </a>
                    <nav>
                        <Nav isLoggedIn={isLoggedIn} />
                    </nav>
                </div>
            )
        }
    });

    return this;
}

HeaderView.prototype.render = function(element) {
    if (!this.el) throw new Error("No element set. Have you called create?");

    var ElementToCreate = this.el;

    React.render(
        <ElementToCreate />,
        element
    );
}