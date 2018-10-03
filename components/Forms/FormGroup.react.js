import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {Col, ControlLabel, FormGroup, HelpBlock} from 'react-bootstrap';

/**
 * FormRow.react
 */
const FormRow = (props) => {
  const {children, error, inline, label} = props;

  return (
    <FormGroup
      className={cx({'form-inline': inline})}
      validationState={error ? 'error' : null}>
      <Col sm={3}>
        <ControlLabel>{label}</ControlLabel>
      </Col>
      <Col sm={9}>
        {children}
        {error && <HelpBlock>{error}</HelpBlock>}
      </Col>
    </FormGroup>
  );
};

FormRow.propTypes = {
  error: PropTypes.string,
  inline: PropTypes.bool,
  label: PropTypes.string,
  name: PropTypes.string,
};

export default FormRow;
