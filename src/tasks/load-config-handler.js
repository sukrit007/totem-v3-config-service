/**
 * Task for initializing git branch/tag
 */
'use strict';

const
  constants = require('../common/constants'),
  error = require('../services/error'),
  logger = require('../common/logger'),
  Ajv = require('ajv'),
  bottle = constants.BOTTLE_CONTAINER;

class LoadConfigTask {

  constructor(validator) {
    this.validator = validator;
  }

  handle(event, context, callback) {
    logger.info(`LoadConfigTask: Begin: `, event, context);
    event.version = event.version || 'v1';
    if(event.version !== 'v1') {
      throw new error.ValidationError(`Unsupported version: ${event.version} for LoadConfigTask`);
    }
    return this.validator.validate(`load-config-request-${event.version}`, event)
      .then(() => {
        return callback(null, {
          event: 'initialized-branch'
        });
      })
      .catch(err => {
        if(err instanceof Ajv.ValidationError) {
          throw new error.ValidationError(`Validation failed for schema: load-config-request-${event.version}`,
            err.errors);
        }
        throw err;
      }).catch(callback);
  }
}

bottle.service('tasks-load-config', LoadConfigTask, 'validator');

module.exports = LoadConfigTask;