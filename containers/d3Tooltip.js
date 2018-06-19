import * as d3 from 'd3';
import d3tip from 'd3-tip';
import PropTypes from 'prop-types';
import React from 'react';
import {findDOMNode} from 'react-dom';

export default function d3Tooltip(Component) {
  class TooltipComponent extends React.Component {
    componentDidMount() {
      this._setTooltip(this.props);
    }

    componentWillReceiveProps(nextProps) {
      this._setTooltip(nextProps);
    }

    render() {
      return <Component {...this.props} {...this.state} />;
    }

    _setTooltip = ({tooltip}) => {
      if (!tooltip) {
        return;
      }

      const tip = d3tip()
        .attr('class', 'tooltip top')
        .html(`
          <div class="tooltip-arrow"></div>
          <div class="tooltip-inner">${tooltip}</div>
        `);

      d3.select(findDOMNode(this))
        .call(tip)
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);
    };
  }

  TooltipComponent.propTypes = {
    tooltip: PropTypes.string,
  };

  return TooltipComponent;
}
