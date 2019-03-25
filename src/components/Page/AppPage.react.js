import React from 'react';

import AppContent from './AppContent.react';
import AppFooter from './AppFooter.react';
import AppHeader from './AppHeader.react';
import BaseAppPage from './BaseAppPage.react';

import './css/AppPage.css';

/**
 * AppPage.react
 */
const AppPage = ({ children, narrow, ...props }) => (
  <BaseAppPage {...props}>
    <AppHeader />
    <AppContent narrow={narrow}>
      {children}
    </AppContent>
    <AppFooter />
  </BaseAppPage>
);

export default AppPage;
