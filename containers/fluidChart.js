import React from 'react';
import {findDOMNode} from 'react-dom';

export default function fluidChart(Component) {
  class WrappedChart extends React.Component {
    state = {
      width: this.props.width || 400,
    };

    componentDidMount() {
      this._setWidth();
      window.addEventListener('resize', this._setWidth);
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this._setWidth);
    }

    render() {
      return <Component {...this.props} {...this.state} />;
    }

    _setWidth = () => {
      const width = findDOMNode(this).parentNode.offsetWidth;
      this.setState({width});
    }
  }

  return WrappedChart;
}
