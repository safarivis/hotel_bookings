import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BookingForm from '@/components/BookingForm';
import { getHotel, getHotelRates } from '@/lib/liteapi';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    checkIn?: string;
    checkOut?: string;
    guests?: string;
  }>;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <div
          key={star}
          className={`w-2 h-2 rounded-full ${star <= rating ? 'bg-[#1d1d1f]' : 'bg-gray-200'}`}
        />
      ))}
    </div>
  );
}

export default async function HotelDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const search = await searchParams;

  const hotel = await getHotel(id);

  if (!hotel) {
    notFound();
  }

  const checkIn = search.checkIn || new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const checkOut = search.checkOut || new Date(Date.now() + 172800000).toISOString().split('T')[0];
  const guests = parseInt(search.guests || '2');

  const rates = await getHotelRates(id, checkIn, checkOut, guests);

  const nights = Math.ceil(
    (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000
  );

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Breadcrumb */}
      <div className="border-b border-gray-100">
        <div className="max-w-[980px] mx-auto px-6 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-400 hover:text-gray-600">Home</Link>
            <span className="text-gray-300">/</span>
            <Link href="/hotels" className="text-gray-400 hover:text-gray-600">Hotels</Link>
            <span className="text-gray-300">/</span>
            <span className="text-[#1d1d1f]">{hotel.name}</span>
          </nav>
        </div>
      </div>

      <main className="flex-1">
        {/* Hero Image */}
        <div className="max-w-[980px] mx-auto px-6 py-8">
          <div className="grid grid-cols-4 gap-3 h-[400px]">
            <div className="col-span-2 row-span-2 relative rounded-3xl overflow-hidden">
              <Image
                src={hotel.thumbnail}
                alt={hotel.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            {hotel.images.slice(0, 2).map((img, i) => (
              <div key={i} className="relative rounded-2xl overflow-hidden">
                <Image
                  src={img}
                  alt={`${hotel.name} - ${i + 2}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
            {hotel.images.length < 2 && (
              <div className="relative rounded-2xl overflow-hidden bg-[#f5f5f7]" />
            )}
            {hotel.images.length < 1 && (
              <div className="relative rounded-2xl overflow-hidden bg-[#f5f5f7]" />
            )}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-[980px] mx-auto px-6 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-10">
              {/* Header */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <StarRating rating={hotel.starRating} />
                  <span className="text-xs text-gray-400 uppercase tracking-wider">
                    {hotel.starRating} Star Hotel
                  </span>
                </div>
                <h1 className="text-4xl font-semibold text-[#1d1d1f] tracking-tight mb-2">
                  {hotel.name}
                </h1>
                <p className="text-gray-500 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {hotel.address}, {hotel.city}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-4 mt-6 p-4 bg-[#f5f5f7] rounded-2xl">
                  <div className="text-3xl font-semibold text-[#1d1d1f]">
                    {hotel.reviewScore.toFixed(1)}
                  </div>
                  <div>
                    <p className="font-medium text-[#1d1d1f]">
                      {hotel.reviewScore >= 9 ? 'Exceptional' : hotel.reviewScore >= 8 ? 'Excellent' : 'Very Good'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {hotel.reviewCount.toLocaleString()} reviews
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-xl font-semibold text-[#1d1d1f] mb-4">About</h2>
                <p className="text-gray-600 leading-relaxed">{hotel.description}</p>
              </div>

              {/* Amenities */}
              <div>
                <h2 className="text-xl font-semibold text-[#1d1d1f] mb-4">Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {hotel.amenities.map((amenity) => (
                    <div
                      key={amenity}
                      className="flex items-center gap-2 p-3 bg-[#f5f5f7] rounded-xl"
                    >
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rooms */}
              <div>
                <h2 className="text-xl font-semibold text-[#1d1d1f] mb-2">Available Rooms</h2>
                <p className="text-sm text-gray-500 mb-6">
                  {nights} {nights === 1 ? 'night' : 'nights'} · {checkIn} → {checkOut}
                </p>

                {rates.length === 0 ? (
                  <div className="p-8 bg-[#f5f5f7] rounded-2xl text-center">
                    <p className="text-gray-500">No rooms available for these dates.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {rates.map((rate) => (
                      <div
                        key={rate.rateId}
                        className="p-5 bg-white border border-gray-100 rounded-2xl hover:border-gray-200 hover:shadow-sm transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-[#1d1d1f]">{rate.roomType}</h3>
                            <p className="text-sm text-gray-500">{rate.boardType}</p>
                            <p className="text-xs text-green-600 mt-1">{rate.cancellationPolicy}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-semibold text-[#1d1d1f]">
                              {rate.currency} {(rate.price * nights).toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-400">
                              {rate.currency} {rate.price}/night
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Booking */}
            <div className="lg:col-span-1">
              <div className="sticky top-20">
                <BookingForm
                  hotelId={hotel.id}
                  hotelName={hotel.name}
                  rates={rates}
                  checkIn={checkIn}
                  checkOut={checkOut}
                  guests={guests}
                  nights={nights}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
