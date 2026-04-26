// server.js
const express = require('express');
const path = require('path');
const os = require('os');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Environment variable
const NODE_ENV = process.env.NODE_ENV || 'development';

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to get server info
app.get('/api/info', (req, res) => {
  res.json({
    version: '2.0.0',
    environment: NODE_ENV,
    hostname: os.hostname(),
    uptime: os.uptime(),
    serverTime: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Export app for testing.
// Tests import `app` directly and do not call listen(),
// so no port conflict occurs when the test suite runs.
module.exports = app;

// Start the server only when this file is run directly
// (i.e., `node server.js`), not when imported by tests.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${NODE_ENV} mode`);
    console.log(`Server hostname: ${os.hostname()}`);
  });
}
