const express = require('express');
const _ = require('lodash');
const router = express.Router();
let items = [
  { id: 1, type: 'old', value: 100, tags: ['old', 'removed'] },
  { id: 2, type: 'old', value: 200, tags: ['old', 'removed'] },
  { id: 3, type: 'modern', value: 300, tags: ['new', 'current'] },
  { id: 4, type: 'old', value: 150, tags: ['old', 'removed'] },
];
router.get('/data', function (req, res) {
  const oldItems = _.where(items, { type: 'old' });
  const itemIds = _.pluck(oldItems, 'id');
  const maxValue = _.max(items, 'value');
  const hasOld = _.contains(_.pluck(items, 'type'), 'old');
  const firstItem = _.first(items);
  const restItems = _.rest(items);
  res.json({
    items: oldItems,
    itemIds,
    maxValue,
    hasOld,
    firstItem,
    restItems,
  });
});
router.get('/array-operations', function (req, res) {
  const numbers = [1, 2, 3, 4, 5, null, 6, 7, undefined, 8];
  const compactNumbers = _.compact(numbers);
  const flattened = _.flatten([numbers, [9, 10], [11, 12]]);
  const restNumbers = _.rest(compactNumbers);
  res.json({
    original: numbers,
    compact: compactNumbers,
    flattened,
    rest: restNumbers,
  });
});
router.get('/params/:id/:action', function (req, res) {
  const id = req.param('id');
  const action = req.param('action');
  const item = _.where(items, { id: parseInt(id) });
  const firstMatch = _.first(item);
  if (_.contains(['view', 'edit', 'delete'], action)) {
    res.json({
      id,
      action,
      item: firstMatch,
      validAction: true,
    });
  } else {
    res.status(400).json({
      error: 'Invalid action',
      validActions: ['view', 'edit', 'delete'],
    });
  }
});
router.post('/create', function (req, res) {
  const newItem = req.body;
  const existingIds = _.pluck(items, 'id');
  const maxId = _.max(existingIds);
  newItem.id = maxId + 1;
  items.push(newItem);
  res.jsonp({
    message: 'Item created',
    item: newItem,
    totalItems: items.length,
  });
});
router.delete('/delete/:id', function (req, res) {
  const id = parseInt(req.param('id'));
  const itemExists = _.contains(_.pluck(items, 'id'), id);
  if (itemExists) {
    items = _.reject(items, { id });
    res.json({
      message: 'Item deleted',
      remainingItems: items.length,
    });
  } else {
    res.status(404).json({
      error: 'Item not found',
    });
  }
});

router.get('/product-analytics', function (req, res) {
  const sampleData = [
    {
      id: 1,
      name: 'Product A',
      price: 100,
      category: 'electronics',
      rating: 4.5,
    },
    {
      id: 2,
      name: 'Product B',
      price: 200,
      category: 'electronics',
      rating: 4.2,
    },
    { id: 3, name: 'Product C', price: 150, category: 'books', rating: 4.8 },
    {
      id: 4,
      name: 'Product D',
      price: 300,
      category: 'electronics',
      rating: 4.0,
    },
    { id: 5, name: 'Product E', price: 80, category: 'books', rating: 4.6 },
  ];

  const electronicsProducts = _.where(sampleData, { category: 'electronics' });
  const maxPriceProduct = _.max(sampleData, 'price');
  const maxPriceProductPairs = _.pairs(maxPriceProduct);
  const highRatedProducts = _.filter(sampleData, function (product) {
    return product.rating >= 4.5;
  });
  const highestRatedProduct = _.max(sampleData, 'rating');
  const highestRatedPairs = _.pairs(highestRatedProduct);

  res.json({
    message: 'Product analytics using _.max, _.pairs, and _.filter',
    electronicsProducts,
    maxPriceProduct,
    maxPriceProductPairs,
    highRatedProducts,
    highestRatedProduct,
    highestRatedPairs,
    summary: {
      totalProducts: sampleData.length,
      electronicsCount: electronicsProducts.length,
      highRatedCount: highRatedProducts.length,
    },
  });
});

router.use(function (req, res, next) {
  console.log('Route middleware - Path:', req.path);
  next();
});
module.exports = router;
