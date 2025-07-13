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
router.delete('/delete/:id', function(req, res) {
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

router.get('/product-analytics', function(req, res) {
  var sampleData = [
    { id: 1, name: 'Product A', price: 100, category: 'electronics', rating: 4.5 },
    { id: 2, name: 'Product B', price: 200, category: 'electronics', rating: 4.2 },
    { id: 3, name: 'Product C', price: 150, category: 'books', rating: 4.8 },
    { id: 4, name: 'Product D', price: 300, category: 'electronics', rating: 4.0 },
    { id: 5, name: 'Product E', price: 80, category: 'books', rating: 4.6 }
  ];

  var electronicsProducts = _.where(sampleData, { category: 'electronics' });
  var maxPriceProduct = _.max(sampleData, 'price');
  var maxPriceProductPairs = _.pairs(maxPriceProduct);
  var highRatedProducts = _.filter(sampleData, function(product) {
    return product.rating >= 4.5;
  });
  var highestRatedProduct = _.max(sampleData, 'rating');
  var highestRatedPairs = _.pairs(highestRatedProduct);

  res.json({
    message: 'Product analytics using _.max, _.pairs, and _.filter',
    electronicsProducts: electronicsProducts,
    maxPriceProduct: maxPriceProduct,
    maxPriceProductPairs: maxPriceProductPairs,
    highRatedProducts: highRatedProducts,
    highestRatedProduct: highestRatedProduct,
    highestRatedPairs: highestRatedPairs,
    summary: {
      totalProducts: sampleData.length,
      electronicsCount: electronicsProducts.length,
      highRatedCount: highRatedProducts.length
    }
  });
});

router.use(function(req, res, next) {
  console.log('Route middleware - Path:', req.path);
  next();
});
module.exports = router; 