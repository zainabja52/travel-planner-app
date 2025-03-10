const request = require('supertest');
const { app } = require('../server/server');

// Mock node-fetch properly for ES modules
// server.test.js (modify the mock setup)
jest.mock('node-fetch', () => ({
  __esModule: true,
  default: jest.fn(() => Promise.resolve({
    ok: true,
    json: () => Promise.resolve({})
  }))
}));

const fetch = require('node-fetch');

describe('API Endpoints', () => {
  beforeEach(() => {
    fetch.default.mockReset();
  });

  describe('POST /api/geonames', () => {
    it('should return coordinates for valid location', async () => {
      fetch.default.mockResolvedValue({
        ok: true,
        json: () => ({
          geonames: [{
            name: 'Paris',
            countryName: 'France',
            lat: '48.8589',
            lng: '2.3470'
          }]
        })
      });

      const res = await request(app)
        .post('/api/geonames')
        .send({ location: 'Paris' });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('lat', '48.8589');
      expect(res.body).toHaveProperty('lng', '2.3470');
    });

    it('should handle missing location', async () => {
      const res = await request(app)
        .post('/api/geonames')
        .send({});

      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toBe('Location required');
    });
  });

  describe('POST /api/weatherbit', () => {
    const mockCoords = { lat: 48.8589, lon: 2.3470, days: 3 };

    it('should return current weather', async () => {
      fetch.default.mockResolvedValue({
        ok: true,
        json: () => ({
          data: [{
            temp: 15,
            weather: { description: 'Cloudy', icon: 'c01d' },
            app_temp: 13,
            precip: 0
          }]
        })
      });

      const res = await request(app)
        .post('/api/weatherbit')
        .send(mockCoords);

      expect(res.statusCode).toEqual(200);
      expect(res.body.temp).toBe(15);
    });
  });

  describe('POST /api/pixabay', () => {
    it('should return image URL', async () => {
      fetch.default.mockResolvedValue({
        ok: true,
        json: () => ({
          hits: [{ webformatURL: 'paris.jpg' }]
        })
      });

      const res = await request(app)
        .post('/api/pixabay')
        .send({ query: 'Paris' });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBe('paris.jpg');
    });
  });
});