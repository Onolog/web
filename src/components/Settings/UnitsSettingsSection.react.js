import React from 'react';
import { ControlLabel, FormGroup, Radio } from 'react-bootstrap';

import AppForm from '../Forms/AppForm.react';
import SettingsListGroup from './SettingsListGroup.react';

import { UNITS } from '../../constants/metrics';

const UnitsSettingsSection = ({ onChange, user }) => {
  const units = [
    { label: 'Miles', value: UNITS.MILES },
    { label: 'Kilometers', value: UNITS.KILOMETERS },
  ];

  return (
    <SettingsListGroup.Item
      description="Default settings for units of measure."
      title="Units & Measurements">
      <AppForm>
        <FormGroup>
          <ControlLabel>Distance Units</ControlLabel>
          {units.map(({ label, value }) => (
            <Radio
              checked={user.distanceUnits === value}
              key={value}
              name="distanceUnits"
              onChange={onChange}
              value={value}>
              {label}
            </Radio>
          ))}
        </FormGroup>
      </AppForm>
    </SettingsListGroup.Item>
  );
};

export default UnitsSettingsSection;
