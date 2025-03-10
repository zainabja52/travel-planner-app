require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch').default;
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../dist')));
app.use('/assets', express.static(path.join(__dirname, '../../public/assets')));

// Geonames API
app.post('/api/geonames', async (req, res) => {
  try {
    const { location } = req.body;
    if (!location) return res.status(400).json({ error: 'Location required' });

    const response = await fetch(
      `http://api.geonames.org/searchJSON?q=${encodeURIComponent(location)}&maxRows=1&username=${process.env.GEONAMES_USER}`
    );

    const data = await response.json();
    if (!data.geonames?.length) return res.status(404).json({ error: 'Location not found' });

    res.json({
      name: data.geonames[0].name,
      country: data.geonames[0].countryName,
      lat: data.geonames[0].lat,
      lng: data.geonames[0].lng
    });
  } catch (error) {
    console.error('Geonames Error:', error);
    res.status(500).json({ error: 'Failed to fetch location data' });
  }
});

// Weatherbit API
app.post('/api/weatherbit', async (req, res) => {
  try {
    const { lat, lon, days } = req.body;
    if (!lat || !lon) return res.status(400).json({ error: 'Coordinates required' });

    const endpoint = days <= 7 ? 'current' : 'forecast/daily';
    const response = await fetch(
      `https://api.weatherbit.io/v2.0/${endpoint}?lat=${lat}&lon=${lon}&key=${process.env.WEATHERBIT_KEY}&units=M`
    );

    if (!response.ok) throw new Error('Weather API failed');

    const data = await response.json();
    if (!data.data?.length) return res.status(404).json({ error: 'Weather data not found' });

    const weatherData = data.data[0];
    const weather = {
      temp: weatherData.temp,
      description: weatherData.weather.description,
      icon: weatherData.weather.icon,
      feels_like: endpoint === 'current' ? weatherData.app_temp : weatherData.app_max_temp,
      precip: weatherData.precip || 0
    };

    res.json(weather);
  } catch (error) {
    console.error('Weatherbit Error:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// Pixabay API
app.post('/api/pixabay', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: 'Search query required' });

    const response = await fetch(
      `https://pixabay.com/api/?key=${process.env.PIXABAY_KEY}&q=${encodeURIComponent(query)}&image_type=photo&per_page=3`
    );

    const data = await response.json();
    res.json(data.hits[0]?.webformatURL || '/assets/default.jpg');
  } catch (error) {
    console.error('Pixabay Error:', error);
    res.status(500).json({ error: 'Failed to fetch image' });
  }
});

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = { app };