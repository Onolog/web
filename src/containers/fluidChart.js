/* eslint-disable react/no-find-dom-node */

import { ResizeSensor } from 'css-element-queries';
import React from 'react';
import { findDOMNode } from 'react-dom';

// Subtracts the padding from the element.
function getInnerWidth(node) {
  const style = getComputedStyle(node);

  const width = node.clientWidth; // width with padding
  const padding =
    parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);

  return width - padding;
}

export default function fluidChart(Component) {
  class WrappedChart extends React.Component {
    state = {
      width: this.props.width || 0,
    };

    componentDidMount() {
      const { parentNode } = findDOMNode(this);

      // Detect if the parent node's width has changed and adjust accordingly.
      this._sensor = new ResizeSensor(parentNode, this._setWidth);
      this._setWidth();
    }

    componentWillUnmount() {
      this._sensor.detach(findDOMNode(this).parentNode, this._setWidth);
    }

    render() {
      return (
        <Component
          {...this.props}
          {...this.state}
          preserveAspectRatio="none"
          viewBox={`0 0 ${this.state.width} ${this.props.height}`}
        />
      );
    }

    _setWidth = () => {
      const { parentNode } = findDOMNode(this);
      this.setState({ width: getInnerWidth(parentNode) });
    }
  }

  return WrappedChart;
}
