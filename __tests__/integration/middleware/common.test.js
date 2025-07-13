const express = require('express');
const _ = require('lodash');

// Import the middleware functions
const common = require('../../../middleware/common');

describe('Common Middleware Functions', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      param: jest.fn(),
      headers: {},
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      jsonp: jest.fn(),
      sendfile: jest.fn()
    };
    next = jest.fn();
  });

  describe('middleware (param validation)', () => {
    it('should set req.data as valid for valid param', () => {
      req.param.mockReturnValue('param');
      common.middleware(req, res, next);
      expect(req.data.isValid).toBe(true);
      expect(next).toHaveBeenCalled();
    });
    it('should set req.data as invalid for invalid param', () => {
      req.param.mockReturnValue('invalid');
      common.middleware(req, res, next);
      expect(req.data.isValid).toBe(false);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('errorHandler middleware', () => {
    it('should handle known error types', () => {
      const error = new Error('Test error');
      error.name = 'ValidationError';
      common.errorHandler(error, req, res, next);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.jsonp).toHaveBeenCalled();
    });
    it('should handle unknown error types', () => {
      const error = new Error('Unknown error');
      error.name = 'UnknownError';
      common.errorHandler(error, req, res, next);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.jsonp).toHaveBeenCalled();
    });
  });

  describe('auth middleware', () => {
    it('should call next() for valid API key in params', () => {
      req.param.mockReturnValue('key-1');
      common.auth(req, res, next);
      expect(req.auth.authenticated).toBe(true);
      expect(next).toHaveBeenCalled();
    });
    it('should call next() for valid API key in headers', () => {
      req.param.mockReturnValue(null);
      req.headers['x-api-key'] = 'key-2';
      common.auth(req, res, next);
      expect(req.auth.authenticated).toBe(true);
      expect(next).toHaveBeenCalled();
    });
    it('should return unauthorized for invalid API key', () => {
      req.param.mockReturnValue('invalid');
      req.headers['x-api-key'] = 'invalid';
      common.auth(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.sendfile).toHaveBeenCalled();
    });
  });

  describe('logger middleware', () => {
    it('should call next() and log for valid request', () => {
      req.method = 'GET';
      req.url = '/api/users';
      req.headers['user-agent'] = 'jest';
      const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
      common.logger(req, res, next);
      expect(next).toHaveBeenCalled();
      spy.mockRestore();
    });
  });

  describe('dataTransform middleware', () => {
    it('should transform data with data field', () => {
      req.body = { data: [1, 2, null, 3, undefined, 4, 0, 5] };
      common.dataTransform(req, res, next);
      expect(req.transformedData).toHaveProperty('compact');
      expect(req.transformedData).toHaveProperty('first');
      expect(req.transformedData).toHaveProperty('rest');
      expect(next).toHaveBeenCalled();
    });
    it('should handle request without data field', () => {
      req.body = { other: 'data' };
      common.dataTransform(req, res, next);
      expect(req.transformedData).toBeUndefined();
      expect(next).toHaveBeenCalled();
    });
  });
});

describe('Common Middleware Lodash Methods', () => {
  describe('_.contains usage in middleware', () => {
    it('should check if parameter is valid', () => {
      const validParams = ['param1', 'param2', 'param3'];
      const param = 'param1';
      const isValidParam = _.contains(validParams, param);
      expect(isValidParam).toBe(true);
    });
    it('should check if API key is valid', () => {
      const validKeys = ['key1', 'key2', 'key3'];
      const apiKey = 'key2';
      const isValidKey = _.contains(validKeys, apiKey);
      expect(isValidKey).toBe(true);
    });
    it('should check if log keys contain required fields', () => {
      const logKeys = ['method', 'url', 'timestamp'];
      const hasRequiredFields = _.contains(logKeys, 'method') && _.contains(logKeys, 'url');
      expect(hasRequiredFields).toBe(true);
    });
    it('should check if request body contains data field', () => {
      const bodyKeys = ['name', 'data', 'value'];
      const hasData = _.contains(bodyKeys, 'data');
      expect(hasData).toBe(true);
    });
  });
  describe('_.where usage in middleware', () => {
    it('should find error type by name', () => {
      const errorTypes = [
        { type: 'ValidationError', message: 'Validation failed' },
        { type: 'NotFoundError', message: 'Resource not found' }
      ];
      const errorType = _.where(errorTypes, { type: 'ValidationError' });
      expect(errorType).toHaveLength(1);
      expect(errorType[0].message).toBe('Validation failed');
    });
  });
  describe('_.first usage in middleware', () => {
    it('should get first error type', () => {
      const errorType = [
        { type: 'ValidationError', message: 'Validation failed' }
      ];
      const firstErrorType = _.first(errorType);
      expect(firstErrorType.type).toBe('ValidationError');
      expect(firstErrorType.message).toBe('Validation failed');
    });
  });
  describe('_.compact usage in middleware', () => {
    it('should remove falsy values from data', () => {
      const originalData = [1, 2, null, 3, undefined, 4, 0, 5];
      const compactData = _.compact(originalData);
      expect(compactData).toEqual([1, 2, 3, 4, 5]);
    });
  });
  describe('_.first usage in middleware', () => {
    it('should get first item from compacted data', () => {
      const compactData = [1, 2, 3, 4, 5];
      const firstItem = _.first(compactData);
      expect(firstItem).toBe(1);
    });
  });
  describe('_.rest usage in middleware', () => {
    it('should get all items except first from compacted data', () => {
      const compactData = [1, 2, 3, 4, 5];
      const restItems = _.rest(compactData);
      expect(restItems).toEqual([2, 3, 4, 5]);
    });
  });
}); 