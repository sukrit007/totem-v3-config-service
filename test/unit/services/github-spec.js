'use strict';

require('../../init');

const
  sinon = require('sinon'),
  HttpStatus = require('http-status-codes'),
  GithubService = require('../../../src/services/github');

const
  MOCK_REPO = 'mock-repo',
  MOCK_PATH = './mock-config.yml',
  MOCK_OWNER = 'mock-owner',
  MOCK_REF = 'mock-ref',
  MOCK_DATA = 'mock-data';

describe('GithubService', () => {

  let service, githubApi, hubRepo;

  beforeEach(() => {
    githubApi = {
      getRepo: sinon.stub()
    };

    hubRepo = {
      getContents: sinon.stub()
    };

    githubApi.getRepo.returns(hubRepo);
    service = new GithubService(githubApi);
  });

  describe('loadFile', () => {

    it('should load existing file from github', () => {

      hubRepo.getContents.returns(Promise.resolve({
        data: MOCK_DATA
      }));
      return service.loadFile(MOCK_PATH, MOCK_OWNER, MOCK_REPO, MOCK_REF).should.eventually.equal(MOCK_DATA)
        .then(() => {
          githubApi.getRepo.should.be.calledWithExactly(MOCK_OWNER, MOCK_REPO);
          hubRepo.getContents.should.be.calledWithExactly(MOCK_REF, MOCK_PATH, true);
        });
    });

    it('should return null when file is not found in github', () => {
      let error = new Error('Mock error. Please ignore');
      error.response = {
        status: HttpStatus.NOT_FOUND
      };
      hubRepo.getContents.returns(Promise.reject(error));
      return service.loadFile(MOCK_PATH, MOCK_OWNER, MOCK_REPO, MOCK_REF).should.eventually.equal(null);
    });

    it('should throw error when unknown error happens invoking github', () => {
      let error = new Error('Mock error. Please ignore');
      error.response = {
        status: HttpStatus.INTERNAL_SERVER_ERROR
      };
      hubRepo.getContents.returns(Promise.reject(error));
      return service.loadFile(MOCK_PATH, MOCK_OWNER, MOCK_REPO, MOCK_REF).should.be.rejectedWith(error);
    });
  });

});