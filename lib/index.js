"use strict";

/**
 * whereami
 * WHERE AM I?
 *  is a service that helps when using getInitialProps to determine if you're on the client, server,
 *  client staging, server staging, production client, or production server.
 *
 * Fun right? You're welcome!
 *
 * Usage:
 *
 * import whereami from '@layerframers/whereami'
 *
 * MyComponent.getInitialProps = async function({ query }) {
 *   const host = whereami.now()
 *   console.log('whereami: host', host)
 *   const fUrl = `${host}/api/my-component.js`
 *   const results = await fetch(fUrl)
 *   const data = await results.json();

 *   // The component props.
 *   return {
 *     data
 *   }
 * };
 *
 * Fill in your server specifics below.
 */
var os = require('os');

var PORT = process.env.PORT || 3000; // Local development url

var localUrl = 'http://localhost'; // Protocol used on production

var protocol = 'https://';
var stagingUrl = process.env.STAGING_URL || process.env.STAGE_URL;
var productionUrl = process.env.LIVE_URL || process.env.PRODUCTION_URL;
var developUrl = process.env.DEVELOP_URL || process.env.DEVELOPMENT_URL;
var gcpCheck = process.env.WHEREAMI_GCP_CHECK || false;
var gcpStagingKey = process.env.WHEREAMI_GCP_STAGE_KEY || '-staging';
var gcpDevelopKey = process.env.WHEREAMI_GCP_DEV_KEY || '-develop';
var gcpProject = process.env.GOOGLE_CLOUD_PROJECT || null;
var isServer = typeof window === 'undefined'; // Checks
// Server

if (!stagingUrl && isServer) console.log('WARNING: whereami was unable to find a staging url on the SERVER. Set via STAGE_URL environment variable.');
if (!productionUrl && isServer) console.log('WARNING: whereami was unable to find a production url on the SERVER. Set via LIVE_URL environment variable.');
if (!developUrl && isServer) console.log('WARNING: whereami was unable to find a develop url on the SERVER. Set via DEVELOP_URL environment variable.'); // Client

if (!stagingUrl && !isServer) console.log('WARNING: whereami was unable to find a staging url on the CLIENT. Set via STAGE_URL environment variable.');
if (!productionUrl && !isServer) console.log('WARNING: whereami was unable to find a production url on the CLIENT. Set via LIVE_URL environment variable.');
if (!developUrl && !isServer) console.log('WARNING: whereami was unable to find a develop url on the CLIENT. Set via DEVELOP_URL environment variable.');
/**
 * getHostname
 */

var getHostname = function getHostname() {
  // Client
  if (process.browser && !isServer) {
    return window.location.hostname;
  } // Server


  return os.hostname();
};
/**
 * onStaging
 */


var onStaging = function onStaging() {
  // Client
  if (process.browser && !isServer) {
    return window.location.hostname.indexOf(stagingUrl) > -1;
  }

  if (gcpCheck) {
    console.log('Checking GCP for the staging key.');

    if (!gcpStagingKey) {
      console.log('WARNING: You need to provide a WHEREAMI_GCP_STAGE_KEY environment variable.');
      return false;
    }

    var gcpKeyFound = gcpProject.indexOf(gcpStagingKey) > -1;

    if (gcpStagingKeyFound) {
      console.log('Found the GCP staging key', gcpStagingKey);
    } // Check the name of the GCP project by the key provided


    return gcpKeyFound;
  } // Server hostname check


  return os.hostname().indexOf(stagingUrl) > -1;
};
/**
 * isLocal
 */


var isLocal = process.env.NODE_ENV === 'development';
/**
 * onDev
 */

var onDev = function onDev() {
  // Client
  if (process.browser && !isServer) {
    return window.location.hostname.indexOf(stagingUrl) > -1;
  }

  if (gcpCheck) {
    console.log('Checking GCP for the development key.');

    if (!gcpDevelopKey) {
      console.log('WARNING: You need to provide a WHEREAMI_GCP_DEVELOP_KEY environment variable.');
      return false;
    }

    var gcpKeyFound = gcpProject.indexOf(gcpDevelopKey) > -1;

    if (gcpKeyFound) {
      console.log('Found the GCP develop key', gcpDevelopKey);
    } // Check the name of the GCP project by the key provided


    return gcpKeyFound;
  } // Server hostname check


  return os.hostname().indexOf(developUrl) > -1;
};

module.exports = {
  log: function log() {
    if (typeof console !== 'undefined') {
      console.log('\n');
      console.log('-- WHEREAMI ENVIRONMENT VARIABLES --');
      console.log('Staging url:', stagingUrl);
      console.log('Production url:', productionUrl);
      console.log('Hostname:', getHostname());
      console.log('\n--\n');
      console.log('in Staging environment:', onStaging());
      console.log('in Development environment:', isDev);
      console.log('on Server:', isServer);
      console.log('on Client:', !isServer);
      console.log('--');
      console.log('\n');
    }
  },
  isClient: process.browser && typeof window !== 'undefined',
  isServer: typeof window === 'undefined',
  isStaging: onStaging(),
  // Production Staging
  isLocal: isLocal,
  // Local
  isDev: onDev(),
  // Development
  isProduction: !onStaging() && !onDev(),
  // Production
  host: getHostname(),

  /**
   * Initialize the module with settings
   * If no settings are passed, settings are fetched from env vars.
   * @param {string} staging Your staging url
   * @param {string} production Your production url
   * @return {void}
   */
  init: function init(staging, production) {
    var fStaging = staging || process.env.STAGING_URL || process.env.STAGE_URL;
    var fProduction = production || process.env.LIVE_URL || process.env.PRODUCTION_URL;
    if (!fStaging) throw Error('You must provide a staging url.');
    if (!fProduction) throw Error('You must provide a production url.');
    stagingUrl = fStaging;
    productionUrl = fProduction;
    return {
      staging: stagingUrl,
      production: productionUrl
    };
  },
  now: function now() {
    var host = "".concat(localUrl, ":").concat(PORT);

    if (process.browser && !isServer) {
      // Client stuff
      if (process.env.NODE_ENV === 'production') {
        var isStaging = false;
        console.log('whereami client checking the window.location.hostname and found', window.location.hostname);
        isStaging = onStaging();
        console.log('whereami client on staging?', isStaging); // Update the host

        host = isStaging ? "".concat(protocol).concat(stagingUrl) : "".concat(protocol).concat(productionUrl);
      }

      return host;
    } // Server stuff


    if (gcpProject) {
      if (!gcpCheck) {
        console.log('Consider using the Google Cloud Platform staging check via WHEREAMI_GCP_CHECK environement variable.');
      } else {
        console.log('Google Cloud Project checking is enabled.');
        console.log('GOOGLE_CLOUD_PROJECT:', gcpProject);
      }
    } // This should be updated via the process.env.PORT


    return host;
  }
};
