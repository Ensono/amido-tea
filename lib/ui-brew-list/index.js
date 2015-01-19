var $ = require('jquery'),
    LoadingPane = require('./section-loading'),
    NoBrewFound = require('./section-no-brew'),
    GuestPanel = require('./section-guest'),
    BrewList = require('./brew-list'),
    LightBox = require('../ui-lightbox'),
    BrewForm = require('../ui-brew-form'),
    moment = require('moment'),
    React = require('react');

var BrewListView = React.createClass({
    getInitialState: function() {
        return {data: { loading: true }, userId: this.props.userId, isLoggedIn: this.props.isLoggedIn};
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
    userLoggedIn: function(e) {
        this.setState({isLoggedIn: true, userId: e.state.userId });
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
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    removeClicked: function() {
        $.ajax({
            url: '/brews',
            type: 'delete',
            dataType: 'json',
            success: function(data) {
                var event = new CustomEvent('brew_created');
                event.state = { isAdding: false };
                window.dispatchEvent(event);
                this.updateBrew();
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    render: function() {
        if (!this.state.isLoggedIn) {
            return <GuestPanel />;
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
                <BrewList onRemove={this.removeClicked} userId={this.state.userId} data={this.state.data} />
            </div>
            )
    }
});

BrewListView.render = function(element) {
    React.render(
        <BrewListView isLoggedIn={this.isLoggedIn} url="/brews/next"/>,
        element
    );
}

module.exports = BrewListView;