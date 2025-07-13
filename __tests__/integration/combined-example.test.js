const request = require('supertest');
const express = require('express');
const _ = require('lodash');

// Create a test app
const app = express();
app.use(express.json());

// Import the router
const dataRoutes = require('../../routes/data');
app.use('/data', dataRoutes);

describe('Combined Example Endpoint', () => {
  describe('GET /data/product-analytics', () => {
    it('should return product analytics with all required properties', async () => {
      const response = await request(app)
        .get('/data/product-analytics')
        .expect(200);

      // Check main message
      expect(response.body.message).toBe('Product analytics using _.max, _.pairs, and _.filter');

      // Check electronics products (_.where usage)
      expect(response.body).toHaveProperty('electronicsProducts');
      expect(Array.isArray(response.body.electronicsProducts)).toBe(true);
      response.body.electronicsProducts.forEach(product => {
        expect(product.category).toBe('electronics');
      });

      // Check max price product (_.max usage)
      expect(response.body).toHaveProperty('maxPriceProduct');
      expect(response.body.maxPriceProduct).toHaveProperty('price');
      expect(response.body.maxPriceProduct.price).toBe(300); // Should be the highest price

      // Check max price product pairs (_.pairs usage)
      expect(response.body).toHaveProperty('maxPriceProductPairs');
      expect(Array.isArray(response.body.maxPriceProductPairs)).toBe(true);
      expect(response.body.maxPriceProductPairs.length).toBeGreaterThan(0);
      response.body.maxPriceProductPairs.forEach(pair => {
        expect(Array.isArray(pair)).toBe(true);
        expect(pair.length).toBe(2);
      });

      // Check high rated products (_.where usage with function)
      expect(response.body).toHaveProperty('highRatedProducts');
      expect(Array.isArray(response.body.highRatedProducts)).toBe(true);
      expect(response.body.highRatedProducts).toHaveLength(3);
      
      // Check that products with rating >= 4.5 are present
      const highRatedProductNames = response.body.highRatedProducts
        .filter(product => product.rating >= 4.5)
        .map(product => product.name);
      expect(highRatedProductNames).toContain('Product A');
      expect(highRatedProductNames).toContain('Product C');
      expect(highRatedProductNames).toContain('Product E');

      // Check highest rated product (_.max usage)
      expect(response.body).toHaveProperty('highestRatedProduct');
      expect(response.body.highestRatedProduct).toHaveProperty('rating');
      expect(response.body.highestRatedProduct.rating).toBe(4.8); // Should be the highest rating

      // Check highest rated product pairs (_.pairs usage)
      expect(response.body).toHaveProperty('highestRatedPairs');
      expect(Array.isArray(response.body.highestRatedPairs)).toBe(true);
      expect(response.body.highestRatedPairs.length).toBeGreaterThan(0);
      response.body.highestRatedPairs.forEach(pair => {
        expect(Array.isArray(pair)).toBe(true);
        expect(pair.length).toBe(2);
      });

      // Check summary
      expect(response.body).toHaveProperty('summary');
      expect(response.body.summary).toHaveProperty('totalProducts');
      expect(response.body.summary).toHaveProperty('electronicsCount');
      expect(response.body.summary).toHaveProperty('highRatedCount');
      expect(response.body.summary.totalProducts).toBe(5);
      expect(response.body.summary.electronicsCount).toBe(3);
      expect(response.body.summary.highRatedCount).toBe(3);
    });

    it('should have correct data structure for sample products', async () => {
      const response = await request(app)
        .get('/data/product-analytics')
        .expect(200);

      // Verify the sample data structure
      const sampleData = [
        { id: 1, name: 'Product A', price: 100, category: 'electronics', rating: 4.5 },
        { id: 2, name: 'Product B', price: 200, category: 'electronics', rating: 4.2 },
        { id: 3, name: 'Product C', price: 150, category: 'books', rating: 4.8 },
        { id: 4, name: 'Product D', price: 300, category: 'electronics', rating: 4.0 },
        { id: 5, name: 'Product E', price: 80, category: 'books', rating: 4.6 }
      ];

      // Check that electronics products are correctly filtered
      const electronicsProducts = _.where(sampleData, { category: 'electronics' });
      expect(response.body.electronicsProducts).toHaveLength(electronicsProducts.length);

      // Check that max price product is correct
      const maxPriceProduct = _.max(sampleData, 'price');
      expect(response.body.maxPriceProduct.price).toBe(maxPriceProduct.price);

      // Check that high rated products are correctly filtered
      const highRatedProducts = _.where(sampleData, function(product) {
        return product.rating >= 4.5;
      });
      expect(response.body.highRatedProducts).toHaveLength(3);
      
      // Check that the expected high-rated products are present
      const highRatedNames = highRatedProducts
        .map(product => product.name);
      expect(highRatedNames).toContain('Product A');
      expect(highRatedNames).toContain('Product C');
      expect(highRatedNames).toContain('Product E');

      // Check that highest rated product is correct
      const highestRatedProduct = _.max(sampleData, 'rating');
      expect(response.body.highestRatedProduct.rating).toBe(highestRatedProduct.rating);
    });
  });
});

describe('Combined Example Lodash Methods Integration', () => {
  describe('_.where, _.max, and _.pairs integration', () => {
    it('should demonstrate all three methods working together', () => {
      const sampleData = [
        { id: 1, name: 'Product A', price: 100, category: 'electronics', rating: 4.5 },
        { id: 2, name: 'Product B', price: 200, category: 'electronics', rating: 4.2 },
        { id: 3, name: 'Product C', price: 150, category: 'books', rating: 4.8 },
        { id: 4, name: 'Product D', price: 300, category: 'electronics', rating: 4.0 },
        { id: 5, name: 'Product E', price: 80, category: 'books', rating: 4.6 }
      ];

      // Test _.where filtering
      const electronicsProducts = _.where(sampleData, { category: 'electronics' });
      expect(electronicsProducts).toHaveLength(3);
      expect(electronicsProducts[0].name).toBe('Product A');
      expect(electronicsProducts[1].name).toBe('Product B');
      expect(electronicsProducts[2].name).toBe('Product D');

      // Test _.max finding maximum
      const maxPriceProduct = _.max(sampleData, 'price');
      expect(maxPriceProduct.price).toBe(300);
      expect(maxPriceProduct.name).toBe('Product D');

      // Test _.pairs converting object to pairs
      const maxPriceProductPairs = _.pairs(maxPriceProduct);
      expect(maxPriceProductPairs).toEqual([
        ['id', 4],
        ['name', 'Product D'],
        ['price', 300],
        ['category', 'electronics'],
        ['rating', 4.0]
      ]);

      // Test _.filter with function
      const highRatedProducts = _.filter(sampleData, function(product) {
        return product.rating >= 4.5;
      });
      expect(highRatedProducts).toHaveLength(3); // Now working correctly with _.filter
      
      // Check that the expected high-rated products are present
      const highRatedNames = highRatedProducts
        .map(product => product.name);
      expect(highRatedNames).toContain('Product A');
      expect(highRatedNames).toContain('Product C');
      expect(highRatedNames).toContain('Product E');

      // Test _.max finding highest rating
      const highestRatedProduct = _.max(sampleData, 'rating');
      expect(highestRatedProduct.rating).toBe(4.8);
      expect(highestRatedProduct.name).toBe('Product C');

      // Test _.pairs converting highest rated product
      const highestRatedPairs = _.pairs(highestRatedProduct);
      expect(highestRatedPairs).toEqual([
        ['id', 3],
        ['name', 'Product C'],
        ['price', 150],
        ['category', 'books'],
        ['rating', 4.8]
      ]);
    });

    it('should handle edge cases correctly', () => {
      const emptyData = [];
      const singleItemData = [{ id: 1, name: 'Single', price: 100, category: 'test', rating: 4.0 }];

      // Test with empty data
      const emptyElectronics = _.where(emptyData, { category: 'electronics' });
      expect(emptyElectronics).toHaveLength(0);

      const emptyMaxPrice = _.max(emptyData, 'price');
      expect(emptyMaxPrice).toBe(-Infinity);

      // Test with single item
      const singleElectronics = _.where(singleItemData, { category: 'test' });
      expect(singleElectronics).toHaveLength(1);

      const singleMaxPrice = _.max(singleItemData, 'price');
      expect(singleMaxPrice.price).toBe(100);

      const singlePairs = _.pairs(singleMaxPrice);
      expect(singlePairs.length).toBeGreaterThan(0);
    });
  });
}); 