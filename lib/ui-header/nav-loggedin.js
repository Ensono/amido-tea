var React = require('react');

module.exports = LoggedInNav;

function LoggedInNav() {

}

LoggedInNav.prototype.create = function() {
    return React.createClass({
        render: function() {
            return <a id="i-want-tea" className="btn" onClick={this.props.onAddBrewClicked}>I Want a Brew</a>
        }
    })
}