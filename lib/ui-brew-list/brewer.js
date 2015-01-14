var React = require('react');

module.exports = React.createClass({
    render: function() {
        if (this.props.userId == this.props.data.id) {
            var link = <a onClick={this.props.onRemove}>Remove</a>;
        }
        return (
            <tr>
                <td>{this.props.data.name}</td>
                <td>{this.props.data.brew}</td>
                <td>{this.props.data.sugars}</td>
                <td>{this.props.data.milk ? "Y" : "N"}</td>
                <td>{this.props.data.comments}</td>
                <td>{link}</td>
            </tr>
            )
    }
});