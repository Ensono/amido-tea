var React = require('react/addons'),
    constants = require('../constants'),
    _ = require('underscore');

var BrewForm = React.createClass({
    mixins: [React.addons.LinkedStateMixin],
    getInitialState: function() {
        return { isNew: false, loading: true, comments: '', milk: false, brew: '', sugars: 'None', minutesToBrew: 10 };
    },
    componentWillMount: function() {
        $.ajax({
            type: 'get',
            contentType: 'application/json',
            dataType: 'json',
            url: '/brews/last',
            success: function(brew) {
                this.setState(brew)
                this.setState({loading: false})
            }.bind(this),
            error: function(a,b,c) {

            }.bind(this)
        })

        $.ajax({
            type: 'get',
            contentType: 'application/json',
            dataType: 'json',
            url: '/brews/next',
            success: function(brew) {
                this.setState({isNew: !_.keys(brew).length })
            }.bind(this),
            error: function(a,b,c) {

            }.bind(this)
        })
    },
    handleSubmit: function(e) {
        e.preventDefault();


        if (!this.state.brew.trim()) {
            return;
        }

        this.setState({loading:true});

        var data = {
            brew: this.state.brew,
            milk: this.state.milk,
            sugars: this.state.sugars,
            comments: this.state.comments
        }

        if (this.state.isNew) {
            data.minutes = this.state.minutesToBrew;
        }

        var payload = JSON.stringify(data);

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
        var options = constants.SUGAR_CHOICES.map(function(item) {
            return <option key={item} value={item}>{item}</option>;
        });
        var brewTimeOptions = [5, 6, 7, 8, 9, 10].map(function(item) {
            return <option key={item} value={item}>{item}</option>;
        });
        var cx = React.addons.classSet;
        var classes = cx({
            'commentForm': true,
            'form': true,
            'spinner': this.state.loading
        });

        var brewTime = this.state.isNew ? <div className="form-group">
            <label htmlFor="minutesToBrew">Minutes until brew</label>
            <select valueLink={this.linkState('minutesToBrew')} className="form-control" id="minutesToBrew" ref="minutesToBrew">
                            {brewTimeOptions}
            </select>
        </div> : <div/>;

        var blur = this.state.loading && "blur" || "";
        return (
            <form className={classes} role="form" onSubmit={this.handleSubmit}>
                <div className={blur}>
                    <div className="form-group">
                        <label htmlFor="brew">Type of Brew</label>
                        <input className="form-control" type="text" id="brew" valueLink={this.linkState('brew')} placeholder="Tea / Coffee / Peppermint Tea" ref="brew" />
                    </div>
                    <div className="checkbox">
                        <label>
                            <input id="milk" type="checkbox" checkedLink={this.linkState('milk')} ref="milk" value="true"/> Milk
                        </label>
                    </div>
                    <div className="form-group">
                        <label htmlFor="sugars">Sugars</label>
                        <select valueLink={this.linkState('sugars')} className="form-control" id="sugars" ref="sugars">
                            {options}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="comment">Comments</label>
                        <textarea valueLink={this.linkState('comments')} id="comments" className="form-control" placeholder="Say something..." ref="comments" />
                    </div>
                    {brewTime}
                    <input type="submit" className="btn btn-default" value="Brew Up" />
                </div>
            </form>
            );
    }
});

module.exports = BrewForm;