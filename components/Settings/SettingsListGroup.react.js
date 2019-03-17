import PropTypes from 'prop-types';
import React from 'react';
import { Col, Row, ListGroup, ListGroupItem } from 'react-bootstrap';

import './css/SettingsListGroup.css';

const SettingsListGroup = (props) => (
  <ListGroup className="settings-list-group">
    {props.children}
  </ListGroup>
);

const SettingsListGroupItem = (props) => (
  <ListGroupItem className="settings-list-group-item">
    <Row>
      <Col md={3}>
        <h4 className="settings-list-group-item-title">
          {props.title}
        </h4>
        <p className="settings-list-group-item-description">
          {props.description}
        </p>
      </Col>
      <Col md={5}>
        {props.children}
      </Col>
    </Row>
  </ListGroupItem>
);

SettingsListGroupItem.propTypes = {
  description: PropTypes.string,
  title: PropTypes.string.isRequired,
};

SettingsListGroup.Item = SettingsListGroupItem;

export default SettingsListGroup;
