var React = require('react');

module.exports = LoggedOutNav;

function LoggedOutNav() {

}

LoggedOutNav.prototype.create = function() {
    return React.createClass({
        render: function() {
            return <a id="log-in" className="btn" onClick={this.props.onLoginClicked}>Log In</a>
        }
    })
}