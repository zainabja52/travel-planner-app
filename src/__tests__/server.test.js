import request from 'supertest';
import app from '../server/server.js';

// Mock entire node-fetch module
jest.mock('node-fetch', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('Server API Endpoints', () => {
  beforeAll(() => {
    // Setup test environment variables
    process.env.GEONAMES_USER = 'test_geonames';
    process.env.WEATHERBIT_KEY = 'test_weatherbit';
    process.env.PIXABAY_KEY = 'test_pixabay';
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  // Test root endpoint
  test('GET / - serves main application', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/html/);
  });

  // Geonames API tests
  describe('Geonames API Integration', () => {
    test('should return location data for valid city', async () => {
      // Mock successful Geonames response
      const mockGeonamesData = {
        geonames: [{
          name: 'London',
          countryName: 'United Kingdom',
          lat: '51.5085',
          lng: '-0.1257'
        }]
      };

      require('node-fetch').default.mockResolvedValue({
        ok: true,
        json: () => mockGeonamesData
      });

      const response = await request(app)
        .post('/api/geonames')
        .send({ location: 'London' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        name: 'London',
        country: 'United Kingdom',
        lat: '51.5085',
        lng: '-0.1257'
      });
    });

    test('should handle empty Geonames response', async () => {
      require('node-fetch').default.mockResolvedValue({
        ok: true,
        json: () => ({ geonames: [] })
      });

      const response = await request(app)
        .post('/api/geonames')
        .send({ location: 'InvalidCityName' });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'City not found' });
    });
  });

  // Weatherbit API tests
  describe('Weatherbit API Integration', () => {
    test('should return current weather for upcoming trip', async () => {
      const mockWeatherData = {
        data: [{
          temp: 15.6,
          weather: {
            description: 'Cloudy',
            icon: 'c04d'
          }
        }]
      };

      require('node-fetch').default.mockResolvedValue({
        ok: true,
        json: () => mockWeatherData
      });

      const response = await request(app)
        .post('/api/weatherbit')
        .send({ lat: 51.5085, lon: -0.1257, days: 3 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        temp: 15.6,
        description: 'Cloudy',
        icon: 'c04d'
      });
    });

    test('should return forecast for future trip', async () => {
      const mockForecastData = {
        data: [
          { temp: 16, weather: { description: 'Sunny', icon: 'c01d' } },
          { temp: 17, weather: { description: 'Clear', icon: 'c01n' } }
        ]
      };

      require('node-fetch').default.mockResolvedValue({
        ok: true,
        json: () => mockForecastData
      });

      const response = await request(app)
        .post('/api/weatherbit')
        .send({ lat: 51.5085, lon: -0.1257, days: 10 });

      expect(response.status).toBe(200);
      expect(response.body.temp).toBe(16); // First day's temp
    });
  });

  // Pixabay API tests
  describe('Pixabay API Integration', () => {
    test('should return image URL for valid query', async () => {
      const mockPixabayData = {
        hits: [{
          webformatURL: 'https://pixabay.com/london-image.jpg'
        }]
      };

      require('node-fetch').default.mockResolvedValue({
        ok: true,
        json: () => mockPixabayData
      });

      const response = await request(app)
        .post('/api/pixabay')
        .send({ query: 'London' });

      expect(response.status).toBe(200);
      expect(response.body).toBe('https://pixabay.com/london-image.jpg');
    });

    test('should handle empty Pixabay results', async () => {
      require('node-fetch').default.mockResolvedValue({
        ok: true,
        json: () => ({ hits: [] })
      });

      const response = await request(app)
        .post('/api/pixabay')
        .send({ query: 'InvalidLocation' });

      expect(response.status).toBe(200);
      expect(response.body).toMatch(/default\.jpg$/);
    });
  });

  // Error handling tests
  describe('Error Handling', () => {
    test('should handle Geonames API failure', async () => {
      require('node-fetch').default.mockRejectedValue(new Error('API Down'));

      const response = await request(app)
        .post('/api/geonames')
        .send({ location: 'Paris' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to fetch location data' });
    });

    test('should handle invalid date format', async () => {
      const response = await request(app)
        .post('/api/weatherbit')
        .send({ lat: 'invalid', lon: 'data', days: 'nan' });

      expect(response.status).toBe(400);
    });
  });
});