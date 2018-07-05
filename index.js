"use strict";

const joi = require('joi');
const _ = require('lodash');
const async = require('async');
const restify = require('restify');

const config = require('./config');
const engine = require('./engine');
const validators = require('./validators');


const server = restify.createServer(config.server);
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.on('uncaughtException', (req, res, route, err) => {
  console.error(err);
  return res.json(500, { message: 'Internal server error' });
});

server.on('NotFound', (req, res, err, next) => {
  console.log('404: ', req.url);
  res.send(404, '404 - Not found');
  return next();
});

// Health check
server.get('/places/ok', (req, res, next) => {
  console.log('GET places/ok');

  async.series([
    (cb) => engine.ok(cb)
  ], (err) => {
    let responseData = { success: true };
    let responseStatusCode = 200;

    if (err) {
      responseStatusCode = 503;
      responseData = { success: false, message: err };
    }

    res.json(responseStatusCode, responseData);
    return next();
  });
});

// Stats
server.get('/places/stats', (req, res, next) => {
  console.log('GET places/stats');

  async.series([
    (cb) => engine.stats(cb)
  ], (err, stats) => {
    let responseData = { success: true, stats };
    let responseStatusCode = 200;

    if (err) {
      responseStatusCode = 503;
      responseData = { success: false, message: err };
    }

    res.json(responseStatusCode, responseData);
    return next();
  });
});

// Get places
server.get('/places', (req, res, next) => {
  console.log('GET places');
  console.log(req.query);

  async.waterfall([
    (cb) => {
      joi.validate(req.query, validators.get, (joierr, payload) => {
        if (joierr) {
          const wrongParam = engine.getJoiErrorParamName(joierr);
          return cb({ code: 400, message: 'Invalid param' + (wrongParam ? ' - ' + wrongParam : '') });
        }

        cb(null, payload);
      });
    },

    (payload, cb) => {
      engine.get(payload, (err, result) => {
        if (err) {
          return cb({ code: 500, message: err });
        }

        cb(null, result);
      });
    }

  ], (err, places) => {
    let responseStatusCode = 404;
    let responseData = { success: false, message: 'Not found' };

    if (err) {
      responseStatusCode = err.code;
      responseData = { success: false, message: err.message };
    }

    if (places) {
      responseStatusCode = 200;
      responseData = { success: true, places };
    }

    res.json(responseStatusCode, responseData);
    return next();
  });
});

// Add places
server.post('/places', (req, res, next) => {
  console.log('POST places');
  const dump = _.cloneDeep(req.body);
  if (_.has(dump, 'predictions')) {
    _.unset(dump, 'predictions');
  }
  console.log(dump);

  async.waterfall([
    (cb) => {
      joi.validate(req.body, validators.add, (joierr, payload) => {
        if (joierr) {
          const wrongParam = engine.getJoiErrorParamName(joierr);
          return cb({ code: 400, message: 'Invalid param' + (wrongParam ? ' - ' + wrongParam : '') });
        }

        cb(null, payload);
      });
    },

    (payload, cb) => {
      engine.add(payload, (err) => {
        if (err) {
          return cb({ code: 500, message: err });
        }

        cb();
      });
    }

  ], (err) => {
    let responseStatusCode = 200;
    let responseData = { success: true };

    if (err) {
      responseStatusCode = err.code;
      responseData = { success: false, message: err.message };
    }

    res.json(responseStatusCode, responseData);
    return next();
  });
});

// Graceful Shutdown
process.on('SIGINT', () => {
  console.log('Exit signal');

  async.series([
    (cb) => {
      engine.close(cb);
    },

    (cb) => {
      if (server) {
        server.close(cb);
      } else {
        cb();
      }
    }

  ], (err) => {
    console.log('App closed ', err ? err : '');
  });
});


// Start
console.log('Starting app..');
async.series([
  (cb) => engine.init(cb),

  (cb) => server.listen(config.port, config.host, cb)

], (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log('%s listening at %s', server.name, server.url);
  }
});
