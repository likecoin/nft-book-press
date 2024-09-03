import * as Sentry from '@sentry/nuxt'

Sentry.init({
  dsn: 'https://1d871749c61de13371f3acd1681073b4@o149940.ingest.us.sentry.io/4507887589523456',

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0
})
