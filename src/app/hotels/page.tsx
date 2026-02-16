import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchForm from '@/components/SearchForm';
import HotelList from '@/components/HotelList';

interface PageProps {
  searchParams: Promise<{
    destination?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: string;
  }>;
}

export default async function HotelsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const destination = params.destination || 'Paris';
  const checkIn = params.checkIn || '';
  const checkOut = params.checkOut || '';
  const guests = parseInt(params.guests || '2');

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Search Bar */}
      <section className="border-b border-gray-100 py-4">
        <div className="max-w-[980px] mx-auto px-6">
          <SearchForm minimal />
        </div>
      </section>

      {/* Results */}
      <main className="flex-1 py-12">
        <div className="max-w-[980px] mx-auto px-6">
          <h1 className="text-3xl font-semibold text-[#1d1d1f] tracking-tight mb-2">
            Hotels in {destination}
          </h1>
          <p className="text-gray-500 mb-8">
            Find your perfect accommodation
          </p>

          <HotelList
            destination={destination}
            checkIn={checkIn}
            checkOut={checkOut}
            guests={guests}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
