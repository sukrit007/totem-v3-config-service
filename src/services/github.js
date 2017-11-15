'use strict';

const
  config = require('config'),
  constants = require('../common/constants'),
  logger = require('../common/logger'),
  bottle = constants.BOTTLE_CONTAINER,
  HttpStatus = require('http-status-codes'),
  crypto = require('crypto'),
  error = require('./error'),
  _ = require('lodash');

/**
 * Github Wrapper service that abstract calls to github
 */
class GithubService {

  /**
   * Initialize GithubService
   * @param {GitHub} githubApi - GitHub API Instance
   * @param {GitHub} [hookDef] - Default parameters for hook definition
   */
  constructor(githubApi, hookDef) {
    this.githubApi = githubApi;
    this.hookDef = _.merge({}, config.github.hookDef, hookDef);
  }

  /**
   * Service that sets up totem-v3 orchestrator webhook for given github repository
   * @param {String} owner - Github owner name
   * @param {String} repo - Github repository name
   * @param {String} apiUrl - Base API URl for configuring webhook
   * @return {Promise.<TResult>}
   */
  setupWebhook(owner, repo, apiUrl) {
    let hubRepo = this.githubApi.getRepo(owner, repo);
    let hookUrl = `${apiUrl}/hooks/github`;
    logger.info(`Configuring webhook for ${owner}/${repo} using apiUrl:${apiUrl}`);
    return hubRepo.listHooks()
      .then(resp => {
        let hooks = resp.data;
        return _.find(hooks, hook => {
          return hook.config && hook.config.url && hook.config.url.toLowerCase().startsWith(apiUrl);
        });
      })
      .then(hook => {
        let newHook = _.merge({}, this.hookDef, {
          config: {
            url: hookUrl
          }
        });
        if (hook) {
          return hubRepo.updateHook(hook.id, newHook);
        } else {
          return hubRepo.createHook(newHook);
        }
      })
      .then(resp => {
        return {
          location: resp.data.url,
          hookId: resp.data.id,
          hookUrl: hookUrl
        };
      })
      .catch(err => {
        if (err.response) {
          if (err.response.status === HttpStatus.NOT_FOUND) {
            throw new error.GitRepoNotFound(owner, repo);
          }
        }
        throw err;
      });
  }

  /**
   * Validates the signature for incoming webhook using
   * https://developer.github.com/webhooks/securing/#validating-payloads-from-github
   * @param payload
   * @param inputSignature
   */
  validateHookSignature(rawPayload, inputSignature) {
    let digest = crypto
      .createHmac('sha1', this.hookDef.config.secret)
      .update(rawPayload)
      .digest('hex');

    let calculatedSignature = `sha1=${digest}`;
    if(!inputSignature || calculatedSignature.length !== inputSignature.length) {
      return false;
    }
    return crypto.timingSafeEqual(
      Buffer.from(calculatedSignature),
      Buffer.from(inputSignature));
  }
}

bottle.service('github', GithubService, 'githubApi');

module.exports = GithubService;