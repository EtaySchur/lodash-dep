const express = require('express');
const _ = require('lodash');
const dataRoutes = require('./routes/data');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
let users = [
  { id: 1, name: 'John', age: 30, active: true, scores: [85, 90, 78] },
  { id: 2, name: 'Jane', age: 25, active: false, scores: [92, 88, 95] },
  { id: 3, name: 'Bob', age: 35, active: true, scores: [70, 75, 80] },
  { id: 4, name: 'Alice', age: 28, active: true, scores: [95, 89, 92] },
];
const products = [
  { id: 1, name: 'Laptop', price: 999, category: 'electronics', inStock: true },
  { id: 2, name: 'Phone', price: 699, category: 'electronics', inStock: false },
  { id: 3, name: 'Book', price: 29, category: 'books', inStock: true },
  { id: 4, name: 'Chair', price: 199, category: 'furniture', inStock: true },
];
app.use('/api/data', dataRoutes);
app.get('/api/users', function (req, res) {
  const activeUsers = _.where(users, { active: true });
  const userNames = _.pluck(activeUsers, 'name');
  const maxAge = _.max(users, 'age');
  res.json({
    message: 'API using old methods',
    activeUsers,
    userNames,
    maxAge,
    totalUsers: users.length,
  });
});
app.get('/api/users/:id', function (req, res) {
  const userId = req.param('id');
  const user = _.where(users, { id: parseInt(userId) });
  const firstUser = _.first(user);
  if (_.contains([1, 2, 3, 4], parseInt(userId))) {
    res.json({
      user: firstUser,
      found: true,
    });
  } else {
    res.status(404).json({
      error: 'User not found',
      found: false,
    });
  }
});
app.get('/api/scores', function (req, res) {
  const allScores = _.flatten(_.pluck(users, 'scores'));
  const compactScores = _.compact(allScores);
  const restScores = _.rest(compactScores);
  res.json({
    allScores,
    compactScores,
    restScores,
    maxScore: _.max(compactScores),
  });
});
app.get('/api/products', function (req, res) {
  const category = req.param('category');
  if (category) {
    const filteredProducts = _.where(products, { category });
    res.json(filteredProducts);
  } else {
    res.sendfile(`${__dirname}/data/products.json`);
  }
});
app.delete('/api/users/:id', function (req, res) {
  const userId = parseInt(req.param('id'));
  if (_.contains(_.pluck(users, 'id'), userId)) {
    users = _.reject(users, { id: userId });
    res.json({
      message: 'User deleted',
      remainingUsers: users.length,
    });
  } else {
    res.status(404).json({
      error: 'User not found',
    });
  }
});
app.post('/api/users', function (req, res) {
  const newUser = req.body;
  const maxId = _.max(_.pluck(users, 'id'));
  newUser.id = maxId + 1;
  users.push(newUser);
  res.jsonp({
    message: 'User created',
    user: newUser,
  });
});
app.use(function (req, res, next) {
  console.log('Request to:', req.url);
  next();
});
app.use(function (err, req, res, next) {
  console.error('Error handler:', err.stack);
  res.status(500).send('Something broke!');
});
const port = process.env.PORT || 3000;

// Only start the server if this is the main module (not when imported for testing)
if (require.main === module) {
  app.listen(port, function () {
    console.log(`Server running on port ${port}`);
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
