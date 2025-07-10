# Legacy Node.js App with Deprecated Express and Lodash Methods

This is a **purposefully legacy** Node.js application that demonstrates deprecated and removed methods from Express 4.17.x and Lodash 3.10.0. This project is designed for educational purposes to understand what methods were deprecated and why.

## ⚠️ WARNING

This application uses **deprecated and removed methods** on purpose. Do not use this code in production or as a reference for modern development. This is purely for educational purposes to understand legacy code patterns.

## Prerequisites

- **Node.js**: Version 12.x (oldest version that supports Express 4.17.x)
- **npm**: Version 6.x or higher

## Installation

```bash
npm install
```

This will install:
- Express 4.17.1 (legacy version)
- Lodash 3.10.0 (legacy version with deprecated methods)

## Running the Application

```bash
npm start
```

The server will start on port 3000.

## Deprecated Methods Used

### Express 4.17.x Deprecated Methods

1. **`app.configure()`** - Removed in Express 4.x
   - Used in `server.js` for middleware configuration
   - Modern alternative: Direct middleware registration

2. **`app.router`** - Deprecated
   - Used in `server.js` for router setup
   - Modern alternative: `express.Router()`

3. **`req.param()`** - Deprecated
   - Used throughout the application for parameter access
   - Modern alternative: `req.params`, `req.query`, or `req.body`

4. **`res.sendfile()`** - Deprecated
   - Used in `middleware/deprecated.js` for file serving
   - Modern alternative: `res.sendFile()`

5. **`res.jsonp()`** - Deprecated
   - Used in multiple routes for JSONP responses
   - Modern alternative: `res.json()` with callback parameter

6. **`app.del()`** - Deprecated
   - Used in routes for DELETE endpoints
   - Modern alternative: `app.delete()`

### Lodash 3.10.0 Deprecated/Removed Methods

1. **`_.max()`** - Removed in v4.0.0
   - Used for finding maximum values
   - Modern alternative: `_.maxBy()`

2. **`_.pluck()`** - Removed in v4.0.0
   - Used for extracting property values from objects
   - Modern alternative: `_.map()` with property shorthand

3. **`_.where()`** - Removed in v4.0.0
   - Used for filtering objects by properties
   - Modern alternative: `_.filter()`

4. **`_.contains()`** - Removed in v4.0.0
   - Used for checking if value exists in collection
   - Modern alternative: `_.includes()`

5. **`_.first()`** - Removed in v4.0.0
   - Used for getting first element
   - Modern alternative: Array destructuring `[first] = array`

6. **`_.rest()`** - Removed in v4.0.0
   - Used for getting all elements except first
   - Modern alternative: `_.tail()`

7. **`_.compact()`** - Still exists but heavily deprecated
   - Used for removing falsy values
   - Modern alternative: `_.filter()` with Boolean

8. **`_.flatten()`** - Behavior changed in v4.0.0
   - Used for flattening nested arrays
   - Modern alternative: `_.flattenDeep()` or `_.flattenDepth()`

## API Endpoints

### Main Routes (`server.js`)

- `GET /api/users` - Get all users using deprecated methods
- `GET /api/users/:id` - Get user by ID using deprecated methods
- `GET /api/scores` - Get user scores using deprecated array methods
- `GET /api/products` - Get products using deprecated methods
- `POST /api/users` - Create user using deprecated methods
- `DEL /api/users/:id` - Delete user using deprecated methods

### Legacy Routes (`routes/legacy.js`)

- `GET /legacy-data` - Demonstrate multiple deprecated Lodash methods
- `GET /array-operations` - Show deprecated array manipulation methods
- `GET /legacy-params/:id/:action` - Use deprecated parameter handling
- `POST /legacy-create` - Create items using deprecated methods
- `DEL /legacy-delete/:id` - Delete items using deprecated methods

## Middleware

The application includes several middleware files demonstrating deprecated patterns:

- `middleware/deprecated.js` - Contains various deprecated middleware functions
- Legacy authentication using deprecated methods
- Legacy error handling
- Legacy logging and data transformation

## Legacy Package.json Features

- Uses older dependency specification format
- Includes peer dependencies
- Uses older scripts format
- No modern fields like "type", "exports", etc.

## Testing the Deprecated Methods

You can test the deprecated methods using curl or any HTTP client:

```bash
# Test deprecated user endpoints
curl http://localhost:3000/api/users
curl http://localhost:3000/api/users/1

# Test deprecated array operations
curl http://localhost:3000/api/scores

# Test deprecated product endpoints
curl http://localhost:3000/api/products

# Test legacy routes
curl http://localhost:3000/legacy-data
curl http://localhost:3000/array-operations
```

## Why These Methods Were Deprecated

### Express Deprecations
- **`app.configure()`**: Removed to simplify middleware setup
- **`req.param()`**: Ambiguous parameter source, replaced with specific methods
- **`res.sendfile()`**: Security concerns, replaced with `sendFile()`
- **`res.jsonp()`**: JSONP is considered insecure, modern apps use CORS

### Lodash Deprecations
- **`_.max()`**: Inconsistent behavior, replaced with `_.maxBy()`
- **`_.pluck()`**: Redundant with `_.map()`, removed for consistency
- **`_.where()`**: Redundant with `_.filter()`, removed for consistency
- **`_.contains()`**: Renamed to `_.includes()` for clarity
- **`_.first()`**: Redundant with array destructuring
- **`_.rest()`**: Renamed to `_.tail()` for clarity

## Modern Alternatives

If you were to modernize this code, you would:

1. **Express 4.17.x → Express 5.x**
   - Replace `req.param()` with `req.params`, `req.query`, or `req.body`
   - Replace `res.sendfile()` with `res.sendFile()`
   - Replace `app.del()` with `app.delete()`
   - Remove `app.configure()` usage

2. **Lodash 3.10.0 → Lodash 4.x**
   - Replace `_.max()` with `_.maxBy()`
   - Replace `_.pluck()` with `_.map()` + property shorthand
   - Replace `_.where()` with `_.filter()`
   - Replace `_.contains()` with `_.includes()`
   - Replace `_.first()` with array destructuring
   - Replace `_.rest()` with `_.tail()`

## Educational Value

This project demonstrates:
- How legacy code patterns look and behave
- Why certain methods were deprecated
- The evolution of JavaScript libraries
- How to identify and modernize legacy code
- Common anti-patterns in older Node.js applications

## License

MIT - This is for educational purposes only. 