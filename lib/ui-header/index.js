var React = require('react'),
    Nav = require('./nav');

var HeaderView = React.createClass({
    render: function() {
        return (
            <div className="container">
                <a href="/">
                    <h1 className="logo">ATeaDo></h1>
                </a>
                <nav>
                    <Nav isLoggedIn={this.props.isLoggedIn} />
                </nav>
            </div>
            )
    }
});

module.exports = HeaderView;