'use strict';

require('../../init');

const
  sinon = require('sinon'),
  HttpStatus = require('http-status-codes'),
  error = require('../../../src/services/error'),
  GithubService = require('../../../src/services/github');

const
  MOCK_API_URL = 'https://mock-api-url',
  MOCK_REPO = 'mock-repo',
  MOCK_HOOK_ID = 123458,
  MOCK_OWNER = 'mock-owner',
  MOCK_HOOK_SECRET = 'mock-secret',
  MOCK_PAYLOAD = `{"ref": "refs/heads/master"}`,
  MOCK_PAYLOAD_SIGNATURE='sha1=d62588014020e33f70ca7f24f050b03df95a11de',
  MOCK_GITHUB_HOOK_URL = 'https://mock-github-webhook-url';

describe('GithubService', () => {

  let service, githubApi, hubRepo;

  beforeEach(() => {
    githubApi = {
      getRepo: sinon.stub()
    };

    hubRepo = {
      listHooks: sinon.stub(),
      updateHook: sinon.stub(),
      createHook: sinon.stub()
    };


    service = new GithubService(githubApi, {
      config: {
        secret: MOCK_HOOK_SECRET
      }
    });
  });

});