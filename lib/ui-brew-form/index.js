var React = require('react');

var BrewForm = React.createClass({
    handleSubmit: function(e) {
        e.preventDefault();

        var brew = this.refs.brew.getDOMNode().value.trim();
        var milk = this.refs.milk.getDOMNode().value.trim();
        var sugars = this.refs.sugars.getDOMNode().value.trim();
        var comment = this.refs.comment.getDOMNode().value.trim();

        if (!brew) {
            return;
        }

        console.log([brew, milk, sugars, comment]);
        // TODO: send request to the server
        this.refs.brew.getDOMNode().value = '';
    },
    render: function() {
        var options = ["None", 1, 2, 3, 4, 5].map(function(item) {
            return <option value={item}>{item}</option>;
        });

        return (
            <form className="commentForm form" role="form" onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <label htmlFor="brew">Type of Brew</label>
                    <input className="form-control" type="text" id="brew" placeholder="Tea / Coffee / Peppermint Tea" ref="brew" />
                </div>
                <div className="checkbox">
                    <label>
                        <input id="milk" type="checkbox" ref="milk" value="true"/> Milk
                    </label>
                </div>
                <div className="form-group">
                    <label htmlFor="sugars">Sugars</label>
                    <select className="form-control" id="sugars" ref="sugars">
                        {options}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="comment">Comments</label>
                    <textarea id="comment" className="form-control" placeholder="Say something..." ref="comment" />
                </div>
                <input type="submit" className="btn btn-default" value="Post" />
            </form>
            );
    }
});

module.exports = BrewForm;