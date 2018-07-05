"use strict";

const joi = require('joi');
const _ = require('lodash');
const async = require('async');
const redis = require('redis');
const request = require('request');

const config = require('./config');
const validators = require('./validators');

let cronTimerId;
let redisClient;


// Convert text to base64
function _encode(text) {
  return Buffer.from(String(text).trim()).toString('base64');
}

// Make http request to nominatim
function _nominatimHttp(opt, callback) {
  // Next line just for default nominatim API url

  if (config.nominatimUrl === 'https://nominatim.openstreetmap.org/') {
    opt.headers = {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'
    };
  }

  request(opt, callback);
}

// Get reverse geocode by gps locaion
function _getGeocode(latlon, callback) {
  const opt = {
    url: config.nominatimUrl + 'reverse?&format=json&lat=' + latlon[0] + '&lon=' + latlon[1] + '&addressdetails=1&accept-language=en',
    method: 'GET'
  };

  _nominatimHttp(opt, (err, res, body) => {
    if (err) {
      return callback(err);
    }

    if (!body || res.statusCode !== 200) {
      return callback('Failed to get response from nominatim');
    }

    let json;

    try {
      json = JSON.parse(body);
    } catch (e)  {
      return callback('Failed to parse response from nominatim');
    }

    joi.validate(_.get(json, 'address'), validators.geocode, { allowUnknown: true }, (jerr, geocode) => {
      if (jerr) {
        console.log('jerr: ', jerr);
        return callback('Invalid response from nominatim');
      }

      callback(null, geocode);
    });
  });
}

// Make redis key from geocode and query
function _getRedisKey(geocode, query, callback) {
  callback(null, config.redisKeyBeginning + '_' + geocode.country_code + '_' + _encode(geocode.state) + '_' + _encode(query));
}


// Agregate stats
function cronIteration() {
  const metrics = {};
  const multi = redisClient.multi();

  _.forEach(config.metricNames, (metricName) => {
    metrics[metricName] = 0;

    multi.GETSET(metricName, 0, (err, total) => {
      metrics[metricName] = Number(total);
      redisClient.set(metricName + '_total', Number(total));
    });
  });

  multi.exec(() => {
    const totalRequests = metrics.places_get_found + metrics.places_get_notfound;
    metrics.places_get_found_percent = totalRequests > 0 ? Number(parseFloat((metrics.places_get_found * 100) / totalRequests)).toFixed(2) : 0;
    redisClient.set('places_get_found_percent_total', metrics.places_get_found_percent);

    redisClient.dbsize([], (err, totalSize) => {
      metrics.places_dbsize = Number(totalSize);
      redisClient.set('places_dbsize_total', metrics.places_dbsize);
    });
  });
}

function init(callback) {
  redisClient = redis.createClient(config.redisCache);

  redisClient.on('error', (err) => {
    console.error('Redis error: ', err);
  });

  // Run cron updates if needed
  if (config.cronRun && _.get(process.env, 'NODE_APP_INSTANCE', 0) === 0) {
    setTimeout(() => {
      cronIteration();
      cronTimerId = setInterval(cronIteration, config.cronUpdateIntervalSec * 1000);
    }, 1000);
  }

  callback();
}

function add(payload, callback) {
  payload.dateCreated = new Date();

  async.waterfall([
    // Get geocode
    (cb) => _getGeocode(payload.latlon, cb),

    // Get redis key
    (geocode, cb) => _getRedisKey(geocode, payload.query, cb),

    // Save to redis
    (redisKey, cb) => redisClient.set(redisKey, JSON.stringify(payload), 'EX', config.placesExpireSec, cb),

    (cb) => statsEventAdd('places_add', cb)

  ], callback);
}

function get(payload, callback) {
  async.waterfall([
    // Get geocode
    (cb) => _getGeocode(payload.latlon, cb),

    // Get redis key
    (geocode, cb) => _getRedisKey(geocode, payload.query, cb),

    // Get from redis
    (redisKey, cb) => redisClient.get(redisKey, cb),

    // Check result from redis
    (redisRes, cb) => {
      if (!redisRes) {
        statsEventAdd('places_get_notfound');
        return cb();
      }

      let json;
      try {
        json = JSON.parse(redisRes);
      }
      catch (e) {
        return cb('Failed to parse value from cache');
      }

      if (!json) {
        return cb('Failed to parse value from cache');
      }

      statsEventAdd('places_get_found');
      cb(null, json);
    }

  ], callback);
}

function close(callback) {
  if (redisClient) {
    redisClient.quit();
  }

  if (cronTimerId) {
    clearInterval(cronTimerId);
  }

  callback();
}

// Increment event counter
function statsEventAdd(name, callback) {
  console.log('statsEventAdd !!!');

  redisClient.incr(name);

  if (typeof callback === 'function') {
    callback();
  }
}

// Find invalid field name
function getJoiErrorParamName(joierr) {
  const wrongParamPath = _.get(joierr, 'details[0].path', []);
  return (Array.isArray(wrongParamPath) ? wrongParamPath.join(' ') : '');
}

// Health check
function ok(callback) {
  async.series([
    // Check connection to redis
    (cb) => redisClient.info(cb),

    // Check connection to nominatim
    (cb) => {
      _nominatimHttp({ url: config.nominatimUrl, method: 'HEAD' }, (err, res) => {
        if (err) {
          return cb(err);
        }

        if (res.statusCode !== 200) {
          return cb('Wrong response from nominatim');
        }
        cb();
      });
    }

  ], callback);
}

// Get stats from redis
function stats(callback) {
  const stats = {};
  const multi = redisClient.multi();

  _.forEach(config.metricNames, (metricName) => {
    stats[metricName + '_total'] = 0;

    multi.get(metricName + '_total', (err, total) => {
      if (!err) {
        stats[metricName + '_total'] = Number(total);
      }
    });
  });

  multi.exec((err) => {
    callback(err, stats);
  });
}


module.exports = {
  init,
  close,
  ok,
  get,
  add,
  stats,
  statsEventAdd,
  getJoiErrorParamName
};
