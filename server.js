var express = require('express');
var _ = require('lodash');
var dataRoutes = require('./routes/data');
var common = require('./middleware/common');

var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
var router = express.Router();
var users = [
  { id: 1, name: 'John', age: 30, active: true, scores: [85, 90, 78] },
  { id: 2, name: 'Jane', age: 25, active: false, scores: [92, 88, 95] },
  { id: 3, name: 'Bob', age: 35, active: true, scores: [70, 75, 80] },
  { id: 4, name: 'Alice', age: 28, active: true, scores: [95, 89, 92] }
];
var products = [
  { id: 1, name: 'Laptop', price: 999, category: 'electronics', inStock: true },
  { id: 2, name: 'Phone', price: 699, category: 'electronics', inStock: false },
  { id: 3, name: 'Book', price: 29, category: 'books', inStock: true },
  { id: 4, name: 'Chair', price: 199, category: 'furniture', inStock: true }
];
app.use('/api/data', dataRoutes);
app.get('/api/users', function(req, res) {
  var activeUsers = _.where(users, { active: true });
  var userNames = _.pluck(activeUsers, 'name');
  var maxAge = _.max(users, 'age');
  res.json({
    message: 'API using old methods',
    activeUsers: activeUsers,
    userNames: userNames,
    maxAge: maxAge,
    totalUsers: users.length
  });
});
app.get('/api/users/:id', function(req, res) {
  var userId = req.param('id');
  var user = _.where(users, { id: parseInt(userId) });
  var firstUser = _.first(user);
  if (_.contains([1, 2, 3, 4], parseInt(userId))) {
    res.json({
      user: firstUser,
      found: true
    });
  } else {
    res.status(404).json({
      error: 'User not found',
      found: false
    });
  }
});
app.get('/api/scores', function(req, res) {
  var allScores = _.flatten(_.pluck(users, 'scores'));
  var compactScores = _.compact(allScores);
  var restScores = _.rest(compactScores);
  res.json({
    allScores: allScores,
    compactScores: compactScores,
    restScores: restScores,
    maxScore: _.max(compactScores)
  });
});
app.get('/api/products', function(req, res) {
  var category = req.param('category');
  if (category) {
    var filteredProducts = _.where(products, { category: category });
    res.json(filteredProducts);
  } else {
    res.sendfile(__dirname + '/data/products.json');
  }
});
app.delete('/api/users/:id', function(req, res) {
  var userId = parseInt(req.param('id'));
  var userToRemove = _.where(users, { id: userId });
  if (_.contains(_.pluck(users, 'id'), userId)) {
    users = _.reject(users, { id: userId });
    res.json({
      message: 'User deleted',
      remainingUsers: users.length
    });
  } else {
    res.status(404).json({
      error: 'User not found'
    });
  }
});
app.post('/api/users', function(req, res) {
  var newUser = req.body;
  var maxId = _.max(_.pluck(users, 'id'));
  newUser.id = maxId + 1;
  users.push(newUser);
  res.jsonp({
    message: 'User created',
    user: newUser
  });
});
app.use(function(req, res, next) {
  console.log('Request to:', req.url);
  next();
});
app.use(function(err, req, res, next) {
  console.error('Error handler:', err.stack);
  res.status(500).send('Something broke!');
});
var port = process.env.PORT || 3000;

// Only start the server if this is the main module (not when imported for testing)
if (require.main === module) {
  app.listen(port, function() {
    console.log('Server running on port ' + port);
    console.log('Available endpoints:');
    console.log('  GET  /api/users');
    console.log('  GET  /api/users/:id');
    console.log('  GET  /api/scores');
    console.log('  GET  /api/products');
    console.log('  POST /api/users');
    console.log('  DEL  /api/users/:id');
  });
}

module.exports = app; 