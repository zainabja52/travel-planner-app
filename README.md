# 🌍 Travel Planner 🗺️

## Overview
A web app that helps users plan trips by integrating location data, weather forecasts, and destination images. Features include date validation, offline support, and saved trip management.

## 🎥 Demo


https://github.com/user-attachments/assets/5d641932-8aeb-4288-9a7c-911d516cc2e9



## ✨ Features
- **📅 Trip Planning**: Enter destination and date for weather forecasts
- **📸 Image Integration**: Displays destination images from Pixabay
- **💾 Saved Trips**: Stores travel plans in local storage
- **🚫 Duplicate Check**: Prevents multiple trips on the same date
- **📶 Offline Support**: Works without internet connection
- **🖼️ Default Image**: Fallback image when no photo available
- **📱 Responsive Design**: Works on all devices

## 🛠 Tech Stack
<img align="left" alt="JavaScript" width="50px" src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" />
<img align="left" alt="Node.js" width="50px" src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg" />
<img align="left" alt="Express" width="50px" src="https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original.svg" />
<img align="left" alt="SCSS" width="50px" src="https://raw.githubusercontent.com/devicons/devicon/master/icons/sass/sass-original.svg" />
<img align="left" alt="Webpack" width="50px" src="https://www.svgrepo.com/show/306960/webpack.svg" />
<img align="left" alt="Workbox" width="50px" src="https://avatars.githubusercontent.com/u/17530649?s=200&v=4" />
<br><br>

## 🚀 Installation
```bash
git clone https://github.com/zainabja52/travel-planner-app.git
cd travel-planner-app
npm install
```

## 💻 Usage
1. **Development mode**:
```bash
npm run build-dev
npm start
```

2. **Production build**:
```bash
npm run build-prod
npm start
```

3. **Test suite**:
```bash
npm test
npm run test-coverage
```

## 🌐 API Integrations
```javascript
// Weatherbit API integration example
app.post('/api/weatherbit', async (req, res) => {
  try {
    const { lat, lon, days } = req.body;
    const endpoint = days <= 7 ? 'current' : 'forecast/daily';
    const response = await fetch(
      `https://api.weatherbit.io/v2.0/${endpoint}?lat=${lat}&lon=${lon}&key=${process.env.WEATHERBIT_KEY}&units=M`
    );
    // ...
  } catch (error) {
    // Error handling
  }
});
```

## 📂 Project Structure
```
travel-planner/
├── src/
│   ├── client/
│   │   ├── js/          # React components and logic
│   │   ├── styles/      # SCSS styling modules
│   │   └── views/       # HTML templates
│   ├── server/          # Express API endpoints
│   └── __test__/        # Jest test suites
├── public/              # Static assets
├── webpack/             # Build configurations
└── dist/                # Production build output
```

## 🌟 Advanced Features
### Service Worker Implementation
```javascript
// Service worker registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker registered:', registration.scope);
      });
  });
}
```

### Date Validation
```javascript
// Prevent duplicate trips
handleFormSubmit = async (e) => {
  // ...
  const isDuplicate = existingTrips.some(trip => trip.departureDate === departure);
  if (isDuplicate) {
    showError('A trip already exists for this date.');
    return;
  }
  // ...
};
```


