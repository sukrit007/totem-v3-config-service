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

class UnsupportedInputVersion extends BaseError {
  constructor(version, task) {
    super(`Unsupported version: ${version} for ${task}`);
    this.code = 'validation_error';
    this.version = version;
    this.task = task;
    this.statusCode = HttpStatus.BAD_REQUEST;
  }
}

class ValidationError extends BaseError {
  constructor(schema, errors) {
    super(`Validation failed for schema: ${schema}. Reason:${JSON.stringify(errors)}`);
    this.code = 'validation_error';
    this.schema = schema;
    this.errors = errors;
    this.statusCode = HttpStatus.BAD_REQUEST;
  }
}

module.exports = {
  BaseError,
  ServiceError,
  BusinessRuleViolation,
  GitRepoNotFound,
  ValidationError,
  UnsupportedInputVersion,
  EventHandlerNotRegistered
};