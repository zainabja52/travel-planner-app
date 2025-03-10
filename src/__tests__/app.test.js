import { 
  calculateTripDetails,
  saveTrip,
  loadSavedTrips,
  handleResponse,
  initializeElements
} from '../client/js/app.js';

describe('Client-Side Functions', () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = `
      <form id="travelForm">
        <input id="location">
        <input id="departureDate">
      </form>
      <div id="results"></div>
      <div id="error"></div>
      <div id="savedTrips"></div>
      <div id="destination"></div>
      <div id="countdown"></div>
      <img id="destinationImage">
      <div id="temperature"></div>
      <div id="conditions"></div>
      <div id="feelsLike"></div>
    `;
    initializeElements();
  });

  describe('calculateTripDetails', () => {
    it('should calculate days remaining', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 5);
      const result = calculateTripDetails(futureDate.toISOString().split('T')[0]);
      
      expect(result.daysLeft).toBe(5);
      expect(result.isPast).toBe(false);
    });

    it('should detect past dates', () => {
      const pastDate = new Date('2020-01-01');
      const result = calculateTripDetails(pastDate.toISOString().split('T')[0]);
      
      expect(result.isPast).toBe(true);
    });
  });

  describe('Local Storage', () => {
    it('should save and load trips', () => {
      const mockTrip = { city: 'Paris', country: 'France', daysLeft: 10 };
      
      saveTrip(mockTrip);
      const trips = JSON.parse(localStorage.getItem('trips'));
      
      expect(trips).toHaveLength(1);
      expect(trips[0].city).toBe('Paris');
    });

    it('should handle empty storage', () => {
      loadSavedTrips();
      expect(document.getElementById('savedTrips').textContent)
        .toContain('Start planning!');
    });
}); // Fixed missing closing bracket here

  describe('handleResponse', () => {
    it('should throw error for failed responses', async () => {
      const mockResponse = {
        ok: false,
        json: () => Promise.resolve({ error: 'Test error' })
      };
      
      await expect(handleResponse(mockResponse)).rejects.toThrow('API request failed');
    });
  });
});