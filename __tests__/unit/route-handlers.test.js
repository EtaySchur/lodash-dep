const _ = require('lodash');

// Mock Express request and response objects
const createMockRequest = (params = {}, query = {}, body = {}) => ({
  params,
  query,
  body,
  param: (name) => params[name] || query[name]
});

const createMockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.jsonp = jest.fn().mockReturnValue(res);
  res.sendfile = jest.fn().mockReturnValue(res);
  return res;
};

// Mock data
const mockUsers = [
  { id: 1, name: 'John', age: 30, active: true, scores: [85, 90, 88] },
  { id: 2, name: 'Jane', age: 25, active: false, scores: [92, 88, 95] },
  { id: 3, name: 'Bob', age: 35, active: true, scores: [78, 85, 82] }
];

const mockProducts = [
  { id: 1, name: 'Laptop', price: 999, category: 'electronics' },
  { id: 2, name: 'Phone', price: 699, category: 'electronics' },
  { id: 3, name: 'Book', price: 25, category: 'books' }
];

// Route handler functions (extracted from the actual routes)
const routeHandlers = {
  // GET /api/users
  getUsers: (req, res) => {
    const activeUsers = _.where(mockUsers, { active: true });
    const userNames = _.pluck(mockUsers, 'name');
    const maxAgeUser = _.max(mockUsers, 'age');
    const totalUsers = mockUsers.length;

    res.jsonp({
      message: 'API using old methods',
      activeUsers,
      userNames,
      maxAge: maxAgeUser.age,
      totalUsers
    });
  },

  // GET /api/users/:id
  getUserById: (req, res) => {
    const userId = parseInt(req.param('id'));
    const user = _.where(mockUsers, { id: userId })[0];

    if (user) {
      res.jsonp({
        user,
        found: true
      });
    } else {
      res.status(404).jsonp({
        error: 'User not found',
        found: false
      });
    }
  },

  // GET /api/scores
  getScores: (req, res) => {
    const allScores = [85, null, 90, undefined, 78, 0, 95];
    const compactScores = _.compact(allScores);
    const restScores = _.rest(allScores);
    const maxScore = _.max(allScores);

    res.jsonp({
      allScores,
      compactScores,
      restScores,
      maxScore
    });
  },

  // GET /api/products
  getProducts: (req, res) => {
    const category = req.query.category;
    
    if (category) {
      const filteredProducts = _.where(mockProducts, { category });
      res.jsonp(filteredProducts);
    } else {
      // Mock serving products.json file
      res.jsonp(mockProducts);
    }
  },

  // DELETE /api/users/:id
  deleteUser: (req, res) => {
    const userId = parseInt(req.param('id'));
    const userExists = _.contains(_.pluck(mockUsers, 'id'), userId);

    if (userExists) {
      const remainingUsers = _.reject(mockUsers, { id: userId });
      res.jsonp({
        message: 'User deleted',
        remainingUsers: remainingUsers.length
      });
    } else {
      res.status(404).jsonp({
        error: 'User not found'
      });
    }
  },

  // POST /api/users
  createUser: (req, res) => {
    const newUser = {
      id: mockUsers.length + 1,
      ...req.body
    };

    res.jsonp({
      message: 'User created',
      user: newUser
    });
  }
};

describe('Route Handler Unit Tests', () => {
  describe('GET /api/users', () => {
    it('should return users data with deprecated Lodash methods', () => {
      const req = createMockRequest();
      const res = createMockResponse();

      routeHandlers.getUsers(req, res);

      expect(res.jsonp).toHaveBeenCalledWith({
        message: 'API using old methods',
        activeUsers: expect.arrayContaining([
          expect.objectContaining({ active: true })
        ]),
        userNames: ['John', 'Jane', 'Bob'],
        maxAge: 35,
        totalUsers: 3
      });
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return user when found', () => {
      const req = createMockRequest({ id: '1' });
      const res = createMockResponse();

      routeHandlers.getUserById(req, res);

      expect(res.jsonp).toHaveBeenCalledWith({
        user: expect.objectContaining({ id: 1, name: 'John' }),
        found: true
      });
    });

    it('should return 404 when user not found', () => {
      const req = createMockRequest({ id: '999' });
      const res = createMockResponse();

      routeHandlers.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.jsonp).toHaveBeenCalledWith({
        error: 'User not found',
        found: false
      });
    });
  });

  describe('GET /api/scores', () => {
    it('should return processed scores data', () => {
      const req = createMockRequest();
      const res = createMockResponse();

      routeHandlers.getScores(req, res);

      expect(res.jsonp).toHaveBeenCalledWith({
        allScores: [85, null, 90, undefined, 78, 0, 95],
        compactScores: [85, 90, 78, 95],
        restScores: [null, 90, undefined, 78, 0, 95],
        maxScore: 95
      });
    });
  });

  describe('GET /api/products', () => {
    it('should filter products by category', () => {
      const req = createMockRequest({}, { category: 'electronics' });
      const res = createMockResponse();

      routeHandlers.getProducts(req, res);

      expect(res.jsonp).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ category: 'electronics' })
        ])
      );
    });

    it('should return all products when no category specified', () => {
      const req = createMockRequest();
      const res = createMockResponse();

      routeHandlers.getProducts(req, res);

      expect(res.jsonp).toHaveBeenCalledWith(mockProducts);
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete user when found', () => {
      const req = createMockRequest({ id: '1' });
      const res = createMockResponse();

      routeHandlers.deleteUser(req, res);

      expect(res.jsonp).toHaveBeenCalledWith({
        message: 'User deleted',
        remainingUsers: 2
      });
    });

    it('should return 404 when user not found', () => {
      const req = createMockRequest({ id: '999' });
      const res = createMockResponse();

      routeHandlers.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.jsonp).toHaveBeenCalledWith({
        error: 'User not found'
      });
    });
  });

  describe('POST /api/users', () => {
    it('should create new user', () => {
      const newUserData = {
        name: 'Test User',
        age: 25,
        active: true
      };
      const req = createMockRequest({}, {}, newUserData);
      const res = createMockResponse();

      routeHandlers.createUser(req, res);

      expect(res.jsonp).toHaveBeenCalledWith({
        message: 'User created',
        user: expect.objectContaining({
          id: 4,
          name: 'Test User',
          age: 25,
          active: true
        })
      });
    });
  });

  describe('Express Deprecated Methods', () => {
    it('should use req.param() for parameter access', () => {
      const req = createMockRequest({ id: '1' }, { category: 'electronics' });
      
      expect(req.param('id')).toBe('1');
      expect(req.param('category')).toBe('electronics');
    });

    it('should use res.jsonp() for responses', () => {
      const res = createMockResponse();
      
      res.jsonp({ test: 'data' });
      expect(res.jsonp).toHaveBeenCalledWith({ test: 'data' });
    });
  });
}); 