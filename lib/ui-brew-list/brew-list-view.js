var $ = require('jquery'),
    LoadingPane = require('./section-loading'),
    NoBrewFound = require('./section-no-brew'),
    BrewList = require('./brew-list'),
    Repository = require('../brew-repository'),
    moment = require('moment'),
    React = require('react');

module.exports = React.createClass({
    getInitialState: function() {
        return {data: { loading: true }};
    },
    componentDidMount: function() {
        this.updateBrew();
        setInterval(this.updateBrew, 10000);
    },
    startNewBrew: function() {
        var self = this;
        $.ajax({
            url: '/brews',
            type: 'post',
            contentType: 'application/json'
        }).done(function(nextRound) {
            $.ajax({
                url: '/brews/' + nextRound._id,
                type: 'post',
                contentType: 'application/json',
                success: function(data) {
                    this.updateBrew();
                }.bind(self),
                error: function(xhr, status, err) {
                    console.error('/brews/' + nextRound._id, status, err.toString());
                }.bind(self)
            });
        });
    },
    updateBrew: function() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            success: function(data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    render: function() {
        if (this.state.data.loading) {
            return <LoadingPane />;
        }
        if (!this.state.data.when) {
            return <NoBrewFound callback={this.startNewBrew}/>;
        }
        return  (
            <div className="next-round-title">
                <h1>Next round is {moment(this.state.data.when).fromNow()}</h1>
                <BrewList data={this.state.data} />
            </div>
        )
    }
});