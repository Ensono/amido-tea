var $ = require('jquery'),
    LoadingPane = require('./section-loading'),
    NoBrewFound = require('./section-no-brew'),
    BrewList = require('./brew-list'),
    LightBox = require('../ui-lightbox'),
    BrewForm = require('../ui-brew-form'),
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
        window.addEventListener('brew_created', this.updateBrew)
    },
    componentWillUnmount: function() {
        window.removeEventListener('brew_created', this.updateBrew)
    },
    startNewBrew: function() {
        LightBox.displayComponent(<BrewForm onSuccess={LightBox.removeCurrentComponent} />);
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