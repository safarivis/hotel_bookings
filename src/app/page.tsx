import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchForm from '@/components/SearchForm';
import Link from 'next/link';

const destinations = [
  { name: 'Paris', country: 'France', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80' },
  { name: 'Tokyo', country: 'Japan', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80' },
  { name: 'New York', country: 'United States', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80' },
  { name: 'London', country: 'United Kingdom', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80' },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-20 md:py-32">
        <div className="text-center mb-12 max-w-2xl">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold text-[#1d1d1f] tracking-tight mb-6">
            Travel,
            <br />
            <span className="text-gray-400">beautifully.</span>
          </h1>
          <p className="text-xl text-gray-500 font-light">
            Search over 2 million hotels worldwide.
            <br />
            Find your perfect stay.
          </p>
        </div>

        <SearchForm />
      </section>

      {/* Destinations */}
      <section className="bg-[#f5f5f7] py-20">
        <div className="max-w-[980px] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-semibold text-[#1d1d1f] tracking-tight mb-3">
              Popular destinations
            </h2>
            <p className="text-lg text-gray-500">
              Explore trending cities around the world
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {destinations.map((dest) => (
              <Link
                key={dest.name}
                href={`/hotels?destination=${encodeURIComponent(dest.name)}`}
                className="group relative aspect-[3/4] rounded-3xl overflow-hidden"
              >
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-white font-semibold text-lg">{dest.name}</h3>
                  <p className="text-white/70 text-sm">{dest.country}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-[980px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-12 h-12 bg-[#f5f5f7] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#1d1d1f] mb-2">Best Price Guarantee</h3>
              <p className="text-sm text-gray-500">
                Find a lower price and we&apos;ll match it.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-[#f5f5f7] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#1d1d1f] mb-2">Free Cancellation</h3>
              <p className="text-sm text-gray-500">
                Flexible booking on most properties.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-[#f5f5f7] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#1d1d1f] mb-2">24/7 Support</h3>
              <p className="text-sm text-gray-500">
                We&apos;re here whenever you need us.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#1d1d1f]">
        <div className="max-w-[980px] mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight mb-4">
            Ready to explore?
          </h2>
          <p className="text-lg text-gray-400 mb-8">
            Start planning your next adventure today.
          </p>
          <Link
            href="/hotels"
            className="inline-flex px-8 py-4 bg-white text-[#1d1d1f] text-base font-medium rounded-full hover:bg-gray-100 transition-colors"
          >
            Browse Hotels
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
