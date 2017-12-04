'use strict';

const
  config = require('config'),
  constants = require('../common/constants'),
  logger = require('../common/logger'),
  bottle = constants.BOTTLE_CONTAINER,
  HttpStatus = require('http-status-codes'),
  GitHub = require('github-api'),
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
   * Loads file from github repository
   * @param {String} path - Path of the file to be loaded
   * @param {String} owner - Git repository owner
   * @param {String} repo - Git repository
   * @param {String} ref - Git commit, branch or tag
   * @return {Promise} - raw file contents. If file, repository or ref does not exists, null value is returned
   */
  loadFile(path, owner, repo, ref) {
    let hubRepo = this.githubApi.getRepo(owner, repo);
    return hubRepo.getContents(ref, path, true)
      .then(resp => resp.data)
      .catch(err => {
        if (err.response) {
          if (err.response.status === HttpStatus.NOT_FOUND) {
            return null;
          }
        }
        throw err;
      });
  }
}

bottle.service('github', GithubService, 'githubApi');

// let service = new GithubService(new GitHub({
//   token: config.github.token
// }));
//
// service.loadFile('totem.yml', 'totem', 'totem-demo', 'develop').then(data => {
//   logger.info(data);
// });

module.exports = GithubService;