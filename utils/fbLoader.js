import fetch from 'isomorphic-fetch';
import {APP_ID, VERSION} from '../constants/Facebook';

/**
 * JS for initializing Facebook API
 */
function fbLoader(/*function*/ callback) {
  if (window.FB) {
    callback();
    return;
  }

  fetch('//connect.facebook.net/en_US/all.js', {
    cache: true,
    dataType: 'script',
    // mode: 'no-cors',
  }).then((foo, bar) => {
    FB.init({
      appId: APP_ID,
      oauth: true,
      status: true,
      cookie: true,
      version: VERSION,
    });

    window.FB = FB;
    callback();
  }).catch((error) => {
    console.error(error);
  });
}

module.exports = fbLoader;
