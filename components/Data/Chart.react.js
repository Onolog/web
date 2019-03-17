// @flow

import * as React from 'react';

type Props = {
  children: ?any,
  className: ?string,
  height: number,
  transform: ?string,
  width: number,
};

const Chart = (props: Props) => {
  const {
    children,
    className,
    height,
    transform,
    width,
    ...otherProps
  } = props;

  return (
    <svg
      {...otherProps}
      className={className}
      height={height}
      width={width}>
      <g className="chart" transform={transform}>
        {children}
      </g>
    </svg>
  );
};

export default Chart;
