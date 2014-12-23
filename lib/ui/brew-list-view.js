var $ = require('jquery'),
    LoadingPane = require('./section-loading'),
    NoBrewFound = require('./section-no-brew'),
    BrewList = require('./brew-list'),
    React = require('react');

var BrewListView = React.createClass({
    getInitialState: function() {
        return {data: { loading: true }};
    },
    componentDidMount: function() {
        this.updateBrew();
        setInterval(this.updateBrew, 10000);
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
            return <NoBrewFound />;
        }
        return  <div className="next-round-title">
            <h1>Next round is {moment(this.state.data.when).fromNow()}</h1>
            <BrewList data={this.state.data} />
        </div>
    }
});

module.exports = BrewListView;