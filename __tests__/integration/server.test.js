const request = require('supertest');
const express = require('express');
const _ = require('lodash');

// Import the app
const app = require('../../server');

describe('Server API Endpoints', () => {
  describe('GET /api/users', () => {
    it('should return active users and user data', async () => {
      const response = await request(app)
        .get('/api/users')
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('activeUsers');
      expect(response.body).toHaveProperty('userNames');
      expect(response.body).toHaveProperty('maxAge');
      expect(response.body).toHaveProperty('totalUsers');
      expect(response.body.message).toBe('API using old methods');
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return user by valid ID', async () => {
      const response = await request(app)
        .get('/api/users/1')
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('found');
      expect(response.body.found).toBe(true);
    });

    it('should return 404 for invalid user ID', async () => {
      const response = await request(app)
        .get('/api/users/999')
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('found');
      expect(response.body.found).toBe(false);
      expect(response.body.error).toBe('User not found');
    });
  });

  describe('GET /api/scores', () => {
    it('should return processed scores data', async () => {
      const response = await request(app)
        .get('/api/scores')
        .expect(200);

      expect(response.body).toHaveProperty('allScores');
      expect(response.body).toHaveProperty('compactScores');
      expect(response.body).toHaveProperty('restScores');
      expect(response.body).toHaveProperty('maxScore');
      expect(Array.isArray(response.body.allScores)).toBe(true);
      expect(Array.isArray(response.body.compactScores)).toBe(true);
      expect(Array.isArray(response.body.restScores)).toBe(true);
    });
  });

  describe('GET /api/products', () => {
    it('should return products filtered by category', async () => {
      const response = await request(app)
        .get('/api/products?category=electronics')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach(product => {
        expect(product).toHaveProperty('category');
        expect(product.category).toBe('electronics');
      });
    });

    it('should serve products.json file when no category specified', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(200);

      // This should return the JSON file content
      expect(response.body).toBeDefined();
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete user with valid ID', async () => {
      const response = await request(app)
        .del('/api/users/1')
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('remainingUsers');
      expect(response.body.message).toBe('User deleted');
    });

    it('should return 404 for invalid user ID', async () => {
      const response = await request(app)
        .del('/api/users/999')
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('User not found');
    });
  });

  describe('POST /api/users', () => {
    it('should create new user', async () => {
      const newUser = {
        name: 'Test User',
        age: 25,
        active: true,
        scores: [85, 90, 88]
      };

      const response = await request(app)
        .post('/api/users')
        .send(newUser)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('user');
      expect(response.body.message).toBe('User created');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.name).toBe(newUser.name);
    });
  });
});

describe('Lodash Deprecated Methods Usage', () => {
  describe('_.where usage', () => {
    it('should filter users by active status', () => {
      const users = [
        { id: 1, name: 'John', active: true },
        { id: 2, name: 'Jane', active: false },
        { id: 3, name: 'Bob', active: true }
      ];

      const activeUsers = _.where(users, { active: true });
      expect(activeUsers).toHaveLength(2);
      expect(activeUsers[0].name).toBe('John');
      expect(activeUsers[1].name).toBe('Bob');
    });
  });

  describe('_.pluck usage', () => {
    it('should extract property values from objects', () => {
      const users = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
        { id: 3, name: 'Bob' }
      ];

      const names = _.pluck(users, 'name');
      expect(names).toEqual(['John', 'Jane', 'Bob']);
    });
  });

  describe('_.max usage', () => {
    it('should find maximum value by property', () => {
      const users = [
        { id: 1, age: 30 },
        { id: 2, age: 25 },
        { id: 3, age: 35 }
      ];

      const maxAgeUser = _.max(users, 'age');
      expect(maxAgeUser.age).toBe(35);
    });

    it('should find maximum value in array', () => {
      const scores = [85, 90, 78, 95, 88];
      const maxScore = _.max(scores);
      expect(maxScore).toBe(95);
    });
  });

  describe('_.contains usage', () => {
    it('should check if value exists in array', () => {
      const validIds = [1, 2, 3, 4];
      expect(_.contains(validIds, 1)).toBe(true);
      expect(_.contains(validIds, 999)).toBe(false);
    });
  });

  describe('_.first usage', () => {
    it('should get first element from array', () => {
      const users = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' }
      ];

      const firstUser = _.first(users);
      expect(firstUser.id).toBe(1);
      expect(firstUser.name).toBe('John');
    });
  });

  describe('_.flatten usage', () => {
    it('should flatten nested arrays', () => {
      const nestedScores = [
        [85, 90, 78],
        [92, 88, 95],
        [70, 75, 80]
      ];

      const flattened = _.flatten(nestedScores);
      expect(flattened).toEqual([85, 90, 78, 92, 88, 95, 70, 75, 80]);
    });
  });

  describe('_.compact usage', () => {
    it('should remove falsy values', () => {
      const scores = [85, null, 90, undefined, 78, 0, 95];
      const compactScores = _.compact(scores);
      expect(compactScores).toEqual([85, 90, 78, 95]);
    });
  });

  describe('_.rest usage', () => {
    it('should get all elements except first', () => {
      const scores = [85, 90, 78, 95];
      const restScores = _.rest(scores);
      expect(restScores).toEqual([90, 78, 95]);
    });
  });

  describe('_.reject usage', () => {
    it('should filter out elements matching criteria', () => {
      const users = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
        { id: 3, name: 'Bob' }
      ];

      const filteredUsers = _.reject(users, { id: 2 });
      expect(filteredUsers).toHaveLength(2);
      expect(filteredUsers[0].id).toBe(1);
      expect(filteredUsers[1].id).toBe(3);
    });
  });
}); 