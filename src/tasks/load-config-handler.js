/**
 * Task for initializing git branch/tag
 */
'use strict';

const
  constants = require('../common/constants'),
  logger = require('../common/logger'),
  bottle = constants.BOTTLE_CONTAINER;

class LoadConfigTask {

  constructor() {}

  handle(event, context, callback) {
    logger.info(`LoadConfigTask: Begin: `, event, context);
    return callback(null, {
      event: 'initialized-branch'
    });
  }
}

bottle.service('tasks-load-config', LoadConfigTask);

module.exports = LoadConfigTask;