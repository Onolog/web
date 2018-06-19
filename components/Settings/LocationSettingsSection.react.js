import React from 'react';
import {ControlLabel, FormGroup} from 'react-bootstrap';

import AppForm from '../Forms/AppForm.react';
import SettingsListGroup from './SettingsListGroup.react';
import TimezoneSelector from '../Forms/TimezoneSelector.react';

const LocationSettingsSection = ({onChange, user}) => (
  <SettingsListGroup.Item
    description="Default location and timezone settings."
    title="Location">
    <AppForm>
      <FormGroup>
        <ControlLabel>Timezone</ControlLabel>
        <TimezoneSelector
          className="form-control"
          name="timezone"
          onChange={onChange}
          timezone={user.timezone}
        />
      </FormGroup>
    </AppForm>
  </SettingsListGroup.Item>
);

export default LocationSettingsSection;
