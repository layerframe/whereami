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
 * import whereami from '../services/whereami'
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
import os from 'os'

const PORT = process.env.PORT || 3000
// Local development url
const localURL = 'http://localhost'
// Protocol used on production
const protocol = 'https://'
let stagingUrl = process.env.STAGING_URL || process.env.STAGE_URL
let productionUrl = process.env.LIVE_URL || process.env.PRODUCTION_URL

const isServer = typeof window === "undefined"

const getHostname = () => {
  // Client
  if (process.browser && !isServer) {
    return window.location.hostname
  }
  // Server
  return os.hostname()
}

const onStaging = () => {
  // Client
  if (process.browser && !isServer) {
    return window.location.hostname.indexOf(stagingUrl) > -1
  }
  // Server
  return os.hostname().indexOf(stagingUrl) > -1
}

export default {
  isClient: process.browser && typeof window !== "undefined",
  isServer: typeof window === "undefined",
  isStaging: onStaging(), // Production Staging
  isLocal: process.env.NODE_ENV === 'development', // Development
  isProduction: !onStaging(), // Production
  host: getHostname(),
  /**
   * Initialize the module with settings
   * If no settings are passed, settings are fetched from env vars.
   * @param {string} staging Your staging url 
   * @param {string} production Your production url 
   * @return {void}
   */
  init: (staging, production) => {
      let fStaging = staging || process.env.STAGING_URL || process.env.STAGE_URL
      let fProduction = production || process.env.LIVE_URL || process.env.PRODUCTION_URL
      if (!fStaging) throw Error('You must provide a staging url.')
      if (!fProduction) throw Error('You must provide a production url.')
    stagingUrl = fStaging
    productionUrl = fProduction
    return {
        staging: stagingUrl,
        production: productionUrl,
    }
  },
  now: () => {
    let host = `${localURL}:${PORT}`
    if (process.browser && !isServer) {
      // Client stuff
      if (process.env.NODE_ENV === 'production') {
        let isStaging = false
        console.log('whereami client checking the window.location.hostname and found', window.location.hostname)
        isStaging = onStaging()
        console.log('whereami client on staging?', isStaging)
        // Update the host
        host = isStaging ? `${protocol}${productionUrl}` : `${protocol}${productionURL}`
      }

      return host
    }

    // Server stuff
    if (process.env.GOOGLE_CLOUD_PROJECT) {
      console.log('How are you liking Google Cloud Platform?')
    }

    // This should be updated via the process.env.PORT
    return host
  }
}
