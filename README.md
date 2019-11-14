# Where Am I?
> Tools that help with fetching location based info when building production SSR apps, e.g. NextJS. Client vs. Server, Staging vs. Production, etc.

# Getting started 

1. `yarn add @layerframers/whereami`
1. Set a staging url by creating an env var named `STAGING_URL` or `STAGE_URL`
1. Set a production url by creating an env var named `PRODUCTION_URL` or `LIVE_URL`
1. In your script use the following
```
import whereami from '@layerframers/whereami'
...
// This is checks to see if you're on, staging, production or local and on the client or server side.
const host = whereami.now()
```

# Google App Engine Features
This node modules plays well with Google App Engine. To check for a staging environment running on Google App Engine, just set the following environment variables in you `app.yaml`. 

By setting `WHEREAMI_GCP_CHECK` to true, you turn on GCP checking. You then need to set the staging key. This is basically an indicator or difference in the name e.g. `-staging`. This value is checked against the global env var on Google App Engine named `GOOGLE_CLOUD_PROJECT` via the `indexOf` method of Javascript.

```
WHEREAMI_GCP_CHECK: {bool} true/false (Defaults to false)
WHEREAMI_GCP_STAGE_KEY {string} '-staging' (Defaults to null)
```

# Usage

- `whereami.now()`: Returns the hostname
- `whereami.isStaging`: Tells you if you're on your staging server or not
