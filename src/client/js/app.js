import '../styles/main.scss';

// DOM Elements with null checks
const getElement = (id) => document.getElementById(id) || console.error(`Element ${id} not found`);
let elements = {};

const initializeElements = () => {
  elements = {
    travelForm: document.getElementById('travelForm'),
    resultsDiv: document.getElementById('results'),
    errorDiv: document.getElementById('error'),
    destination: document.getElementById('destination'),
    countdown: document.getElementById('countdown'),
    destinationImage: document.getElementById('destinationImage'),
    temperature: document.getElementById('temperature'),
    conditions: document.getElementById('conditions'),
    feelsLike: document.getElementById('feelsLike'),
    savedTrips: document.getElementById('savedTrips')
  };
};

document.addEventListener('DOMContentLoaded', () => {
  initializeElements();
  if (elements.travelForm) {
    elements.travelForm.addEventListener('submit', handleFormSubmit);
  }
  if (elements.savedTrips) {
    elements.savedTrips.addEventListener('click', handleRemoveTrip);
  }
  loadSavedTrips();
});

// API Utilities
const api = {
  geonames: async (location) => {
    const response = await fetch('http://localhost:3000/api/geonames', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ location }),
    });
    return handleResponse(response);
  },

  weatherbit: async (lat, lon, days) => {
    const response = await fetch('http://localhost:3000/api/weatherbit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lat, lon, days }),
    });
    return handleResponse(response);
  },

  pixabay: async (query) => {
    const response = await fetch('http://localhost:3000/api/pixabay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    return handleResponse(response);
  }
};

const handleResponse = async (response) => {
  if (!response.ok) throw new Error('API request failed');
  return response.json();
};

const calculateTripDetails = (departure) => {
  const today = new Date();
  const tripDate = new Date(departure);
  const timeDiff = tripDate - today;
  const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
  
  return {
    daysLeft,
    isPast: daysLeft < 0,
    isValid: !isNaN(daysLeft) && timeDiff !== 0
  };
};

// Save trip to localStorage
const saveTrip = (tripData) => {
  try {
    const trips = JSON.parse(localStorage.getItem('trips') || '[]');
    trips.push(tripData);
    localStorage.setItem('trips', JSON.stringify(trips));
  } catch (error) {
    console.error('Failed to save trip:', error);
  }
};

// Load and render saved trips
const loadSavedTrips = () => {
  try {
    const trips = JSON.parse(localStorage.getItem('trips') || '[]');
    const container = elements.savedTrips;

    if (!container) return;

    container.innerHTML = trips.length ? 
      trips.map((trip, index) => `
        <div class="trip-card" data-index="${index}">
          <div class="trip-info">
            <h3>${trip.city || 'Unknown'}, ${trip.country || 'Unknown'}</h3>
            <p class="date">Date: ${trip.departureDate}</p>
            <p class="countdown">${trip.daysLeft >= 0 
              ? `${trip.daysLeft} days left` 
              : 'Trip completed'}</p>
            <button class="remove-btn">Remove</button>
          </div>
        </div>
      `).join('') : 
      `<div class="empty-state">
        <p class="empty-message">No saved trips yet. Start planning!</p>
      </div>`;
  } catch (error) {
    console.error('Failed to load trips:', error);
    if (elements.errorDiv) {
      elements.errorDiv.textContent = 'Error loading saved trips';
    }
  }
};

// UI Update Helpers
const safeUpdate = (element, content) => element && (element.textContent = content);
const safeSrcUpdate = (element, src) => element && (element.src = src);

const updateUI = ({ city, country, weather, image, daysLeft, departureDate }) => {
  safeUpdate(elements.destination, `${city}, ${country}`);
  safeUpdate(elements.countdown, daysLeft >= 0 ? `${daysLeft} Days Left` : 'Trip Date Passed!');
  safeSrcUpdate(elements.destinationImage, image || '/assets/default.jpg');
  
  safeUpdate(elements.temperature, `${weather.temp}°C`);
  safeUpdate(elements.conditions, weather.description);
  safeUpdate(elements.feelsLike, `${weather.feels_like}°C`);

  if (elements.resultsDiv) {
    elements.resultsDiv.classList.remove('hidden');
  }

  saveTrip({ 
    city, 
    country, 
    daysLeft, 
    departureDate,
    weather: {
      temp: weather.temp,
      description: weather.description,
      feels_like: weather.feels_like
    }
  });
  loadSavedTrips();
};

// Event Handlers
const handleRemoveTrip = (e) => {
  if (e.target.classList.contains('remove-btn')) {
    const tripCard = e.target.closest('.trip-card');
    const index = parseInt(tripCard?.dataset.index);
    
    if (!isNaN(index)) {
      try {
        const trips = JSON.parse(localStorage.getItem('trips') || '[]');
        trips.splice(index, 1);
        localStorage.setItem('trips', JSON.stringify(trips));
        loadSavedTrips();
      } catch (error) {
        console.error('Failed to remove trip:', error);
      }
    }
  }
};

const handleFormSubmit = async (e) => {
  e.preventDefault();
  safeUpdate(elements.errorDiv, '');

  const location = document.getElementById('location')?.value?.trim();
  const departure = document.getElementById('departureDate')?.value;
  const { daysLeft, isPast, isValid } = calculateTripDetails(departure);

  if (!location || !departure) {
    safeUpdate(elements.errorDiv, 'Please fill all fields');
    return;
  }

  if (!isValid) {
    safeUpdate(elements.errorDiv, 'Invalid date selected');
    return;
  }

  // Check for duplicate dates
  const existingTrips = JSON.parse(localStorage.getItem('trips') || '[]');
  const isDuplicate = existingTrips.some(trip => trip.departureDate === departure);
  
  if (isDuplicate) {
    safeUpdate(elements.errorDiv, 'A trip already exists for this date.');
    return;
  }

  try {
    const geo = await api.geonames(location);
    const weather = await api.weatherbit(geo.lat, geo.lng, daysLeft);
    
    // Fetch image with fallback
    let image;
    try {
      image = await api.pixabay(location);
    } catch (pixErr) {
      console.error('Pixabay error:', pixErr);
      image = '/assets/default.jpg';
    }

    updateUI({
      city: geo.name,
      country: geo.country,
      weather,
      image,
      daysLeft,
      departureDate: departure
    });
  } catch (err) {
    if (!navigator.onLine) {
      safeUpdate(elements.errorDiv, 'Offline: Check your internet connection.');
    } else {
      console.error(err);
      safeUpdate(elements.errorDiv, isPast ? 
        'Cannot plan past trips' : 
        'Failed to fetch data. Check your API keys and try again.'
      );
    }
  }
};

// Service Worker
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => console.log('SW registered:', registration.scope))
      .catch(error => console.error('SW registration failed:', error));
  });
}

export {
  calculateTripDetails,
  saveTrip,
  loadSavedTrips,
  handleResponse,
  initializeElements
};
