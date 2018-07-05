"use strict";

const pack = require('./package.json');

module.exports = {
  port: 'PORT' in process.env ? (Number(process.env.PORT) + ('NODE_APP_INSTANCE' in process.env ? Number(process.env.NODE_APP_INSTANCE) : 0)) : 8080,
  host: process.env.HOST || '127.0.0.1',

  server: {
    name: process.env.SERVER_NAME || pack.name,
    version: process.env.SERVER_VERSION || pack.version
  },

  redisKeyBeginning: process.env.REDIS_KEY_BEGINNING || 'places_item',
  redisCache: {
    host: process.env.REDIS_CACHE_HOST || '127.0.0.1',
    port: process.env.REDIS_CACHE_PORT || 6379,
    db: process.env.REDIS_CACHE_DB || 1
  },

  nominatimUrl: process.env.NOMINATIM_URL || 'https://nominatim.openstreetmap.org/',  // Please use your own, this one is just for demo

  placesExpireSec: process.env.PLACES_EXPIRE_SEC || (process.env.NODE_ENV === 'production' ? (3600 * 24 * 30 * 3) : 60),

  cronRun: true, // !! process.env.CRON_RUN,
  cronUpdateIntervalSec: process.env.CRON_UPDATE_INTERVAL_SEC || 60,

  metricNames: ['places_get_found', 'places_get_notfound', 'places_get_found_percent', 'places_add', 'places_dbsize'],
};
