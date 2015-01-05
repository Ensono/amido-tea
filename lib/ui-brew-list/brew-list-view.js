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
        return {data: { loading: true }, isLoggedIn: this.props.isLoggedIn};
    },
    componentDidMount: function() {
        this.updateBrew();
        setInterval(this.updateBrew, 10000);
        window.addEventListener('brew_created', this.updateBrew)
        window.addEventListener('user_authentication', this.userLoggedIn)
    },
    componentWillUnmount: function() {
        window.removeEventListener('brew_created', this.updateBrew)
        window.removeEventListener('user_authentication', this.userLoggedIn)
    },
    userLoggedIn: function() {
        this.setState({data: this.state.data, isLoggedIn: true});
    },
    startNewBrew: function() {
        LightBox.displayComponent(<BrewForm onSuccess={LightBox.removeCurrentComponent} />);
    },
    updateBrew: function() {
        if (!this.state.isLoggedIn) {
            return;
        }
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            success: function(data) {
                this.setState({data: data, isLoggedIn: this.state.isLoggedIn});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    render: function() {
        if (!this.state.isLoggedIn) {
            return <div/>;
        }
        if (this.state.data.loading) {
            return <LoadingPane />;
        }
        if (!this.state.data.when) {
            return <NoBrewFound isLoggedIn={this.state.isLoggedIn} callback={this.startNewBrew}/>;
        }
        return  (
            <div className="next-round-title">
                <h1>Next round is {moment(this.state.data.when).fromNow()}</h1>
                <BrewList data={this.state.data} />
            </div>
        )
    }
});