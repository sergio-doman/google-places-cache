"use strict";

const joi = require('joi');

module.exports = {
  geocode: {
    state: joi.string().trim().min(1, 'utf8').required(),
    country_code: joi.string().trim().min(1, 'utf8').required()
  },

  get: {
    query: joi.string().trim().min(1, 'utf8').required(),
    lang: joi.string().trim().length(3, 'utf8').required(),               // ISO 639-3
    latlon: joi.array().items(joi.number()).length(2).required()          // gps: lat, lon
  },

  add: {
    query: joi.string().trim().min(1, 'utf8').required(),
    lang: joi.string().trim().length(3, 'utf8').required(),               // ISO 639-3
    latlon: joi.array().items(joi.number()).length(2).required(),         // gps: lat, lon
    predictions: joi.array().required()                                   // google places predictions // joi.object()
  }
};
