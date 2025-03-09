import '../styles/main.scss';

// DOM Elements with null checks
const getElement = (id) => document.getElementById(id) || console.error(`Element ${id} not found`);
const elements = {
  travelForm: getElement('travelForm'),
  resultsDiv: getElement('results'),
  errorDiv: getElement('error'),
  destination: getElement('destination'),
  countdown: getElement('countdown'),
  destinationImage: getElement('destinationImage'),
  temperature: getElement('temperature'),
  conditions: getElement('conditions'),
  feelsLike: getElement('feelsLike'),
  savedTrips: getElement('savedTrips')
};

// API Utilities
const api = {
  geonames: async (location) => {
    const response = await fetch('/api/geonames', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ location }),
    });
    return handleResponse(response);
  },

  weatherbit: async (lat, lon, days) => {
    const response = await fetch('/api/weatherbit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lat, lon, days }),
    });
    return handleResponse(response);
  },

  pixabay: async (query) => {
    const response = await fetch('/api/pixabay', {
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

// Trip Calculations
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

// Local Storage
const saveTrip = (tripData) => {
  const trips = JSON.parse(localStorage.getItem('trips') || '[]');
  trips.push(tripData);
  localStorage.setItem('trips', JSON.stringify(trips));
};

const loadSavedTrips = () => {
  const trips = JSON.parse(localStorage.getItem('trips') || '[]');
  if (elements.savedTrips) {
    elements.savedTrips.innerHTML = trips.map((trip, index) => `
      <div class="trip-card" data-index="${index}">
        <h4>${trip.city}, ${trip.country}</h4>
        <p>${trip.daysLeft} Days Left</p>
        <button class="remove-btn">Remove</button>
      </div>
    `).join('');
  }
};

// UI Updates
const safeUpdate = (element, content) => element && (element.textContent = content);
const safeSrcUpdate = (element, src) => element && (element.src = src);

const updateUI = ({ city, country, weather, image, daysLeft }) => {
  safeUpdate(elements.destination, `${city}, ${country}`);
  safeUpdate(elements.countdown, daysLeft >= 0 ? `${daysLeft} Days Left` : 'Trip Date Passed!');
  safeSrcUpdate(elements.destinationImage, image || './assets/default.jpg');
  
  safeUpdate(elements.temperature, `${weather.temp}°C`);
  safeUpdate(elements.conditions, weather.description);
  safeUpdate(elements.feelsLike, `${weather.feels_like}°C`);

  if (elements.resultsDiv) {
    elements.resultsDiv.classList.remove('hidden');
  }

  saveTrip({ city, country, daysLeft, image });
  loadSavedTrips();
};

// Event Handlers
const handleRemoveTrip = (e) => {
  if (e.target.classList.contains('remove-btn')) {
    const tripCard = e.target.closest('.trip-card');
    const index = parseInt(tripCard.dataset.index);
    
    if (!isNaN(index)) {
      const trips = JSON.parse(localStorage.getItem('trips') || '[]');
      trips.splice(index, 1);
      localStorage.setItem('trips', JSON.stringify(trips));
      loadSavedTrips();
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

  try {
    const geo = await api.geonames(location);
    const weather = await api.weatherbit(geo.lat, geo.lng, daysLeft);
    const image = await api.pixabay(location);
    
    updateUI({
      city: geo.name,
      country: geo.country,
      weather,
      image,
      daysLeft
    });
  } catch (err) {
    console.error(err);
    safeUpdate(elements.errorDiv, isPast ? 
      'Cannot plan past trips' : 
      'Failed to fetch data. Try again.'
    );
  }
};

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  if (elements.travelForm) {
    elements.travelForm.addEventListener('submit', handleFormSubmit);
  }
  if (elements.savedTrips) {
    elements.savedTrips.addEventListener('click', handleRemoveTrip);
  }
  loadSavedTrips();
});

// Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('SW registered:', registration.scope);
      })
      .catch(error => {
        console.log('SW registration failed:', error);
      });
  });
}