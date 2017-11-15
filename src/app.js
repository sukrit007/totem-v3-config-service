/**
 * Entry point for orchestrator lambda function
 */
'use strict';

const
  logger = require('./common/logger'),
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
  bottle.value('stepFunctions', new AWS.StepFunctions(_.merge({}, config.aws)));
}

module.exports = {
  loadConfigTask: () => {

    //Setup common bottle services / values
    registerCommonServices();

    // Return the handler
    return (event, context, callback) => {
      return bottle.container['tasks-load-config'].handle(event, context, callback);
    };
  }
};