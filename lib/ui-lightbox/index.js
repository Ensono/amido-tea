var React = require('react');

var LightBox = React.createClass({
   getInitialState: function() {
       return { active:false }
   },
   markAsActive: function() {
       this.setState({active:true});
   },
   render: function() {
       setTimeout(this.markAsActive, 50);
       return (
           <div>
               <div className={"lightbox-bg" + (this.state.active ? " active" : "")}></div>
               <div className="lightbox">
                   <div className="lightbox-wrap">
                        {this.props.children}
                   </div>
               </div>
           </div>
           )
   }
});

LightBox.currentComponent = null;

// TODO: create if missing
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