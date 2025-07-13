# Node.js App with Express and Lodash

This is a Node.js application that demonstrates various methods from Express 4.17.x and Lodash 3.10.0.

## Prerequisites

- **Node.js**: Version 12.x or higher
- **npm**: Version 6.x or higher

## Installation

```bash
npm install
```

This will install:
- Express 4.17.1
- Lodash 3.10.0

## Running the Application

```bash
npm start
```

The server will start on port 3000.

## Methods Used

### Express 4.17.x Methods

1. **`app.configure()`** - Middleware configuration
   - Used in `server.js` for middleware configuration

2. **`app.router`** - Router setup
   - Used in `server.js` for router setup

3. **`req.param()`** - Parameter access
   - Used throughout the application for parameter access

4. **`res.sendfile()`** - File serving
   - Used in `middleware/common.js` for file serving

5. **`res.jsonp()`** - JSONP responses
   - Used in multiple routes for JSONP responses

6. **`app.del()`** - DELETE endpoints
   - Used in routes for DELETE endpoints

### Lodash 3.10.0 Methods

1. **`_.max()`** - Finding maximum values
   - Used for finding maximum values

2. **`_.pluck()`** - Extracting property values
   - Used for extracting property values from objects

3. **`_.where()`** - Filtering objects
   - Used for filtering objects by properties

4. **`_.contains()`** - Checking value existence
   - Used for checking if value exists in collection

5. **`_.first()`** - Getting first element
   - Used for getting first element

6. **`_.rest()`** - Getting all elements except first
   - Used for getting all elements except first

7. **`_.compact()`** - Removing falsy values
   - Used for removing falsy values

8. **`_.flatten()`** - Flattening nested arrays
   - Used for flattening nested arrays

## API Endpoints

### Main Routes (`server.js`)

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `GET /api/scores` - Get user scores
- `GET /api/products` - Get products
- `POST /api/users` - Create user
- `DEL /api/users/:id` - Delete user

### Data Routes (`routes/data.js`)

- `GET /data` - Demonstrate multiple Lodash methods
- `GET /array-operations` - Show array manipulation methods
- `GET /params/:id/:action` - Use parameter handling
- `GET /product-analytics` - Product analytics using _.max, _.pairs, and _.filter
- `POST /create` - Create items
- `DEL /delete/:id` - Delete items

## Middleware

The application includes several middleware files:

- `middleware/common.js` - Contains various middleware functions
- Authentication using standard methods
- Error handling
- Logging and data transformation

## Package.json Features

- Uses dependency specification format
- Includes peer dependencies
- Uses standard scripts format

## Testing the Methods

You can test the methods using curl or any HTTP client:

```bash
# Test user endpoints
curl http://localhost:3000/api/users
curl http://localhost:3000/api/users/1

# Test array operations
curl http://localhost:3000/api/scores

# Test product endpoints
curl http://localhost:3000/api/products

# Test data routes
curl http://localhost:3000/api/data
curl http://localhost:3000/api/data/array-operations
curl http://localhost:3000/api/data/product-analytics
```

## Running Tests

The project includes comprehensive Jest unit tests for all functionality:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Coverage

The tests cover:
- **API Endpoints**: All server routes and their responses
- **Data Routes**: All data processing endpoints
- **Middleware**: All middleware functions and their behavior
- **Lodash Methods**: All deprecated Lodash methods usage
- **Combined Example**: Specific tests for the combined example endpoint
- **Edge Cases**: Error handling and boundary conditions

### Test Files

- `__tests__/server.test.js` - Tests for main server endpoints
- `__tests__/routes/data.test.js` - Tests for data routes
- `__tests__/middleware/common.test.js` - Tests for middleware functions
- `__tests__/combined-example.test.js` - Tests for the combined example endpoint

## License

MIT 