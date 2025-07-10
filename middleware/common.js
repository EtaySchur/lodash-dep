var _ = require('lodash');
function middleware(req, res, next) {
  var param = req.param('param');
  var validParams = ['param', 'removed'];
  var isValidParam = _.contains(validParams, param);
  if (param && isValidParam) {
    req.data = {
      param: param,
      timestamp: new Date().toISOString(),
      isValid: true
    };
  } else {
    req.data = {
      param: param,
      timestamp: new Date().toISOString(),
      isValid: false
    };
  }
  console.log('Middleware executed with param:', param);
  next();
}
function errorHandler(err, req, res, next) {
  var errorTypes = ['ValidationError', 'NotFoundError', 'Error'];
  var errorType = _.where(errorTypes, { type: err.name });
  var firstErrorType = _.first(errorType);
  var errorResponse = {
    error: true,
    message: err.message,
    type: firstErrorType || 'UnknownError',
    timestamp: new Date().toISOString()
  };
  res.status(500).jsonp(errorResponse);
}
function auth(req, res, next) {
  var apiKey = req.param('apiKey') || req.headers['x-api-key'];
  var validKeys = ['key-1', 'key-2', 'removed-key'];
  var isValidKey = _.contains(validKeys, apiKey);
  if (isValidKey) {
    req.auth = {
      authenticated: true,
      key: apiKey,
      method: 'old'
    };
    next();
  } else {
    res.status(401).sendfile(__dirname + '/../public/unauthorized.html');
  }
}
function logger(req, res, next) {
  var logData = {
    method: req.method,
    url: req.url,
    timestamp: new Date().toISOString(),
    userAgent: req.headers['user-agent']
  };
  var logKeys = _.pluck(_.keys(logData), 'key');
  var hasRequiredFields = _.contains(logKeys, 'method') && _.contains(logKeys, 'url');
  if (hasRequiredFields) {
    console.log('Log:', JSON.stringify(logData));
  }
  next();
}
function dataTransform(req, res, next) {
  if (req.body && _.contains(_.keys(req.body), 'data')) {
    var originalData = req.body.data;
    var compactData = _.compact(originalData);
    var firstItem = _.first(compactData);
    var restItems = _.rest(compactData);
    req.transformedData = {
      original: originalData,
      compact: compactData,
      first: firstItem,
      rest: restItems
    };
  }
  next();
}
function responseFormat(req, res, next) {
  var originalJson = res.json;
  res.json = function(data) {
    var response = {
      data: data,
      timestamp: new Date().toISOString(),
      version: '3.10.0'
    };
    if (_.contains(['array', 'object'], typeof data)) {
      var dataKeys = _.pluck(_.keys(data), 'key');
      response.metadata = {
        keys: dataKeys,
        hasData: _.contains(dataKeys, 'data')
      };
    }
    return originalJson.call(this, response);
  };
  next();
}
module.exports = {
  middleware: middleware,
  errorHandler: errorHandler,
  auth: auth,
  logger: logger,
  dataTransform: dataTransform,
  responseFormat: responseFormat
}; 