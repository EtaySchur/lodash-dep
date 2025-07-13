const _ = require('lodash');

const middleware = {
  middleware(req, res, next) {
    const param = req.param('param');
    if (_.contains(['param', 'invalid'], param)) {
      req.data = param === 'param' ? 'valid' : 'invalid';
    }
    next();
  },
  errorHandler(err, req, res, next) {
    const errorTypes = [
      { name: 'ValidationError', code: 400 },
      { name: 'UnauthorizedError', code: 401 },
      { name: 'NotFoundError', code: 404 },
    ];
    const errorType = _.where(errorTypes, { name: err.name });
    const firstType = _.first(errorType);
    res.status(firstType ? firstType.code : 500).json({ error: err.message });
  },
  auth(req, res, next) {
    const validKeys = ['123', '456'];
    const apiKey = req.param('apiKey') || req.headers['x-api-key'];
    if (_.contains(validKeys, apiKey)) {
      next();
    } else {
      res.status(401).send('Unauthorized');
    }
  },
  logger(req, res, next) {
    const log = {
      method: req.method,
      url: req.url,
      time: new Date().toISOString(),
    };
    if (_.contains(Object.keys(log), 'method')) {
      console.log(log);
    }
    next();
  },
  dataTransform(req, res, next) {
    if (_.contains(Object.keys(req.body), 'data')) {
      req.body.data = _.compact(req.body.data);
    }
    next();
  },
};

module.exports = middleware;
