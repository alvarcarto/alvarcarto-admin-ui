const _ = require('lodash')
const { getRequiredEnv, getOptionalEnv, string, number, boolean } = require('./env')
require('dotenv').config()

const config = {
  // Required
  ALVAR_CARTO_ORDER_API_BASE_URL: getRequiredEnv('ALVAR_CARTO_ORDER_API_BASE_URL', string),
  ALVAR_CARTO_ORDER_API_SECRET: getRequiredEnv('ALVAR_CARTO_ORDER_API_SECRET', string),

  // Optional
  PORT: getOptionalEnv('PORT', number, 4002),
  ALLOW_HTTP: getOptionalEnv('ALLOW_HTTP', boolean, false),
};

if (_.endsWith(config.ALVAR_CARTO_ORDER_API_BASE_URL, '/')) {
  throw new Error(`ALVAR_CARTO_ORDER_API_BASE_URL must not have trailing slash`)
}

module.exports = config;
