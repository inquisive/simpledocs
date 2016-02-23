import React from 'react';

export default class TouchableArea extends React.Component {

    constructor(props) {
        super(props)
        this.displayName = 'touch wrapper'	
        this.state = {
        }
        
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);
       
    }
  
    handleTouchStart(e) {
        if (!this.props.scroller || !this.props.touchable) {
            return;
        }

        this.props.scroller.doTouchStart(e.touches, e.timeStamp);
        e.preventDefault();
    }

    handleTouchMove(e) {
        if (!this.props.scroller || !this.props.touchable) {
            return;
        }

        this.props.scroller.doTouchMove(e.touches, e.timeStamp, e.scale);
        e.preventDefault();
    }

    handleTouchEnd(e) {
        if (!this.props.scroller || !this.props.touchable) {
            return;
        }

        this.props.scroller.doTouchEnd(e.timeStamp);
        e.preventDefault();
    }

    render() {
        return (
            <div
                onTouchStart={this.handleTouchStart}
                onTouchMove={this.handleTouchMove}
                onTouchEnd={this.handleTouchEnd}
                onTouchCancel={this.handleTouchEnd}>
                {this.props.children}
            </div>
        );
    }
}

TouchableArea.defaultProps = {
    touchable: true
};
