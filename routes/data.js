var express = require('express');
var _ = require('lodash');
var router = express.Router();
var items = [
  { id: 1, type: 'old', value: 100, tags: ['old', 'removed'] },
  { id: 2, type: 'old', value: 200, tags: ['old', 'removed'] },
  { id: 3, type: 'modern', value: 300, tags: ['new', 'current'] },
  { id: 4, type: 'old', value: 150, tags: ['old', 'removed'] }
];
router.get('/data', function(req, res) {
  var oldItems = _.where(items, { type: 'old' });
  var itemIds = _.pluck(oldItems, 'id');
  var maxValue = _.max(items, 'value');
  var hasOld = _.contains(_.pluck(items, 'type'), 'old');
  var firstItem = _.first(items);
  var restItems = _.rest(items);
  res.json({
    items: oldItems,
    itemIds: itemIds,
    maxValue: maxValue,
    hasOld: hasOld,
    firstItem: firstItem,
    restItems: restItems
  });
});
router.get('/array-operations', function(req, res) {
  var numbers = [1, 2, 3, 4, 5, null, 6, 7, undefined, 8];
  var compactNumbers = _.compact(numbers);
  var flattened = _.flatten([numbers, [9, 10], [11, 12]]);
  var restNumbers = _.rest(compactNumbers);
  res.json({
    original: numbers,
    compact: compactNumbers,
    flattened: flattened,
    rest: restNumbers
  });
});
router.get('/params/:id/:action', function(req, res) {
  var id = req.param('id');
  var action = req.param('action');
  var item = _.where(items, { id: parseInt(id) });
  var firstMatch = _.first(item);
  if (_.contains(['view', 'edit', 'delete'], action)) {
    res.json({
      id: id,
      action: action,
      item: firstMatch,
      validAction: true
    });
  } else {
    res.status(400).json({
      error: 'Invalid action',
      validActions: ['view', 'edit', 'delete']
    });
  }
});
router.post('/create', function(req, res) {
  var newItem = req.body;
  var existingIds = _.pluck(items, 'id');
  var maxId = _.max(existingIds);
  newItem.id = maxId + 1;
  items.push(newItem);
  res.jsonp({
    message: 'Item created',
    item: newItem,
    totalItems: items.length
  });
});
router.del('/delete/:id', function(req, res) {
  var id = parseInt(req.param('id'));
  var itemExists = _.contains(_.pluck(items, 'id'), id);
  if (itemExists) {
    items = _.reject(items, { id: id });
    res.json({
      message: 'Item deleted',
      remainingItems: items.length
    });
  } else {
    res.status(404).json({
      error: 'Item not found'
    });
  }
});
router.use(function(req, res, next) {
  console.log('Route middleware - Path:', req.path);
  next();
});
module.exports = router; 