const request = require('supertest');
const app = require('../index'); // Assuming your Express app file is named index.js

describe('GET /test', () => {
  it('responds with status 200 and the message "Test endpoint is working!"', async () => {
    const response = await request(app).get('/test');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Test endpoint is working!');
  });
});
