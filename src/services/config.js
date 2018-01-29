'use strict';

const
  constants = require('../common/constants'),
  bottle = constants.BOTTLE_CONTAINER,
  promisify = require('es6-promisify'),
  uuidv4 = require('uuid/v4'),
  _ = require('lodash'),
  config = require('config');

/**
 * Service class that abstracts configuration lookup and storage
 */
class ConfigService {

  /**
   * Constructor
   */
  constructor(githubService, s3Service, outputConfig, configRepo) {
    this.githubService = githubService;
    this.outputConfig = outputConfig || config.output;
    this.s3Service = s3Service;
    this.configRepo = configRepo || config.configRepo;
    this._readFile = promisify(require('fs').readFile); //Add it at object level for mock testing
    this._writeFile = promisify(require('fs').writeFile); //Add it at object level for mock testing
  }

  /**
   * Loads all the configs for a given github project and adds to S3 bucket
   *
   * Algorithm:
   * - Lookup config in github repo for given ref (branch / tag/ commit)
   * - If not found, lookup config in shared github repo
   * - If not found use defaults
   */
  loadConfigs(options) {
    options = _.cloneDeep(options);
    options.jobId = options.jobId || uuidv4();

    let location = `${this.outputConfig.prefix}/${options.jobId}`;

    let configPromises = _.map(constants.TOTEM_CONFIGS, configName =>
      this.loadConfig(options.owner, options.repo, options.branch, options.commit, configName, location));
    return Promise.all(configPromises)
      .then(() => {
        return {
          bucket: this.outputConfig.bucket,
          location
        };
      });
  }

  loadConfig(owner, repo, branch, commit, configFile, location) {
    return this.githubService.loadFile(configFile, owner, repo, commit)
      .then(data => {
        if(!data) {
          let path = `${this.configRepo.env}/${owner}/${repo}/${branch}/${configFile}`;
          return this.githubService.loadFile(path, this.configRepo.owner, this.configRepo.repo, this.configRepo.branch);
        }
        return data;
      })
      .then(data => {
        if(!data) {
          let path = `${this.configRepo.env}/${owner}/${repo}/${configFile}`;
          return this.githubService.loadFile(path, this.configRepo.owner, this.configRepo.repo, this.configRepo.branch);
        }
        return data;
      })
      .then(data => {
        if(!data) {
          return this._readFile(`./config/templates/default/${configFile}`, 'utf-8');
        }
        return data;
      })
      .then(data => {
        return this.s3Service.putObject({
          Bucket: this.outputConfig.bucket,
          Body: data,
          Key: `${location}/${configFile}`
        }).promise();
      })
      .then(() => {}); //No return expected
  }

}

bottle.service('config', ConfigService, 'github', 's3');

module.exports = ConfigService;