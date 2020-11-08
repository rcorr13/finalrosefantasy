import React, { Component } from 'react';
import PropTypes from 'prop-types';

//source: https://stackoverflow.com/questions/48834211/prevent-a-double-click-being-interpreted-as-two-single-clicks

export default class DoubleClick extends Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
        this.onDoubleClick = this.onDoubleClick.bind(this);
        this.timeout = null;
    }

    onClick(e) {
        e.preventDefault();
        if(this.timeout === null) {
            this.timeout = window.setTimeout(() => {
                this.timeout = null;
                this.props.onClick();
            }, 300);
        }
    }

    onDoubleClick(e) {
        e.preventDefault();
        window.clearTimeout(this.timeout);
        this.timeout = null;
        this.props.onDoubleClick();
    }

    render() {
        const { onClick, onDoubleClick, children, ...childProps } = this.props;
        const props = Object.assign(childProps, { onClick: this.onClick, onDoubleClick: this.onDoubleClick });
        return React.cloneElement(children, props);
    }
}

DoubleClick.propTypes = {
    onClick: PropTypes.func.isRequired,
    onDoubleClick: PropTypes.func.isRequired,
    children: PropTypes.element.isRequired,
};