import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import './css/ActivitySection.css';

/**
 * ActivitySection.react
 */
const ActivitySection = ({border, children, className, title}) => {
  const sectionTitle = title ?
    <h4 className="activitySectionTitle">
      {title}
    </h4> :
    null;

  return (
    <div
      className={cx('activitySection', {
        'activitySectionBorder': border,
      }, className)}>
      {sectionTitle}
      {children}
    </div>
  );
};

ActivitySection.propTypes = {
  border: PropTypes.bool,
  title: PropTypes.string,
};

ActivitySection.defaultProps = {
  border: false,
  title: '',
};

export default ActivitySection;
