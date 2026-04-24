/**
 * server.test.js
 * 
 * Tests for the devops-demo-app API endpoints.
 * 
 * These tests verify that the server responds correctly to HTTP requests.
 * They run automatically in the CI pipeline on every push to GitHub.
 * 
 * To run manually: npm test
 */

const request = require('supertest');
const os = require('os');

// Import the app without starting the server.
// See server.js — we export `app` so tests can load it directly.
const app = require('../server');

// ─────────────────────────────────────────────
// /health endpoint
// ─────────────────────────────────────────────
describe('GET /health', () => {

  test('responds with HTTP 200', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
  });

  test('responds with the text "OK"', async () => {
    const response = await request(app).get('/health');
    expect(response.text).toBe('OK');
  });

});

// ─────────────────────────────────────────────
// /api/info endpoint
// ─────────────────────────────────────────────
describe('GET /api/info', () => {

  test('responds with HTTP 200', async () => {
    const response = await request(app).get('/api/info');
    expect(response.status).toBe(200);
  });

  test('responds with JSON content type', async () => {
    const response = await request(app).get('/api/info');
    expect(response.headers['content-type']).toMatch(/json/);
  });

  test('response body contains required fields', async () => {
    const response = await request(app).get('/api/info');
    const body = response.body;

    expect(body).toHaveProperty('version');
    expect(body).toHaveProperty('environment');
    expect(body).toHaveProperty('hostname');
    expect(body).toHaveProperty('uptime');
    expect(body).toHaveProperty('serverTime');
  });

  test('version matches package.json', async () => {
    const response = await request(app).get('/api/info');
    expect(response.body.version).toBe('1.0.0');
  });

  test('hostname matches the current machine', async () => {
    const response = await request(app).get('/api/info');
    expect(response.body.hostname).toBe(os.hostname());
  });

  test('uptime is a positive number', async () => {
    const response = await request(app).get('/api/info');
    expect(typeof response.body.uptime).toBe('number');
    expect(response.body.uptime).toBeGreaterThan(0);
  });

  test('serverTime is a valid ISO 8601 date string', async () => {
    const response = await request(app).get('/api/info');
    const parsed = new Date(response.body.serverTime);
    expect(parsed.toString()).not.toBe('Invalid Date');
  });

  test('environment defaults to "development" when NODE_ENV is unset', async () => {
    // NODE_ENV is not set in the test environment by default
    const response = await request(app).get('/api/info');
    expect(response.body.environment).toBe(process.env.NODE_ENV || 'development');
  });

});
