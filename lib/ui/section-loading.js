var $ = require('jquery'),
    React = require('react');

var LoadingPane = React.createClass({
    render: function() {
        return  <div className="loading-brew">
            <h1 className="tagline-header">Loading brew...</h1>
        </div>
    }
})

module.exports = LoadingPane;