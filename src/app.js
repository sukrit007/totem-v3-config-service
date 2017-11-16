/**
 * Entry point for orchestrator lambda function
 */
'use strict';

const
  logger = require('./common/logger'),
  Ajv = require('ajv'),
  setupAsync = require('ajv-async'),
  constants = require('./common/constants'),
  bottle = constants.BOTTLE_CONTAINER,
  glob = require('glob'),
  config = require('config'),
  GitHub = require('github-api'),
  _ = require('lodash'),
  AWS = require('aws-sdk'),
  path = require('path');

// Load all modules (to ensure all bottle services are loaded)
glob.sync('./src/**/*.js').forEach(file => {
  require(path.resolve(file));
});

function registerCommonServices() {
  bottle.value('githubApi', new GitHub({
    token: config.github.token
  }));
}

function registerSchemas() {
  let ajv = setupAsync(new Ajv({
    async: true
  }));
  glob.sync('./config/schemas/*.json').forEach(file => {
    let schemaName = path.basename(file, 'json');
    let schema = require(path.resolve(file));
    ajv.addSchema(schema, schemaName);
  });
  bottle.value('validator', ajv);
}

module.exports = {
  loadConfigTask: () => {

    //Setup common bottle services / values
    registerCommonServices();

    // Register validation schemas
    registerSchemas();

    // Return the handler
    return (event, context, callback) => {
      return bottle.container['tasks-load-config'].handle(event, context, callback);
    };
  }
};