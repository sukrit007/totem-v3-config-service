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

    let schema = `load-config-request-${event.version}`;
    return Promise.resolve()
      .then(() => {
        if(event.version !== 'v1') {
          throw new error.UnsupportedInputVersion(event.version, 'LoadConfigTask');
        }
        return this.validator.validate(schema, event);
      })
      .then(() => {
        return callback(null, {
          location: 'TODO: Add config location'
        });
      })
      .catch(err => {
        if(err instanceof Ajv.ValidationError) {
          throw new error.ValidationError(schema, err.errors);
        }
        throw err;
      })
      .catch(callback);
  }
}

bottle.service('tasks-load-config', LoadConfigTask, 'validator');

module.exports = LoadConfigTask;