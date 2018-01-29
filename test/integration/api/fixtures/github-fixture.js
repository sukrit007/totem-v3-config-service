'use strict';

require('../../../init');

const
  HttpStatus = require('http-status-codes'),
  nock = require('nock');

const DATA = {
  TEST_OWNER: 'test-owner',
  TEST_REPO: 'test-repo',
  BASE_URL: 'https://api.github.com',
  TEST_HOOK_ID: 1

};

function nockListHooks() {
  return nock(DATA.BASE_URL)
    .get(`/repos/${DATA.TEST_OWNER}/${DATA.TEST_REPO}/hooks`)
    .reply(HttpStatus.OK, []);
}

function nockListHooksWithExistingHook(apiBase) {
  return nock(DATA.BASE_URL)
    .get(`/repos/${DATA.TEST_OWNER}/${DATA.TEST_REPO}/hooks`)
    .reply(HttpStatus.OK, [{
      name: 'web',
      id: DATA.TEST_HOOK_ID,
      config: {
        url:  `${apiBase}/hooks/github`
      }
    }]);
}

function nockCreateHook() {
  return nock(DATA.BASE_URL)
    .post(`/repos/${DATA.TEST_OWNER}/${DATA.TEST_REPO}/hooks`)
    .reply(HttpStatus.CREATED, (uri, requestBody) => {
      let body = JSON.parse(requestBody);
      return {
        id: DATA.TEST_HOOK_ID,
        url: `https://api.github.com/repos/${DATA.TEST_OWNER}/${DATA.TEST_REPO}/hooks/${DATA.TEST_HOOK_ID}`,
        name: body.name,
        events: body.events,
        active: body.active,
        config: body.config
      };
    });
}

function nockUpdateHook() {
  return nock(DATA.BASE_URL)
    .patch(`/repos/${DATA.TEST_OWNER}/${DATA.TEST_REPO}/hooks/${DATA.TEST_HOOK_ID}`)
    .reply(HttpStatus.OK, (uri, requestBody) => {
      let body = JSON.parse(requestBody);
      return {
        id: DATA.TEST_HOOK_ID,
        url: `https://api.github.com/repos/${DATA.TEST_OWNER}/${DATA.TEST_REPO}/hooks/${DATA.TEST_HOOK_ID}`,
        name: body.name,
        events: body.events,
        active: body.active,
        config: body.config
      };
    });
}


module.exports = {
  DATA,
  nockListHooks,
  nockListHooksWithExistingHook,
  nockCreateHook,
  nockUpdateHook
};

