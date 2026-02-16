'use client';

import { useState, useEffect, useCallback } from 'react';
import HotelCard from './HotelCard';
import { Hotel } from '@/lib/types';

interface HotelListProps {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}

const HOTELS_PER_PAGE = 50;

export default function HotelList({ destination, checkIn, checkOut, guests }: HotelListProps) {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchString = new URLSearchParams({
    destination,
    checkIn,
    checkOut,
    guests: guests.toString(),
  }).toString();

  const fetchHotels = useCallback(async (offset: number, append: boolean = false) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const params = new URLSearchParams({
        destination,
        checkIn,
        checkOut,
        guests: guests.toString(),
        limit: HOTELS_PER_PAGE.toString(),
        offset: offset.toString(),
      });

      const response = await fetch(`/api/hotels?${params}`);
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (append) {
        setHotels(prev => [...prev, ...data.hotels]);
      } else {
        setHotels(data.hotels);
      }
      setTotal(data.total);
      setHasMore(data.hasMore);
      setError(null);
    } catch (err) {
      setError('Failed to load hotels');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [destination, checkIn, checkOut, guests]);

  useEffect(() => {
    fetchHotels(0, false);
  }, [fetchHotels]);

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      fetchHotels(hotels.length, true);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-3xl overflow-hidden border border-gray-100 animate-pulse">
            <div className="aspect-[16/10] bg-gray-100" />
            <div className="p-5 space-y-3">
              <div className="h-5 bg-gray-100 rounded-lg w-3/4" />
              <div className="h-4 bg-gray-100 rounded-lg w-1/2" />
              <div className="flex gap-2 mt-4">
                <div className="h-6 bg-gray-100 rounded-full w-16" />
                <div className="h-6 bg-gray-100 rounded-full w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-[#1d1d1f] mb-2">Something went wrong</h3>
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }

  if (hotels.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 bg-[#f5f5f7] rounded-3xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-[#1d1d1f] mb-2">No hotels found</h3>
        <p className="text-gray-500">Try a different destination or adjust your dates.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <p className="text-sm text-gray-500">
          Showing <span className="text-[#1d1d1f] font-medium">{hotels.length}</span> of{' '}
          <span className="text-[#1d1d1f] font-medium">{total.toLocaleString()}</span> hotels
        </p>
        <select className="text-sm text-gray-500 bg-transparent border-0 focus:ring-0 cursor-pointer">
          <option>Recommended</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
          <option>Rating</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {hotels.map((hotel) => (
          <HotelCard key={hotel.id} hotel={hotel} searchParams={searchString} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-12 text-center">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="px-8 py-4 bg-[#1d1d1f] text-white text-base font-medium rounded-2xl hover:bg-black transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingMore ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Loading...
              </span>
            ) : (
              `Load More Hotels (${(total - hotels.length).toLocaleString()} remaining)`
            )}
          </button>
        </div>
      )}
    </div>
  );
}
