// Hotel data types for LiteAPI integration

export interface Hotel {
  id: string;
  name: string;
  starRating: number;
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  thumbnail: string;
  images: string[];
  description: string;
  amenities: string[];
  reviewScore: number;
  reviewCount: number;
}

export interface HotelRate {
  hotelId: string;
  roomType: string;
  boardType: string;
  price: number;
  originalPrice?: number; // Price before markup
  currency: string;
  cancellationPolicy: string;
  rateId: string;
  offerId?: string; // LiteAPI offer ID for booking
}

export interface SearchParams {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
  limit?: number;
  offset?: number;
}

export interface SearchResult {
  hotels: Hotel[];
  total: number;
  hasMore: boolean;
}

export interface GuestDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface PrebookData {
  prebookId: string;
  transactionId: string;
  secretKey: string;
}

export interface BookingConfirmation {
  bookingId: string;
  confirmationCode: string;
  hotelName: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  currency: string;
  guestName: string;
  status: string;
}
