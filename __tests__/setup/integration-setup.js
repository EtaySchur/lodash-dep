// Integration test setup
// This file handles setup and teardown for integration tests that need a running server

let server;

beforeAll(async () => {
  // Start server for integration tests
  const app = require('../../server');
  server = app.listen(0); // Use random port
});

afterAll(async () => {
  // Clean up server after all integration tests
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
});

// Helper to get the server's port
global.getTestServerPort = () => {
  return server ? server.address().port : 3000;
}; 