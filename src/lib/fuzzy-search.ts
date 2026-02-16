// Fuzzy search utility for destination autocomplete

// All supported cities (from liteapi.ts CITY_COUNTRY_MAP)
export const CITIES = [
  // Popular destinations first
  'London', 'Paris', 'New York', 'Tokyo', 'Dubai', 'Singapore', 'Barcelona',
  'Rome', 'Amsterdam', 'Bangkok', 'Sydney', 'Los Angeles', 'Miami', 'Istanbul',

  // South Africa
  'Cape Town', 'Johannesburg', 'Durban', 'Pretoria', 'Stellenbosch', 'Knysna',
  'Port Elizabeth', 'Franschhoek', 'Hermanus', 'Plettenberg Bay', 'George',
  'Bloemfontein', 'Polokwane', 'Nelspruit', 'Kruger', 'Sun City',

  // United Kingdom
  'Manchester', 'Birmingham', 'Edinburgh', 'Glasgow', 'Liverpool', 'Bristol',
  'Leeds', 'Oxford', 'Cambridge', 'Bath', 'York', 'Brighton', 'Cardiff',
  'Belfast', 'Newcastle', 'Nottingham', 'Sheffield',

  // France
  'Nice', 'Lyon', 'Marseille', 'Bordeaux', 'Toulouse', 'Strasbourg', 'Cannes',
  'Montpellier', 'Nantes', 'Lille', 'Monaco',

  // United States
  'Las Vegas', 'San Francisco', 'Chicago', 'Boston', 'Seattle', 'Washington',
  'Orlando', 'San Diego', 'Denver', 'Atlanta', 'Dallas', 'Houston', 'Phoenix',
  'New Orleans', 'Nashville', 'Austin', 'Philadelphia', 'Honolulu', 'Hawaii',

  // Canada
  'Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa', 'Quebec City',
  'Victoria', 'Whistler', 'Banff', 'Niagara Falls',

  // Australia & NZ
  'Melbourne', 'Brisbane', 'Perth', 'Gold Coast', 'Cairns', 'Adelaide',
  'Auckland', 'Queenstown', 'Wellington', 'Christchurch',

  // Europe
  'Berlin', 'Munich', 'Frankfurt', 'Hamburg', 'Milan', 'Venice', 'Florence',
  'Naples', 'Madrid', 'Seville', 'Valencia', 'Malaga', 'Ibiza', 'Lisbon',
  'Porto', 'Brussels', 'Bruges', 'Zurich', 'Geneva', 'Vienna', 'Salzburg',
  'Prague', 'Budapest', 'Warsaw', 'Krakow', 'Copenhagen', 'Stockholm', 'Oslo',
  'Helsinki', 'Reykjavik', 'Athens', 'Santorini', 'Mykonos', 'Dublin',
  'Dubrovnik', 'Split',

  // Asia
  'Kyoto', 'Osaka', 'Hong Kong', 'Shanghai', 'Beijing', 'Seoul', 'Busan',
  'Taipei', 'Phuket', 'Chiang Mai', 'Bali', 'Kuala Lumpur', 'Hanoi',
  'Ho Chi Minh', 'Manila', 'Siem Reap', 'Mumbai', 'Delhi', 'Goa', 'Jaipur',

  // Middle East
  'Abu Dhabi', 'Doha', 'Tel Aviv', 'Jerusalem', 'Amman', 'Petra',

  // Africa
  'Cairo', 'Marrakech', 'Casablanca', 'Nairobi', 'Zanzibar', 'Mauritius',
  'Maldives', 'Seychelles', 'Victoria Falls',

  // Caribbean & Latin America
  'Cancun', 'Mexico City', 'Havana', 'Punta Cana', 'Jamaica', 'Bahamas',
  'Barbados', 'Aruba', 'Rio de Janeiro', 'Sao Paulo', 'Buenos Aires',
  'Lima', 'Cusco', 'Machu Picchu', 'Bogota', 'Cartagena', 'Fiji', 'Bora Bora',
];

// Levenshtein distance for fuzzy matching
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

// Search cities with fuzzy matching
export function searchCities(query: string, limit = 8): string[] {
  if (!query || query.length < 2) return [];

  const normalized = query.toLowerCase().trim();

  // Score each city
  const scored = CITIES.map(city => {
    const cityLower = city.toLowerCase();

    // Exact start match gets highest priority
    if (cityLower.startsWith(normalized)) {
      return { city, score: 0 };
    }

    // Contains match
    if (cityLower.includes(normalized)) {
      return { city, score: 1 };
    }

    // Fuzzy match using Levenshtein distance
    const distance = levenshteinDistance(normalized, cityLower.substring(0, normalized.length + 2));

    // Allow up to 2 character differences for short queries, 3 for longer
    const maxDistance = normalized.length <= 4 ? 2 : 3;

    if (distance <= maxDistance) {
      return { city, score: 2 + distance };
    }

    return { city, score: 100 }; // No match
  });

  // Filter and sort by score
  return scored
    .filter(s => s.score < 100)
    .sort((a, b) => a.score - b.score)
    .slice(0, limit)
    .map(s => s.city);
}
