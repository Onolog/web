import React from 'react';
import {ControlLabel, FormControl, FormGroup} from 'react-bootstrap';

import AppForm from '../Forms/AppForm.react';
import SettingsListGroup from './SettingsListGroup.react';

const ProfileSettingsSection = ({onChange, user}) => (
  <SettingsListGroup.Item
    description="Name, email, and avatar settings."
    title="Profile">
    <AppForm>
      <FormGroup>
        <ControlLabel>First Name</ControlLabel>
        <FormControl
          name="firstName"
          onChange={onChange}
          placeholder="Enter your first name"
          type="text"
          value={user.firstName}
        />
      </FormGroup>
      <FormGroup>
        <ControlLabel>Last Name</ControlLabel>
        <FormControl
          name="lastName"
          onChange={onChange}
          placeholder="Enter your last name"
          type="text"
          value={user.lastName}
        />
      </FormGroup>
      <FormGroup>
        <ControlLabel>Email Address</ControlLabel>
        <FormControl
          name="email"
          onChange={onChange}
          placeholder="Enter your email address"
          type="text"
          value={user.email}
        />
      </FormGroup>
    </AppForm>
  </SettingsListGroup.Item>
);

export default ProfileSettingsSection;
