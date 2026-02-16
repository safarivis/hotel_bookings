'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { searchCities } from '@/lib/fuzzy-search';

function getDefaultDates() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date();
  dayAfter.setDate(dayAfter.getDate() + 2);
  return {
    checkIn: tomorrow.toISOString().split('T')[0],
    checkOut: dayAfter.toISOString().split('T')[0],
    minDate: tomorrow.toISOString().split('T')[0],
  };
}

export default function SearchForm({ minimal = false }: { minimal?: boolean }) {
  const router = useRouter();
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [minDate, setMinDate] = useState('');
  const [guests, setGuests] = useState(2);
  const [mounted, setMounted] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dates = getDefaultDates();
    setCheckIn(dates.checkIn);
    setCheckOut(dates.checkOut);
    setMinDate(dates.minDate);
    setMounted(true);
  }, []);

  // Update suggestions when destination changes
  useEffect(() => {
    if (destination.length >= 2) {
      const results = searchCities(destination);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [destination]);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      selectSuggestion(suggestions[selectedIndex]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (city: string) => {
    setDestination(city);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) return;
    setShowSuggestions(false);
    const params = new URLSearchParams({
      destination: destination.trim(),
      checkIn,
      checkOut,
      guests: guests.toString(),
    });
    router.push(`/hotels?${params.toString()}`);
  };

  const SuggestionsDropdown = () => {
    if (!showSuggestions || suggestions.length === 0) return null;

    return (
      <div
        ref={suggestionsRef}
        className="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
      >
        {suggestions.map((city, index) => (
          <button
            key={city}
            type="button"
            onClick={() => selectSuggestion(city)}
            className={`w-full px-4 py-3 text-left text-[15px] flex items-center gap-3 transition-colors ${
              index === selectedIndex
                ? 'bg-gray-100'
                : 'hover:bg-gray-50'
            }`}
          >
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{city}</span>
          </button>
        ))}
      </div>
    );
  };

  if (minimal) {
    return (
      <form onSubmit={handleSearch} className="w-full">
        <div className="flex items-center gap-3 bg-[#f5f5f7] rounded-2xl p-2">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              placeholder="Where to?"
              className="w-full px-4 py-3 bg-transparent text-[15px] placeholder:text-gray-400 focus:outline-none"
              autoComplete="off"
              required
            />
            <SuggestionsDropdown />
          </div>
          <button
            type="submit"
            disabled={!mounted}
            className="px-6 py-3 bg-[#1d1d1f] text-white text-sm font-medium rounded-xl hover:bg-black transition-colors disabled:opacity-50"
          >
            Search
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSearch} className="w-full max-w-3xl mx-auto">
      <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/50 p-8 border border-gray-100">
        <div className="space-y-6">
          {/* Destination - Large input with autocomplete */}
          <div className="relative">
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
              Destination
            </label>
            <input
              ref={inputRef}
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              placeholder="Where would you like to go?"
              className="w-full px-0 py-3 text-2xl font-light text-gray-900 placeholder:text-gray-300 border-0 border-b-2 border-gray-100 focus:border-gray-900 focus:ring-0 bg-transparent transition-colors"
              autoComplete="off"
              required
            />
            <SuggestionsDropdown />
          </div>

          {/* Date and Guests Row */}
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                Check in
              </label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                min={minDate}
                className="w-full px-0 py-2 text-base text-gray-900 border-0 border-b border-gray-200 focus:border-gray-900 focus:ring-0 bg-transparent"
                required
                disabled={!mounted}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                Check out
              </label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                min={checkIn}
                className="w-full px-0 py-2 text-base text-gray-900 border-0 border-b border-gray-200 focus:border-gray-900 focus:ring-0 bg-transparent"
                required
                disabled={!mounted}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                Guests
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full px-0 py-2 text-base text-gray-900 border-0 border-b border-gray-200 focus:border-gray-900 focus:ring-0 bg-transparent appearance-none cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? 'Guest' : 'Guests'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            disabled={!mounted}
            className="w-full py-4 bg-[#1d1d1f] text-white text-base font-medium rounded-2xl hover:bg-black transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            Search Hotels
          </button>
        </div>
      </div>
    </form>
  );
}
