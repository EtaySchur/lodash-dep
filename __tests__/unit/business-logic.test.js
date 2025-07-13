const _ = require('lodash');

// Mock data for testing
const mockUsers = [
  { id: 1, name: 'John', age: 30, active: true, scores: [85, 90, 88] },
  { id: 2, name: 'Jane', age: 25, active: false, scores: [92, 88, 95] },
  { id: 3, name: 'Bob', age: 35, active: true, scores: [78, 85, 82] },
  { id: 4, name: 'Alice', age: 28, active: true, scores: [95, 92, 90] }
];

const mockProducts = [
  { id: 1, name: 'Laptop', price: 999, category: 'electronics' },
  { id: 2, name: 'Phone', price: 699, category: 'electronics' },
  { id: 3, name: 'Book', price: 25, category: 'books' },
  { id: 4, name: 'Tablet', price: 399, category: 'electronics' }
];

// Pure business logic functions (what we should actually test)
const businessLogic = {
  // Get active users
  getActiveUsers: (users) => {
    return _.where(users, { active: true });
  },

  // Get user names
  getUserNames: (users) => {
    return _.pluck(users, 'name');
  },

  // Find user with maximum age
  getUserWithMaxAge: (users) => {
    return _.max(users, 'age');
  },

  // Get total user count
  getTotalUsers: (users) => {
    return users.length;
  },

  // Process scores (compact, rest, max)
  processScores: (scores) => {
    return {
      allScores: scores,
      compactScores: _.compact(scores),
      restScores: _.rest(scores),
      maxScore: _.max(scores)
    };
  },

  // Filter products by category
  filterProductsByCategory: (products, category) => {
    return _.where(products, { category });
  },

  // Find product with maximum price
  getProductWithMaxPrice: (products) => {
    return _.max(products, 'price');
  },

  // Check if user exists
  userExists: (users, userId) => {
    return _.contains(_.pluck(users, 'id'), userId);
  },

  // Get first user
  getFirstUser: (users) => {
    return _.first(users);
  },

  // Flatten nested scores
  flattenScores: (nestedScores) => {
    return _.flatten(nestedScores);
  },

  // Remove inactive users
  removeInactiveUsers: (users) => {
    return _.reject(users, { active: false });
  }
};

describe('Business Logic Unit Tests', () => {
  describe('User Management', () => {
    it('should get active users', () => {
      const activeUsers = businessLogic.getActiveUsers(mockUsers);
      expect(activeUsers).toHaveLength(3);
      expect(activeUsers.every(user => user.active)).toBe(true);
    });

    it('should get user names', () => {
      const names = businessLogic.getUserNames(mockUsers);
      expect(names).toEqual(['John', 'Jane', 'Bob', 'Alice']);
    });

    it('should find user with maximum age', () => {
      const maxAgeUser = businessLogic.getUserWithMaxAge(mockUsers);
      expect(maxAgeUser.age).toBe(35);
      expect(maxAgeUser.name).toBe('Bob');
    });

    it('should get total user count', () => {
      const total = businessLogic.getTotalUsers(mockUsers);
      expect(total).toBe(4);
    });

    it('should check if user exists', () => {
      expect(businessLogic.userExists(mockUsers, 1)).toBe(true);
      expect(businessLogic.userExists(mockUsers, 999)).toBe(false);
    });

    it('should get first user', () => {
      const firstUser = businessLogic.getFirstUser(mockUsers);
      expect(firstUser.id).toBe(1);
      expect(firstUser.name).toBe('John');
    });

    it('should remove inactive users', () => {
      const activeOnly = businessLogic.removeInactiveUsers(mockUsers);
      expect(activeOnly).toHaveLength(3);
      expect(activeOnly.every(user => user.active)).toBe(true);
    });
  });

  describe('Score Processing', () => {
    it('should process scores correctly', () => {
      const scores = [85, null, 90, undefined, 78, 0, 95];
      const processed = businessLogic.processScores(scores);

      expect(processed.allScores).toEqual(scores);
      expect(processed.compactScores).toEqual([85, 90, 78, 95]);
      expect(processed.restScores).toEqual([null, 90, undefined, 78, 0, 95]);
      expect(processed.maxScore).toBe(95);
    });

    it('should flatten nested scores', () => {
      const nestedScores = [
        [85, 90, 78],
        [92, 88, 95],
        [70, 75, 80]
      ];

      const flattened = businessLogic.flattenScores(nestedScores);
      expect(flattened).toEqual([85, 90, 78, 92, 88, 95, 70, 75, 80]);
    });
  });

  describe('Product Management', () => {
    it('should filter products by category', () => {
      const electronics = businessLogic.filterProductsByCategory(mockProducts, 'electronics');
      expect(electronics).toHaveLength(3);
      expect(electronics.every(product => product.category === 'electronics')).toBe(true);
    });

    it('should find product with maximum price', () => {
      const maxPriceProduct = businessLogic.getProductWithMaxPrice(mockProducts);
      expect(maxPriceProduct.price).toBe(999);
      expect(maxPriceProduct.name).toBe('Laptop');
    });
  });

  describe('Lodash Deprecated Methods', () => {
    it('should use _.where for filtering', () => {
      const result = _.where(mockUsers, { active: true });
      expect(result).toHaveLength(3);
    });

    it('should use _.pluck for property extraction', () => {
      const result = _.pluck(mockUsers, 'name');
      expect(result).toEqual(['John', 'Jane', 'Bob', 'Alice']);
    });

    it('should use _.max for finding maximum', () => {
      const result = _.max(mockUsers, 'age');
      expect(result.age).toBe(35);
    });

    it('should use _.contains for existence check', () => {
      const result = _.contains([1, 2, 3], 2);
      expect(result).toBe(true);
    });

    it('should use _.first for first element', () => {
      const result = _.first(mockUsers);
      expect(result.id).toBe(1);
    });

    it('should use _.rest for remaining elements', () => {
      const result = _.rest(mockUsers);
      expect(result).toHaveLength(3);
      expect(result[0].id).toBe(2);
    });

    it('should use _.compact for removing falsy values', () => {
      const result = _.compact([1, null, 2, undefined, 3, 0, 4]);
      expect(result).toEqual([1, 2, 3, 4]);
    });

    it('should use _.flatten for flattening arrays', () => {
      const result = _.flatten([[1, 2], [3, 4], [5]]);
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it('should use _.reject for filtering out elements', () => {
      const result = _.reject(mockUsers, { active: false });
      expect(result).toHaveLength(3);
    });
  });
}); 