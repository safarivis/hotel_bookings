'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <Header />

      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-[980px] mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-semibold text-[#1d1d1f] tracking-tight">
            How It Works
          </h1>
          <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
            Simple, secure, and seamless hotel booking powered by global partnerships.
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20">
        <div className="max-w-[980px] mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white rounded-3xl p-8 text-center">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-[#1d1d1f] mb-3">Search & Compare</h3>
              <p className="text-gray-500">
                Search from over 2 million hotels worldwide. Compare prices, amenities, and reviews to find your perfect stay.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-3xl p-8 text-center">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-[#1d1d1f] mb-3">Book Securely</h3>
              <p className="text-gray-500">
                Your payment is processed through bank-grade encryption. We never store your card details on our servers.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-3xl p-8 text-center">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-[#1d1d1f] mb-3">Get Confirmation</h3>
              <p className="text-gray-500">
                Receive instant confirmation with your booking details. Your reservation is guaranteed directly with the hotel.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 bg-white">
        <div className="max-w-[980px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-[#1d1d1f] tracking-tight">
              Your Booking is Protected
            </h2>
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
              We partner with industry leaders to ensure every reservation is secure and guaranteed.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Card 1 */}
            <div className="border border-gray-200 rounded-2xl p-8">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#1d1d1f] mb-2">Secure Payments</h3>
              <p className="text-gray-500 text-sm">
                All transactions are encrypted with 256-bit SSL. Your payment information is processed through PCI DSS Level 1 compliant systems — the highest security standard in the industry.
              </p>
            </div>

            {/* Card 2 */}
            <div className="border border-gray-200 rounded-2xl p-8">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#1d1d1f] mb-2">Guaranteed Reservations</h3>
              <p className="text-gray-500 text-sm">
                Every booking is confirmed directly with the hotel. You'll receive an official confirmation number that the hotel recognizes — no third-party uncertainty.
              </p>
            </div>

            {/* Card 3 */}
            <div className="border border-gray-200 rounded-2xl p-8">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#1d1d1f] mb-2">Competitive Rates</h3>
              <p className="text-gray-500 text-sm">
                We aggregate rates from multiple hotel suppliers worldwide, giving you access to competitive pricing across thousands of properties.
              </p>
            </div>

            {/* Card 4 */}
            <div className="border border-gray-200 rounded-2xl p-8">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#1d1d1f] mb-2">AI-Powered Assistance</h3>
              <p className="text-gray-500 text-sm">
                Our AI assistant is available around the clock to answer questions about bookings, destinations, and travel tips. Get instant help whenever you need it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20">
        <div className="max-w-[980px] mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold text-[#1d1d1f] tracking-tight mb-4">
            Powered by Global Partnerships
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto mb-12">
            We connect directly to hotel inventory systems worldwide through LiteAPI, ensuring real-time availability and instant confirmations.
          </p>

          <div className="bg-white rounded-3xl p-12">
            <div className="grid grid-cols-3 gap-8 items-center opacity-60">
              <div className="text-2xl font-bold text-gray-400">LiteAPI</div>
              <div className="text-2xl font-bold text-gray-400">2M+ Hotels</div>
              <div className="text-2xl font-bold text-gray-400">190+ Countries</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-[680px] mx-auto px-6">
          <h2 className="text-3xl font-semibold text-[#1d1d1f] tracking-tight text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-[#1d1d1f] mb-2">Is my payment secure?</h3>
              <p className="text-gray-500 text-sm">
                Absolutely. Payments are processed through PCI DSS Level 1 certified payment systems. Your card details are handled securely and never stored on our servers.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-[#1d1d1f] mb-2">How are reservations confirmed?</h3>
              <p className="text-gray-500 text-sm">
                Your booking is confirmed directly with the hotel through our global distribution network. You&apos;ll receive an official confirmation number that the hotel recognizes.
              </p>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-[#1d1d1f] mb-2">Can I cancel or modify my booking?</h3>
              <p className="text-gray-500 text-sm">
                Yes, subject to the hotel&apos;s cancellation policy shown at booking. Free cancellation options are clearly marked when available.
              </p>
            </div>

            <div className="pb-6">
              <h3 className="text-lg font-medium text-[#1d1d1f] mb-2">How do I get help with my booking?</h3>
              <p className="text-gray-500 text-sm">
                Use our AI chat assistant for instant answers to common questions. For booking-specific issues, refer to your confirmation email which contains hotel contact details.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
