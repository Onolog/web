/* eslint-disable max-len */

import { ChunkExtractor } from '@loadable/server';
import path from 'path';
import { renderToString } from 'react-dom/server';

import webpackConfig from '../../../webpack.config';

const fbInit = `
  window.fbAsyncInit = function() {
    FB.init({
      appId: ${process.env.FB_APP_ID},
      autoLogAppEvents: true,
      oauth: true,
      status: true,
      cookie: true,
      xfbml: true,
      version: 'v3.0'
    });
  };
  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "https://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
`;

const gaInit = `
  var _gaq = _gaq || [];
  _gaq.push(["_setAccount", "${process.env.GOOGLE_ANALYTICS_CODE}"]);
  _gaq.push(["_trackPageview"]);
  (function() {
    var ga = document.createElement("script");
    ga.type = "text/javascript";
    ga.async = true;
    ga.src = ("https:" == document.location.protocol ? "https://ssl" : "http://www") + ".google-analytics.com/ga.js";
    var s = document.getElementsByTagName("script")[0]; s.parentNode.insertBefore(ga, s);
  })();
`;

export default (jsx, data) => {
  // Configure chunks with Loadable Components:
  const extractor = new ChunkExtractor({
    // Entry points defined in webpack config.
    entrypoints: Object.keys(webpackConfig.entry),
    // Path to stats file.
    statsFile: path.resolve(__dirname, '../../../public/build/loadable-stats.json'),
  });

  const htmlString = renderToString(extractor.collectChunks(jsx));

  return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
        <title>Onolog</title>
        <link rel="stylesheet" type="text/css" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous" />
        <link rel="stylesheet" type="text/css" href="//cdn.materialdesignicons.com/1.8.36/css/materialdesignicons.min.css" crossorigin="anonymous" />
        <link rel="stylesheet" type="text/css" href="/css/base.css" />
        <link rel="stylesheet" type="text/css" href="/css/fonts.css" />
        ${extractor.getStyleTags()}
      </head>
      <body>
        <script>${fbInit}</script>
        <div id="root">${htmlString}</div>
        ${extractor.getScriptTags()}
        <script>window.APP_DATA = ${JSON.stringify(data)};</script>
        <script>${gaInit}</script>
      </body>
    </html>
  `;
};
