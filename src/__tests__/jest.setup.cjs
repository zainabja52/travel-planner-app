// src/__tests__/setup.js
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;


// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    clear: () => { store = {}; },
    removeItem: (key) => { delete store[key]; }
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
);

document.body.innerHTML = `
  <form id="travelForm">
    <input id="location">
    <input id="departureDate">
  </form>
  <div id="results"></div>
  <div id="error"></div>
  <div id="destination"></div>
  <div id="countdown"></div>
  <img id="destinationImage">
  <div id="temperature"></div>
  <div id="conditions"></div>
  <div id="feelsLike"></div>
  <div id="savedTrips"></div>
`;