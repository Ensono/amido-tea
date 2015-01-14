var React = require('react');

var GuestPanel = React.createClass({
    render: function() {
        return  <div className="guest-brew">
            <h1 className="tagline-header">You must be logged in to brew up</h1>
        </div>
    }
})

module.exports = GuestPanel;