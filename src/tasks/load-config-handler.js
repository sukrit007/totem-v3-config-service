/**
 * Task for initializing git branch/tag
 */
'use strict';

const
  constants = require('../common/constants'),
  error = require('../services/error'),
  logger = require('../common/logger'),
  Ajv = require('ajv'),
  _ = require('lodash'),
  //uuidv4 = require('uuid/v4'),
  bottle = constants.BOTTLE_CONTAINER;

class LoadConfigTask {

  constructor(validator, configService) {
    this.validator = validator;
    this.configService = configService;
  }

  handle(event, context, callback) {
    logger.info(`LoadConfigTask: Begin: `, event, context);
    event = _.cloneDeep(event);
    event.version = event.version || 'v1';
    event.jobId = event.jobId;

    let schema = `load-config-request-${event.version}`;
    return Promise.resolve()
      .then(() => {
        if(event.version !== 'v1') {
          throw new error.UnsupportedInputVersion(event.version, 'LoadConfigTask');
        }
        return this.validator.validate(schema, event);
      })
      .then(() => {
        return this.configService.loadConfigs(event);
      })
      .then(output => {
        return callback(null, output);
      })
      .catch(err => {
        if(err instanceof Ajv.ValidationError) {
          throw new error.ValidationError(schema, err.errors);
        }
        logger.error(err);
        throw err;
      })
      .catch(callback);
  }
}

bottle.service('tasks-load-config', LoadConfigTask, 'validator', 'config');

module.exports = LoadConfigTask;