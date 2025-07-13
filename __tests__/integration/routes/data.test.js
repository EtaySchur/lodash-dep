const request = require('supertest');
const express = require('express');
const _ = require('lodash');

// Create a test app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import the router
const dataRoutes = require('../../../routes/data');
app.use('/data', dataRoutes);

describe('Data Routes', () => {
  describe('GET /data', () => {
    it('should return processed items data', async () => {
      const response = await request(app)
        .get('/data/data')
        .expect(200);

      expect(response.body).toHaveProperty('items');
      expect(response.body).toHaveProperty('itemIds');
      expect(response.body).toHaveProperty('maxValue');
      expect(response.body).toHaveProperty('hasOld');
      expect(response.body).toHaveProperty('firstItem');
      expect(response.body).toHaveProperty('restItems');
      expect(Array.isArray(response.body.items)).toBe(true);
      expect(Array.isArray(response.body.itemIds)).toBe(true);
      expect(Array.isArray(response.body.restItems)).toBe(true);
    });
  });

  describe('GET /array-operations', () => {
    it('should return processed array operations', async () => {
      const response = await request(app)
        .get('/data/array-operations')
        .expect(200);

      expect(response.body).toHaveProperty('original');
      expect(response.body).toHaveProperty('compact');
      expect(response.body).toHaveProperty('flattened');
      expect(response.body).toHaveProperty('rest');
      expect(Array.isArray(response.body.original)).toBe(true);
      expect(Array.isArray(response.body.compact)).toBe(true);
      expect(Array.isArray(response.body.flattened)).toBe(true);
      expect(Array.isArray(response.body.rest)).toBe(true);
    });
  });

  describe('GET /params/:id/:action', () => {
    it('should return item data for valid action', async () => {
      const response = await request(app)
        .get('/data/params/1/view')
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('action');
      expect(response.body).toHaveProperty('item');
      expect(response.body).toHaveProperty('validAction');
      expect(response.body.validAction).toBe(true);
    });

    it('should return error for invalid action', async () => {
      const response = await request(app)
        .get('/data/params/1/invalid')
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('validActions');
      expect(response.body.error).toBe('Invalid action');
      expect(Array.isArray(response.body.validActions)).toBe(true);
    });
  });

  describe('POST /create', () => {
    it('should create new item', async () => {
      const newItem = {
        type: 'test',
        value: 500,
        tags: ['test', 'new']
      };

      const response = await request(app)
        .post('/data/create')
        .send(newItem)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('item');
      expect(response.body).toHaveProperty('totalItems');
      expect(response.body.message).toBe('Item created');
      expect(response.body.item).toHaveProperty('id');
      expect(response.body.item.type).toBe(newItem.type);
    });
  });

  describe('DELETE /delete/:id', () => {
    it('should delete item with valid ID', async () => {
      const response = await request(app)
        .del('/data/delete/1')
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('remainingItems');
      expect(response.body.message).toBe('Item deleted');
    });

    it('should return 404 for invalid item ID', async () => {
      const response = await request(app)
        .del('/data/delete/999')
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Item not found');
    });
  });

  describe('GET /product-analytics', () => {
    it('should return product analytics data', async () => {
      const response = await request(app)
        .get('/data/product-analytics')
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('electronicsProducts');
      expect(response.body).toHaveProperty('maxPriceProduct');
      expect(response.body).toHaveProperty('maxPriceProductPairs');
      expect(response.body).toHaveProperty('highRatedProducts');
      expect(response.body).toHaveProperty('highestRatedProduct');
      expect(response.body).toHaveProperty('highestRatedPairs');
      expect(response.body).toHaveProperty('summary');
      expect(response.body.message).toBe('Product analytics using _.max, _.pairs, and _.filter');
      expect(Array.isArray(response.body.electronicsProducts)).toBe(true);
      expect(Array.isArray(response.body.maxPriceProductPairs)).toBe(true);
      expect(Array.isArray(response.body.highRatedProducts)).toBe(true);
      expect(Array.isArray(response.body.highestRatedPairs)).toBe(true);
      expect(response.body.summary).toHaveProperty('totalProducts');
      expect(response.body.summary).toHaveProperty('electronicsCount');
      expect(response.body.summary).toHaveProperty('highRatedCount');
      expect(response.body.summary.totalProducts).toBe(5);
      expect(response.body.summary.electronicsCount).toBe(3);
      expect(response.body.summary.highRatedCount).toBe(3);
    });
  });
});

describe('Data Routes Lodash Methods', () => {
  describe('_.where usage in data routes', () => {
    it('should filter items by type', () => {
      const items = [
        { id: 1, type: 'old', value: 100 },
        { id: 2, type: 'old', value: 200 },
        { id: 3, type: 'modern', value: 300 }
      ];

      const oldItems = _.where(items, { type: 'old' });
      expect(oldItems).toHaveLength(2);
      expect(oldItems[0].id).toBe(1);
      expect(oldItems[1].id).toBe(2);
    });

    it('should filter items by id', () => {
      const items = [
        { id: 1, type: 'old', value: 100 },
        { id: 2, type: 'old', value: 200 },
        { id: 3, type: 'modern', value: 300 }
      ];

      const item = _.where(items, { id: 2 });
      expect(item).toHaveLength(1);
      expect(item[0].type).toBe('old');
    });
  });

  describe('_.pluck usage in data routes', () => {
    it('should extract ids from items', () => {
      const items = [
        { id: 1, type: 'old' },
        { id: 2, type: 'old' },
        { id: 3, type: 'modern' }
      ];

      const itemIds = _.pluck(items, 'id');
      expect(itemIds).toEqual([1, 2, 3]);
    });

    it('should extract types from items', () => {
      const items = [
        { id: 1, type: 'old' },
        { id: 2, type: 'old' },
        { id: 3, type: 'modern' }
      ];

      const types = _.pluck(items, 'type');
      expect(types).toEqual(['old', 'old', 'modern']);
    });
  });

  describe('_.max usage in data routes', () => {
    it('should find maximum value by property', () => {
      const items = [
        { id: 1, value: 100 },
        { id: 2, value: 200 },
        { id: 3, value: 150 }
      ];

      const maxValueItem = _.max(items, 'value');
      expect(maxValueItem.value).toBe(200);
    });

    it('should find maximum value in array', () => {
      const values = [100, 200, 150, 300];
      const maxValue = _.max(values);
      expect(maxValue).toBe(300);
    });
  });

  describe('_.contains usage in data routes', () => {
    it('should check if value exists in array', () => {
      const validActions = ['view', 'edit', 'delete'];
      expect(_.contains(validActions, 'view')).toBe(true);
      expect(_.contains(validActions, 'invalid')).toBe(false);
    });

    it('should check if type exists in items', () => {
      const types = ['old', 'old', 'modern'];
      expect(_.contains(types, 'old')).toBe(true);
      expect(_.contains(types, 'new')).toBe(false);
    });
  });

  describe('_.first usage in data routes', () => {
    it('should get first item from array', () => {
      const items = [
        { id: 1, type: 'old' },
        { id: 2, type: 'old' }
      ];

      const firstItem = _.first(items);
      expect(firstItem.id).toBe(1);
      expect(firstItem.type).toBe('old');
    });
  });

  describe('_.rest usage in data routes', () => {
    it('should get all items except first', () => {
      const items = [
        { id: 1, type: 'old' },
        { id: 2, type: 'old' },
        { id: 3, type: 'modern' }
      ];

      const restItems = _.rest(items);
      expect(restItems).toHaveLength(2);
      expect(restItems[0].id).toBe(2);
      expect(restItems[1].id).toBe(3);
    });
  });

  describe('_.compact usage in data routes', () => {
    it('should remove falsy values from array', () => {
      const numbers = [1, 2, 3, null, 4, undefined, 5, 0, 6];
      const compactNumbers = _.compact(numbers);
      expect(compactNumbers).toEqual([1, 2, 3, 4, 5, 6]);
    });
  });

  describe('_.flatten usage in data routes', () => {
    it('should flatten nested arrays', () => {
      const nestedArrays = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
      ];
      const flattened = _.flatten(nestedArrays);
      expect(flattened).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });
  });

  describe('_.reject usage in data routes', () => {
    it('should filter out items matching criteria', () => {
      const items = [
        { id: 1, type: 'old' },
        { id: 2, type: 'old' },
        { id: 3, type: 'modern' }
      ];

      const filteredItems = _.reject(items, { id: 2 });
      expect(filteredItems).toHaveLength(2);
      expect(filteredItems[0].id).toBe(1);
      expect(filteredItems[1].id).toBe(3);
    });
  });

  describe('_.pairs usage in combined example', () => {
    it('should convert object to key-value pairs', () => {
      const product = {
        id: 1,
        name: 'Product A',
        price: 100,
        category: 'electronics'
      };

      const pairs = _.pairs(product);
      expect(pairs).toEqual([
        ['id', 1],
        ['name', 'Product A'],
        ['price', 100],
        ['category', 'electronics']
      ]);
    });
  });
}); 