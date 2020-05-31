# Where Am I?
> Tools that help with fetching location based info when building production SSR apps, e.g. NextJS. Client vs. Server, Staging vs. Production, etc.

# Getting started

1. `yarn add @layerframers/whereami`
1. Set a staging url by creating an env var named `STAGING_URL` or `STAGE_URL`
1. Set a production url by creating an env var named `PRODUCTION_URL` or `LIVE_URL`
1. Set a development url by creating an env var named `DEVELOP_URL` or `DEVELOPMENT_URL`
1. In your script use the following
```
import whereami from '@layerframers/whereami'
...
// This is checks to see if you're on, staging, production or local and on the client or server side.
const host = whereami.now()
```

# Google App Engine Features
This node modules plays well with Google App Engine. To check for a staging environment running on Google App Engine, just set the following environment variables in you `app.yaml`.

By setting `WHEREAMI_GCP_CHECK` to true, you turn on GCP checking. You then need to set the staging key. This is basically an indicator or difference in the name e.g. `-staging`. This value is checked against the [Google Cloud environment variable](https://cloud.google.com/functions/docs/env-var) named `GOOGLE_CLOUD_PROJECT` via the [`indexOf`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf) method of Javascript.

```
WHEREAMI_GCP_CHECK: {bool} true/false (Defaults to false)
WHEREAMI_GCP_STAGE_KEY {string} '-staging' (Defaults to -staging)
WHEREAMI_GCP_DEVELOP_KEY {string} '-develop' (Defaults to -develop)
```

# Usage

- `whereami.now()`: Returns the hostname
- `whereami.log()`: Prints out helpful log info
- `whereami.isStaging`: Tells you if you're on your staging server or not
- `whereami.isProduction`: Tells you if you're on your production server or not
- `whereami.isDev`: Tells you if you're on your development server or not
- `whereami.isLocal`: Tells you if you're on your local server or not
- `whereami.isServer`: Tells you if you're on the server or not
- `whereami.isClient`: Tells you if you're on the client/browser or not
