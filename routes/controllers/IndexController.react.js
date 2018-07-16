import React from 'react';

import BaseAppPage from '../../components/Page/BaseAppPage.react';
import FBLoginButton from '../../components/Facebook/FBLoginButton.react';

import './css/Login.scss';

/**
 * Controller class for the logged-out homepage, ie: https://www.onolog.com/
 */
class IndexController extends React.Component {
  state = {
    windowHeight: null,
  };

  componentDidMount() {
    this._handleResize();
    window && window.addEventListener('resize', this._handleResize);
  }

  componentWillUnmount() {
    window && window.removeEventListener('resize', this._handleResize);
  }

  render() {
    return (
      <BaseAppPage className="login" title="Welcome">
        <div
          className="jumbotronContainer"
          style={{height: this.state.windowHeight + 'px'}}>
          <div className="jumbotron">
            <h1>Onolog</h1>
            <p className="lead">
              Running is better with friends.
            </p>
            <p><FBLoginButton /></p>
          </div>
          <div className="bgImage"></div>
        </div>
      </BaseAppPage>
    );
  }

  _renderMarketingSection = (title) => {
    return (
      <div className="marketingSection">
        <div className="container">
          <h2>{title}</h2>
        </div>
      </div>
    );
  }

  _handleResize = () => {
    const windowHeight = Math.max(
      document.documentElement.clientHeight,
      window.innerHeight || 0
    );
    this.setState({windowHeight});
  }
}

module.exports = IndexController;
