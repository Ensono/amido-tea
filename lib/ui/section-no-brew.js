var React = require('react');

module.exports = React.createClass({
    render: function() {
        return  <div className="loading-brew">
            <h1 className="tagline-header">No Brew Found</h1>
            <p className="tagline-subheader"><a className="btn" href="#" onClick={this.props.callback}>Start One</a></p>
        </div>
    }
});