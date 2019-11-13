# Where Am I?
> Tools that help with fetching location based info when building production SSR apps, e.g. NextJS. Client vs. Server, Staging vs. Production, etc.

# Getting started 

1. `yarn add whereami`
1. Set a staging url by creating an env var named `STAGING_URL` or `STAGE_URL`
1. Set a production url by creating an env var named `PRODUCTION_URL` or `LIVE_URL`
1. In your script use the following
```
import whereami from whereami

...
// This is checks to see if you're on, staging, production or local and on the client or server side.
const host = whereami.now()
```

# Usage

- `whereami.now()`: Returns the hostname
- `whereami.isStaging`: Tells you if you're on your staging server or not
