const registerServiceWorker = () => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/service-worker.js')
          .then(registration => {
            console.log('ServiceWorker registration successful:', registration);
          })
          .catch(err => {
            console.log('ServiceWorker registration failed:', err);
          });
      });
    }
  };
  
  export default registerServiceWorker;