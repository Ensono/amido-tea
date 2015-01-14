var React = require('react'),
    Brewer = require('./brewer');

module.exports = React.createClass({
    render: function() {
        var self = this;
        var brewerNodes = this.props.data.brewers.map(function(brewer) {
            return <Brewer onRemove={self.props.onRemove} userId={self.props.userId} data={brewer} />
        });
        return (
            <table className="table table-striped">
                <thead>
                    <th>Name</th>
                    <th>Brew</th>
                    <th>Sugars</th>
                    <th>Milk</th>
                    <th>Comments</th>
                    <th>Actions</th>
                </thead>
                <tbody className="tb">
                    {brewerNodes}
                </tbody>
            </table>
            )
    }
});