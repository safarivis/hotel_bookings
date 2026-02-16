// Mock data for demo mode (when no API key is configured)

import { Hotel, HotelRate } from './types';

export const mockHotels: Hotel[] = [
  {
    id: 'hotel-1',
    name: 'Grand Plaza Hotel',
    starRating: 5,
    address: '123 Luxury Avenue',
    city: 'Cape Town',
    country: 'South Africa',
    latitude: -33.9249,
    longitude: 18.4241,
    thumbnail: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80',
    ],
    description: 'Experience luxury at its finest in the heart of Cape Town. Our 5-star hotel offers breathtaking views of Table Mountain, world-class dining, and exceptional service.',
    amenities: ['Free WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Room Service', 'Parking'],
    reviewScore: 9.2,
    reviewCount: 1847,
  },
  {
    id: 'hotel-2',
    name: 'Ocean View Resort',
    starRating: 4,
    address: '456 Beach Road',
    city: 'Cape Town',
    country: 'South Africa',
    latitude: -33.9180,
    longitude: 18.4232,
    thumbnail: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=80',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&q=80',
    ],
    description: 'Wake up to stunning ocean views every morning. Perfect for families and couples seeking a relaxing beach getaway with modern amenities.',
    amenities: ['Free WiFi', 'Pool', 'Beach Access', 'Restaurant', 'Kids Club', 'Parking'],
    reviewScore: 8.7,
    reviewCount: 923,
  },
  {
    id: 'hotel-3',
    name: 'City Center Inn',
    starRating: 3,
    address: '789 Main Street',
    city: 'Cape Town',
    country: 'South Africa',
    latitude: -33.9258,
    longitude: 18.4232,
    thumbnail: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200&q=80',
    ],
    description: 'Affordable comfort in the city center. Walking distance to major attractions, shopping, and dining. Perfect for budget-conscious travelers.',
    amenities: ['Free WiFi', 'Breakfast', 'Parking', '24/7 Reception'],
    reviewScore: 8.1,
    reviewCount: 456,
  },
  {
    id: 'hotel-4',
    name: 'The Waterfront Boutique',
    starRating: 5,
    address: '10 Waterfront Drive',
    city: 'Cape Town',
    country: 'South Africa',
    latitude: -33.9036,
    longitude: 18.4207,
    thumbnail: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&q=80',
    ],
    description: 'Intimate luxury at the V&A Waterfront. Our boutique hotel combines personalized service with sophisticated design in Cape Town\'s most vibrant location.',
    amenities: ['Free WiFi', 'Pool', 'Spa', 'Restaurant', 'Bar', 'Concierge', 'Valet Parking'],
    reviewScore: 9.5,
    reviewCount: 312,
  },
  {
    id: 'hotel-5',
    name: 'Mountain View Lodge',
    starRating: 4,
    address: '55 Table Mountain Road',
    city: 'Cape Town',
    country: 'South Africa',
    latitude: -33.9628,
    longitude: 18.4098,
    thumbnail: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1200&q=80',
    ],
    description: 'Nestled at the foot of Table Mountain, our lodge offers a peaceful retreat with stunning natural surroundings. Perfect for hikers and nature lovers.',
    amenities: ['Free WiFi', 'Garden', 'Restaurant', 'Hiking Trails', 'Parking', 'Bicycle Rental'],
    reviewScore: 8.9,
    reviewCount: 678,
  },
  {
    id: 'hotel-6',
    name: 'Backpackers Paradise',
    starRating: 2,
    address: '22 Long Street',
    city: 'Cape Town',
    country: 'South Africa',
    latitude: -33.9220,
    longitude: 18.4195,
    thumbnail: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1200&q=80',
    ],
    description: 'Social atmosphere and unbeatable prices on Long Street. Dorm beds and private rooms available. The best spot for solo travelers and backpackers.',
    amenities: ['Free WiFi', 'Shared Kitchen', 'Lounge', 'Lockers', 'Tours Desk'],
    reviewScore: 7.8,
    reviewCount: 1203,
  },
];

export const mockRates: Record<string, HotelRate[]> = {
  'hotel-1': [
    { hotelId: 'hotel-1', roomType: 'Deluxe Room', boardType: 'Bed & Breakfast', price: 2500, currency: 'ZAR', cancellationPolicy: 'Free cancellation until 24h before', rateId: 'rate-1a' },
    { hotelId: 'hotel-1', roomType: 'Suite', boardType: 'Half Board', price: 4200, currency: 'ZAR', cancellationPolicy: 'Non-refundable', rateId: 'rate-1b' },
  ],
  'hotel-2': [
    { hotelId: 'hotel-2', roomType: 'Ocean View Room', boardType: 'Room Only', price: 1800, currency: 'ZAR', cancellationPolicy: 'Free cancellation until 48h before', rateId: 'rate-2a' },
    { hotelId: 'hotel-2', roomType: 'Family Suite', boardType: 'Bed & Breakfast', price: 2800, currency: 'ZAR', cancellationPolicy: 'Free cancellation until 24h before', rateId: 'rate-2b' },
  ],
  'hotel-3': [
    { hotelId: 'hotel-3', roomType: 'Standard Room', boardType: 'Bed & Breakfast', price: 850, currency: 'ZAR', cancellationPolicy: 'Free cancellation until 24h before', rateId: 'rate-3a' },
  ],
  'hotel-4': [
    { hotelId: 'hotel-4', roomType: 'Luxury Suite', boardType: 'Bed & Breakfast', price: 5500, currency: 'ZAR', cancellationPolicy: 'Free cancellation until 72h before', rateId: 'rate-4a' },
    { hotelId: 'hotel-4', roomType: 'Penthouse', boardType: 'Full Board', price: 12000, currency: 'ZAR', cancellationPolicy: 'Non-refundable', rateId: 'rate-4b' },
  ],
  'hotel-5': [
    { hotelId: 'hotel-5', roomType: 'Garden View', boardType: 'Room Only', price: 1400, currency: 'ZAR', cancellationPolicy: 'Free cancellation until 24h before', rateId: 'rate-5a' },
    { hotelId: 'hotel-5', roomType: 'Mountain View', boardType: 'Bed & Breakfast', price: 1900, currency: 'ZAR', cancellationPolicy: 'Free cancellation until 24h before', rateId: 'rate-5b' },
  ],
  'hotel-6': [
    { hotelId: 'hotel-6', roomType: 'Dorm Bed', boardType: 'Room Only', price: 250, currency: 'ZAR', cancellationPolicy: 'Free cancellation until 12h before', rateId: 'rate-6a' },
    { hotelId: 'hotel-6', roomType: 'Private Room', boardType: 'Room Only', price: 650, currency: 'ZAR', cancellationPolicy: 'Free cancellation until 24h before', rateId: 'rate-6b' },
  ],
};

export function getMockHotels(destination?: string): Hotel[] {
  if (!destination) return mockHotels;
  const search = destination.toLowerCase();
  return mockHotels.filter(
    h => h.city.toLowerCase().includes(search) || h.country.toLowerCase().includes(search)
  );
}

export function getMockHotel(id: string): Hotel | undefined {
  return mockHotels.find(h => h.id === id);
}

export function getMockRates(hotelId: string): HotelRate[] {
  return mockRates[hotelId] || [];
}
