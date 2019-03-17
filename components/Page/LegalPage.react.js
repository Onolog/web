import React from 'react';

import AppFooter from './AppFooter.react';
import AppFullPage from './AppFullPage.react';
import PageFrame from './PageFrame.react';
import PageHeader from './PageHeader.react';

import './css/LegalPage.css';

const LegalPage = ({ children, title }) => (
  <AppFullPage title={title}>
    <PageHeader full title={title} />
    <PageFrame fill scroll>
      <div className="legal-page">
        <div className="legal-page-content">
          {children}
        </div>
      </div>
      <AppFooter />
    </PageFrame>
  </AppFullPage>
);

export default LegalPage;
