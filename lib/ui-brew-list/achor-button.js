var React = require('react');

module.exports = AnchorButton;

function AnchorButton(action, linkText) {
    this.action = action;
    this.linkText = linkText;
}

AnchorButton.prototype.create = function() {
    return React.createClass({
        render: function() {
            return <a className="btn" onClick={this.action}>{this.linkText}</a>
        }
    });
};