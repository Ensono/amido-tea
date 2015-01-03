var React = require('react');

var LightBox = React.createClass({
   getInitialState: function() {
       return { active:false }
   },
   markAsActive: function() {
       this.setState({active:true});
   },
   componentDidMount: function() {
       setTimeout(this.markAsActive, 50);
   },
   close: function() {
       LightBox.removeCurrentComponent();
   },
   render: function() {
       return (
           <div>
               <div className={"lightbox-bg" + (this.state.active ? " active" : "")}></div>
               <div className="lightbox">
                   <div className="lightbox-wrap">
                       <div className="lightbox-controls"><button onClick={this.close}>close</button></div>
                       {this.props.children}
                   </div>
               </div>
           </div>
           )
   }
});

LightBox.currentComponent = null;

LightBox.getContainer = function() {
    return document.getElementById("lightbox-container");
};

LightBox.displayComponent = function (component) {
    if (LightBox.currentComponent) LightBox.removeCurrentComponent();
    LightBox.currentComponent = component;
    React.render(
        <LightBox>{component}</LightBox>,
        LightBox.getContainer()
    );
};

LightBox.removeCurrentComponent = function() {
    if (!LightBox.currentComponent) return;
    React.unmountComponentAtNode(LightBox.getContainer());
    LightBox.currentComponent = null;
};

module.exports = LightBox;