import chunkManifest from '../../public/build/chunk-manifest.json';
import webpackManifest from '../../public/build/webpack-manifest.json';

/* eslint-disable max-len */
export default (children, data) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
        <title>Onolog</title>
        <link rel="stylesheet" type="text/css" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous" />
        <link rel="stylesheet" type="text/css" href="//cdn.materialdesignicons.com/1.8.36/css/materialdesignicons.min.css" crossorigin="anonymous" />
        <link rel="stylesheet" type="text/css" href="/css/base/base.css" />
        <link rel="stylesheet" type="text/css" href="/css/base/bs-override.css" />
        <link rel="stylesheet" type="text/css" href="/css/base/fonts.css" />
        <link rel="stylesheet" type="text/css" href="/css/base/util.css" />
        <link rel="stylesheet" type="text/css" href="${webpackManifest['app.css']}" />
      </head>
      <body>
        <div id="root">${children}</div>
        <script>window.chunkManifest = ${JSON.stringify(chunkManifest)};</script>
        <script>window.APP_DATA = ${JSON.stringify(data)};</script>
        <script src="${webpackManifest['vendor.js']}"></script>
        <script src="${webpackManifest['app.js']}"></script>
        <script type="text/javascript">
          var _gaq = _gaq || [];
          _gaq.push(["_setAccount", "${process.env.GOOGLE_ANALYTICS_CODE}"]);
          _gaq.push(["_trackPageview"]);
          (function() {
            var ga = document.createElement("script"); ga.type = "text/javascript"; ga.async = true;
            ga.src = ("https:" == document.location.protocol ? "https://ssl" : "http://www") + ".google-analytics.com/ga.js";
            var s = document.getElementsByTagName("script")[0]; s.parentNode.insertBefore(ga, s);
          })();
        </script>
      </body>
    </html>
  `;
};
/* eslint-enable max-len */
