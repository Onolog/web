import React from 'react';

/**
 * EmptyState.react
 *
 * Standardized component for when there's no data to display.
 */
const EmptyState = (props) => (
  <div className="emptyState">
    {props.children}
  </div>
);

export default EmptyState;
