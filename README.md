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

## Prerequisites
- **Node.js**: Version 20.16.0.
- **npm**: Version 9 or higher.

To check your Node.js and npm versions, run:
```bash
node -v
npm -v
```

If you need to install or update Node.js, download it from the [official website](https://nodejs.org/).

## 🚀 Installation
```bash
git clone https://github.com/zainabja52/travel-planner-app.git
cd travel-planner-app
npm install
```

## 💻 Usage
Two terminals are needed:
- **Client-Side** (Webpack Dev Server):
  ```bash
  cd travel-planner-app\src\client
  npm run build-dev
  ```
- **Server-Side** (Express Server):
  ```bash
  cd travel-planner-app
  npm start
  ```
### **Testing Instructions**
for running tests:
```bash
cd travel-planner-app
npm test
```

## 📂 Project Structure
```
travel-planner-app/
├── src/
│   ├── client/
│   │   ├── js/          # React components and logic
│   │   ├── styles/      # SCSS styling modules
│   │   └── views/       # HTML templates
│   ├── server/          # Express API endpoints
│   └── __test__/        # Jest test suites
├── public/              # Static assets
├── webpack.dev.js
├── webpack.prod.js
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