import { calculateDays, updateUI } from '../client/js/app';

describe('Client-Side Functions', () => {
  describe('calculateDays()', () => {
    test('Returns correct days difference', () => {
      const today = new Date();
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + 5);
      
      const result = calculateDays(futureDate.toISOString().split('T')[0]);
      expect(result).toBe(5);
    });
  });

  describe('updateUI()', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <div id="results" class="hidden">
          <h2 id="destination"></h2>
          <div id="countdown"></div>
          <img id="destinationImage">
          <p id="temperature"></p>
        </div>
      `;
    });

    test('Updates DOM elements correctly', () => {
      const mockData = {
        city: 'Paris',
        country: 'France',
        days: 5,
        image: 'test.jpg',
        weather: {
          temp: 20,
          icon: 'c01d',
          description: 'Clear sky'
        }
      };

      updateUI(mockData);
      
      expect(document.getElementById('destination').textContent)
        .toBe('Paris, France');
      expect(document.getElementById('countdown').textContent)
        .toBe('5 Days Left');
    });
  });
});