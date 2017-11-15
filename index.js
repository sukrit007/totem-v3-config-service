/**
 * Entry point for config service lambda function
 */
'use strict';

const
  app = require('./src/app');


module.exports = {
  loadConfigTask: app.loadConfigTask()
};