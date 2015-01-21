var React = require('react/addons');

var BrewForm = React.createClass({
    getInitialState: function() {
        return { loading: false };
    },
    handleSubmit: function(e) {
        e.preventDefault();

        var brew = this.refs.brew.getDOMNode().value.trim();
        var milk = this.refs.milk.getDOMNode().checked;
        var sugars = this.refs.sugars.getDOMNode().value.trim();
        var comment = this.refs.comment.getDOMNode().value.trim();

        if (!brew) {
            return;
        }

        this.setState({loading:true});
        var data = {
            brew: brew,
            milk: milk,
            sugars: sugars,
            comment: comment
        }

        var payload = JSON.stringify(data);

        // TODO: send request to the server
        $.ajax({
            type: 'post',
            url: '/brews/',
            contentType: 'application/json',
            dataType: 'json',
            data: payload,
            success: function(result) {
                var event = new CustomEvent('brew_created');
                event.state = { isAdding: true };
                window.dispatchEvent(event);
                this.props.onSuccess();
            }.bind(this),
            error: function(x, t, s) {
                this.setState({loading:false});
            }.bind(this)
        });

        this.refs.brew.getDOMNode().value = '';
    },
    render: function() {
        var options = ["None", 1, 2, 3, 4, 5].map(function(item) {
            return <option key={item} value={item}>{item}</option>;
        });
        var cx = React.addons.classSet;
        var classes = cx({
            'commentForm': true,
            'form': true,
            'spinner': this.state.loading
        });
        var blur = this.state.loading && "blur" || "";
        return (
            <form className={classes} role="form" onSubmit={this.handleSubmit}>
                <div className={blur}>
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
                    <input type="submit" className="btn btn-default" value="Brew Up" />
                </div>
            </form>
            );
    }
});

module.exports = BrewForm;