import React from 'react';
import { ControlLabel, FormControl, FormGroup, HelpBlock } from 'react-bootstrap';

import AppForm from '../Forms/AppForm.react';
import SettingsListGroup from './SettingsListGroup.react';

const FIELDS = [
  {
    label: 'First Name',
    name: 'firstName',
    placeholder: 'Enter your first name...',
  },
  {
    label: 'Last Name',
    name: 'lastName',
    placeholder: 'Enter your last name...',
  },
  {
    label: 'Email Address',
    name: 'email',
    placeholder: 'Enter your last email address...',
  },
];

const ProfileSettingsSection = ({ errors = {}, onChange, user }) => (
  <SettingsListGroup.Item
    description="Name, email, and avatar settings."
    title="Profile">
    <AppForm>
      {FIELDS.map(({ label, name, placeholder }) => {
        const error = errors[name];
        return (
          <FormGroup key={name} validationState={error ? 'error' : null}>
            <ControlLabel>{label}</ControlLabel>
            <FormControl
              name={name}
              onChange={onChange}
              placeholder={placeholder}
              type="text"
              value={user[name] || ''}
            />
            {error && <HelpBlock>{error}</HelpBlock>}
          </FormGroup>
        );
      })}
    </AppForm>
  </SettingsListGroup.Item>
);

export default ProfileSettingsSection;
