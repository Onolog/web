import React from 'react';
import {FormControl, Nav, NavItem} from 'react-bootstrap';

import AppFullPage from '../../components/Page/AppFullPage.react';
import DistanceTable from '../../components/Vdot/DistanceTable.react';
import LeftRight from '../../components/LeftRight/LeftRight.react';
import PaceTable from '../../components/Vdot/PaceTable.react';
import PageFrame from '../../components/Page/PageFrame.react';
import PageHeader from '../../components/Page/PageHeader.react';

import './styles/Vdot.scss';

const TITLE = 'Daniels VDOT';

/**
 * VdotController.react
 *
 * Displays Daniels VDOT data.
 */
class DanielsController extends React.Component {
  state = {
    eventKey: 1,
    vdot: 0,
  };

  render() {
    const {eventKey, vdot} = this.state;

    return (
      <AppFullPage className="daniels" title={TITLE}>
        <PageHeader full title={TITLE}>
        </PageHeader>
        <PageFrame fill>
          <LeftRight className="daniels-controls">
            <Nav
              activeKey={eventKey}
              bsStyle="pills"
              className="daniels-nav"
              onSelect={this._handleSelect}>
              <NavItem eventKey={1}>
                Distance Table
              </NavItem>
              <NavItem eventKey={2}>
                Training Intensities
              </NavItem>
            </Nav>
            <FormControl
              className="daniels-filter"
              max={85}
              min={30}
              onChange={this._handleFilterChange}
              placeholder="Filter by VDOT"
              type="number"
            />
          </LeftRight>
          {eventKey === 1 ?
            <DistanceTable vdot={vdot} /> :
            <PaceTable vdot={vdot} />
          }
        </PageFrame>
      </AppFullPage>
    );
  }

  _handleFilterChange = (e) => {
    const {value} = e.target;
    this.setState({vdot: value >= 30 && value <= 85 ? +value : 0});
  }

  _handleSelect = (eventKey) => {
    this.setState({eventKey});
  }
}

module.exports = DanielsController;
