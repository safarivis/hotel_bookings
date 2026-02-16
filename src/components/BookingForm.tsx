'use client';

import { useState, useEffect, useRef } from 'react';
import { HotelRate } from '@/lib/types';
import Script from 'next/script';

interface BookingFormProps {
  hotelId: string;
  hotelName: string;
  rates: HotelRate[];
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
}

type BookingStep = 'select' | 'details' | 'payment' | 'processing' | 'confirmed' | 'error';

interface PrebookData {
  prebookId: string;
  transactionId: string;
  secretKey: string;
}

declare global {
  interface Window {
    LiteAPIPayment: new (config: {
      publicKey: string;
      appearance: { theme: string };
      options: { business: { name: string } };
      targetElement: string;
      secretKey: string;
      returnUrl: string;
    }) => { handlePayment: () => void };
  }
}

export default function BookingForm({
  hotelName,
  rates,
  checkIn,
  checkOut,
  guests,
  nights,
}: BookingFormProps) {
  const [selectedRate, setSelectedRate] = useState<HotelRate | null>(rates[0] || null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingStep, setBookingStep] = useState<BookingStep>('select');
  const [prebookData, setPrebookData] = useState<PrebookData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [bookingConfirmation, setBookingConfirmation] = useState<{
    bookingId: string;
    confirmationCode: string;
  } | null>(null);
  const [guestDetails, setGuestDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const paymentContainerRef = useRef<HTMLDivElement>(null);

  const totalPrice = selectedRate ? selectedRate.price * nights : 0;

  // Handle payment completion (called when user returns from payment)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentComplete = urlParams.get('payment_complete');

    if (paymentComplete === 'true') {
      // Retrieve pending booking from sessionStorage
      const pendingBookingStr = sessionStorage.getItem('pendingBooking');
      if (pendingBookingStr) {
        const pendingBooking = JSON.parse(pendingBookingStr);
        setGuestDetails(pendingBooking.guestDetails);
        setShowBookingModal(true);
        setBookingStep('processing');

        // Complete the booking inline
        const finalizeBooking = async () => {
          try {
            const response = await fetch('/api/book', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                prebookId: pendingBooking.prebookId,
                transactionId: pendingBooking.transactionId,
                holder: {
                  firstName: pendingBooking.guestDetails.firstName,
                  lastName: pendingBooking.guestDetails.lastName,
                  email: pendingBooking.guestDetails.email,
                  phone: pendingBooking.guestDetails.phone,
                },
                guests: [{
                  firstName: pendingBooking.guestDetails.firstName,
                  lastName: pendingBooking.guestDetails.lastName,
                }],
                // Additional details for database storage
                hotelId: pendingBooking.hotelId,
                hotelName: pendingBooking.hotelName,
                roomType: pendingBooking.roomType,
                checkIn: pendingBooking.checkIn,
                checkOut: pendingBooking.checkOut,
                guestCount: pendingBooking.guests,
                nights: pendingBooking.nights,
                originalPrice: pendingBooking.originalPrice,
                totalPrice: pendingBooking.totalPrice,
                currency: pendingBooking.currency,
              }),
            });

            const data = await response.json();

            if (!data.success) {
              throw new Error(data.error || 'Booking failed');
            }

            setBookingConfirmation({
              bookingId: data.bookingId,
              confirmationCode: data.confirmationCode,
            });
            setBookingStep('confirmed');
          } catch (err) {
            console.error('Booking error:', err);
            setError(err instanceof Error ? err.message : 'Failed to complete booking');
            setBookingStep('error');
          }
        };

        finalizeBooking();

        // Clean up
        sessionStorage.removeItem('pendingBooking');
        // Remove query param from URL
        window.history.replaceState({}, '', window.location.pathname + window.location.search.replace('payment_complete=true', '').replace('?&', '?').replace(/\?$/, ''));
      }
    }
  }, []);

  // Initialize payment SDK when we have prebook data
  useEffect(() => {
    if (bookingStep === 'payment' && prebookData && sdkLoaded && paymentContainerRef.current) {
      try {
        // Store prebook data in sessionStorage for after payment redirect
        sessionStorage.setItem('pendingBooking', JSON.stringify({
          prebookId: prebookData.prebookId,
          transactionId: prebookData.transactionId,
          guestDetails,
          hotelName,
          hotelId: selectedRate?.hotelId,
          roomType: selectedRate?.roomType,
          checkIn,
          checkOut,
          guests,
          nights,
          originalPrice: selectedRate?.originalPrice || selectedRate?.price,
          totalPrice,
          currency: selectedRate?.currency,
        }));

        const config = {
          publicKey: 'sandbox', // Use 'live' for production
          appearance: { theme: 'flat' },
          options: { business: { name: 'Agentix Travel' } },
          targetElement: '#payment-container',
          secretKey: prebookData.secretKey,
          returnUrl: `${window.location.href.split('?')[0]}?payment_complete=true`,
        };

        const payment = new window.LiteAPIPayment(config);
        payment.handlePayment();
      } catch (err) {
        console.error('Payment SDK error:', err);
        setError('Failed to load payment form. Please try again.');
        setBookingStep('error');
      }
    }
  }, [bookingStep, prebookData, sdkLoaded, guestDetails, hotelName, selectedRate]);

  const handleReserve = () => {
    setShowBookingModal(true);
    setBookingStep('details');
    setError(null);
  };

  const handleContinueToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingStep('processing');
    setError(null);

    try {
      // Call prebook API
      const response = await fetch('/api/prebook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          offerId: selectedRate?.offerId || selectedRate?.rateId,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Prebook failed');
      }

      setPrebookData({
        prebookId: data.prebookId,
        transactionId: data.transactionId,
        secretKey: data.secretKey,
      });

      // Check if this is demo mode (no real payment needed)
      if (data.secretKey === 'demo-secret-key') {
        // Demo mode - skip payment, go straight to booking
        await completeBooking(data.prebookId, data.transactionId);
      } else {
        // Real mode - show payment form
        setBookingStep('payment');
      }
    } catch (err) {
      console.error('Prebook error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create booking session');
      setBookingStep('error');
    }
  };

  const completeBooking = async (prebookId: string, transactionId: string, details?: typeof guestDetails) => {
    setBookingStep('processing');
    const guest = details || guestDetails;

    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prebookId,
          transactionId,
          holder: {
            firstName: guest.firstName,
            lastName: guest.lastName,
            email: guest.email,
            phone: guest.phone,
          },
          guests: [{
            firstName: guest.firstName,
            lastName: guest.lastName,
          }],
          // Additional details for database storage
          hotelId: selectedRate?.hotelId,
          hotelName,
          roomType: selectedRate?.roomType,
          checkIn,
          checkOut,
          guestCount: guests,
          nights,
          originalPrice: selectedRate?.originalPrice || selectedRate?.price,
          totalPrice,
          currency: selectedRate?.currency,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Booking failed');
      }

      setBookingConfirmation({
        bookingId: data.bookingId,
        confirmationCode: data.confirmationCode,
      });
      setBookingStep('confirmed');
    } catch (err) {
      console.error('Booking error:', err);
      setError(err instanceof Error ? err.message : 'Failed to complete booking');
      setBookingStep('error');
    }
  };

  const resetBooking = () => {
    setShowBookingModal(false);
    setBookingStep('select');
    setPrebookData(null);
    setError(null);
    setBookingConfirmation(null);
    setGuestDetails({ firstName: '', lastName: '', email: '', phone: '' });
  };

  if (!selectedRate) {
    return (
      <div className="bg-[#f5f5f7] rounded-3xl p-6 text-center">
        <p className="text-gray-500">No rooms available</p>
      </div>
    );
  }

  return (
    <>
      {/* LiteAPI Payment SDK */}
      <Script
        src="https://payment-wrapper.liteapi.travel/dist/liteAPIPayment.js?v=a1"
        onLoad={() => setSdkLoaded(true)}
      />

      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
        {/* Price */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold text-[#1d1d1f]">
              {selectedRate.currency} {totalPrice.toLocaleString()}
            </span>
            <span className="text-gray-400">total</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {nights} {nights === 1 ? 'night' : 'nights'} · {selectedRate.currency} {selectedRate.price}/night
          </p>
        </div>

        {/* Details */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-[#f5f5f7] rounded-xl">
              <p className="text-xs text-gray-500 mb-1">Check-in</p>
              <p className="text-sm font-medium text-[#1d1d1f]">{checkIn}</p>
            </div>
            <div className="p-3 bg-[#f5f5f7] rounded-xl">
              <p className="text-xs text-gray-500 mb-1">Check-out</p>
              <p className="text-sm font-medium text-[#1d1d1f]">{checkOut}</p>
            </div>
          </div>

          <div className="p-3 bg-[#f5f5f7] rounded-xl">
            <p className="text-xs text-gray-500 mb-1">Guests</p>
            <p className="text-sm font-medium text-[#1d1d1f]">{guests} {guests === 1 ? 'Guest' : 'Guests'}</p>
          </div>

          {/* Room Selection */}
          {rates.length > 1 && (
            <div>
              <p className="text-xs text-gray-500 mb-2">Room Type</p>
              <select
                value={selectedRate.rateId}
                onChange={(e) => {
                  const rate = rates.find((r) => r.rateId === e.target.value);
                  if (rate) setSelectedRate(rate);
                }}
                className="w-full p-3 bg-[#f5f5f7] rounded-xl text-sm text-[#1d1d1f] border-0 focus:ring-2 focus:ring-[#1d1d1f]"
              >
                {rates.map((rate) => (
                  <option key={rate.rateId} value={rate.rateId}>
                    {rate.roomType} — {rate.currency} {rate.price}/night
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Selected Room */}
          <div className="p-4 border border-gray-100 rounded-xl">
            <p className="font-medium text-[#1d1d1f]">{selectedRate.roomType}</p>
            <p className="text-sm text-gray-500">{selectedRate.boardType}</p>
            <p className="text-xs text-green-600 mt-2">{selectedRate.cancellationPolicy}</p>
          </div>

          {/* Reserve Button */}
          <button
            onClick={handleReserve}
            className="w-full py-4 bg-[#1d1d1f] text-white font-medium rounded-2xl hover:bg-black transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Reserve
          </button>

          <p className="text-xs text-center text-gray-400">
            Secure payment powered by LiteAPI
          </p>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto">

            {/* Guest Details Step */}
            {bookingStep === 'details' && (
              <>
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-[#1d1d1f]">Guest Details</h2>
                    <button
                      onClick={resetBooking}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f5f5f7]"
                    >
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <form onSubmit={handleContinueToPayment} className="p-6 space-y-5">
                  {/* Summary */}
                  <div className="p-4 bg-[#f5f5f7] rounded-2xl">
                    <p className="font-medium text-[#1d1d1f]">{hotelName}</p>
                    <p className="text-sm text-gray-500">{selectedRate.roomType}</p>
                    <p className="text-sm text-gray-500">{checkIn} → {checkOut}</p>
                    <p className="font-semibold text-[#1d1d1f] mt-2">
                      {selectedRate.currency} {totalPrice.toLocaleString()}
                    </p>
                  </div>

                  {/* Guest Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">First name</label>
                      <input
                        type="text"
                        required
                        value={guestDetails.firstName}
                        onChange={(e) => setGuestDetails({ ...guestDetails, firstName: e.target.value })}
                        className="w-full p-3 bg-[#f5f5f7] rounded-xl text-sm border-0 focus:ring-2 focus:ring-[#1d1d1f]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Last name</label>
                      <input
                        type="text"
                        required
                        value={guestDetails.lastName}
                        onChange={(e) => setGuestDetails({ ...guestDetails, lastName: e.target.value })}
                        className="w-full p-3 bg-[#f5f5f7] rounded-xl text-sm border-0 focus:ring-2 focus:ring-[#1d1d1f]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={guestDetails.email}
                      onChange={(e) => setGuestDetails({ ...guestDetails, email: e.target.value })}
                      className="w-full p-3 bg-[#f5f5f7] rounded-xl text-sm border-0 focus:ring-2 focus:ring-[#1d1d1f]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Phone</label>
                    <input
                      type="tel"
                      required
                      value={guestDetails.phone}
                      onChange={(e) => setGuestDetails({ ...guestDetails, phone: e.target.value })}
                      className="w-full p-3 bg-[#f5f5f7] rounded-xl text-sm border-0 focus:ring-2 focus:ring-[#1d1d1f]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-[#1d1d1f] text-white font-medium rounded-2xl hover:bg-black transition-colors"
                  >
                    Continue to Payment
                  </button>
                </form>
              </>
            )}

            {/* Payment Step */}
            {bookingStep === 'payment' && (
              <>
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-[#1d1d1f]">Payment</h2>
                    <button
                      onClick={resetBooking}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f5f5f7]"
                    >
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  {/* Payment form will be injected here by LiteAPI SDK */}
                  <div id="payment-container" ref={paymentContainerRef} className="min-h-[300px]">
                    <div className="flex items-center justify-center h-[300px]">
                      <div className="w-8 h-8 border-2 border-[#1d1d1f] border-t-transparent rounded-full animate-spin" />
                    </div>
                  </div>

                  <p className="text-xs text-center text-gray-400 mt-4">
                    Secure payment powered by Stripe via LiteAPI
                  </p>
                </div>
              </>
            )}

            {/* Processing Step */}
            {bookingStep === 'processing' && (
              <div className="p-12 text-center">
                <div className="w-12 h-12 border-2 border-[#1d1d1f] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-lg font-medium text-[#1d1d1f]">Processing...</p>
                <p className="text-sm text-gray-500">Please wait while we confirm your booking</p>
              </div>
            )}

            {/* Confirmed Step */}
            {bookingStep === 'confirmed' && bookingConfirmation && (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-[#1d1d1f] mb-2">Booking Confirmed!</h2>
                <p className="text-gray-500 mb-6">
                  Your reservation at {hotelName} is confirmed.
                </p>

                <div className="space-y-3 mb-6">
                  <div className="p-4 bg-[#f5f5f7] rounded-2xl">
                    <p className="text-xs text-gray-500">Booking ID</p>
                    <p className="font-mono font-semibold text-lg text-[#1d1d1f]">
                      {bookingConfirmation.bookingId}
                    </p>
                  </div>
                  {bookingConfirmation.confirmationCode && (
                    <div className="p-4 bg-[#f5f5f7] rounded-2xl">
                      <p className="text-xs text-gray-500">Hotel Confirmation</p>
                      <p className="font-mono font-semibold text-lg text-[#1d1d1f]">
                        {bookingConfirmation.confirmationCode}
                      </p>
                    </div>
                  )}
                </div>

                <p className="text-sm text-gray-500 mb-6">
                  A confirmation email has been sent to {guestDetails.email}
                </p>

                <button
                  onClick={resetBooking}
                  className="px-8 py-3 bg-[#1d1d1f] text-white rounded-full hover:bg-black transition-colors"
                >
                  Done
                </button>
              </div>
            )}

            {/* Error Step */}
            {bookingStep === 'error' && (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-[#1d1d1f] mb-2">Booking Failed</h2>
                <p className="text-gray-500 mb-6">
                  {error || 'Something went wrong. Please try again.'}
                </p>

                <div className="flex gap-3 justify-center">
                  <button
                    onClick={resetBooking}
                    className="px-6 py-3 border border-gray-200 rounded-full hover:bg-[#f5f5f7] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setBookingStep('details')}
                    className="px-6 py-3 bg-[#1d1d1f] text-white rounded-full hover:bg-black transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
