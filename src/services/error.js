'use strict';

const HttpStatus = require('http-status-codes');

/**
 * Base error class
 */
class BaseError extends Error {
  constructor(message, cause) {
    super();
    this.message = message;
    this.cause = cause;
    this.name = this.constructor.name;
    this.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
  }
}

/**
 * Error corresponding to internal service error.
 */
class ServiceError extends BaseError {
  constructor(message, cause) {
    super(message, cause);
    this.code = 'internal_error';
    this.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
  }
}

class BusinessRuleViolation extends BaseError {
  constructor(code, message) {
    super(message);
    this.code = code;
    this.statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
  }
}

class GitRepoNotFound extends BusinessRuleViolation {
  constructor(owner, repo) {
    super('git_repo_not_found', `Git repository: ${repo} or git owner: ${owner} can not be found`);
    this.details = {owner: owner, repo: repo};
  }
}

class EventHandlerNotRegistered extends ServiceError {
  constructor() {
    super('No event handler registered for the given event type', null);
  }
}

class WebhookUnauthorized extends BaseError {
  constructor() {
    super('Invalid/Missing X-Hub-Signature header', null);
    this.statusCode = HttpStatus.UNAUTHORIZED;
  }
}

module.exports = {
  BaseError,
  ServiceError,
  BusinessRuleViolation,
  WebhookUnauthorized,
  GitRepoNotFound,
  EventHandlerNotRegistered
};