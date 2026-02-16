import Link from 'next/link';
import Image from 'next/image';
import { Hotel } from '@/lib/types';

interface HotelCardProps {
  hotel: Hotel;
  searchParams?: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <div
          key={star}
          className={`w-1.5 h-1.5 rounded-full ${star <= rating ? 'bg-[#1d1d1f]' : 'bg-gray-200'}`}
        />
      ))}
    </div>
  );
}

export default function HotelCard({ hotel, searchParams }: HotelCardProps) {
  const href = searchParams ? `/hotels/${hotel.id}?${searchParams}` : `/hotels/${hotel.id}`;

  return (
    <Link href={href} className="block group">
      <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-xl hover:shadow-gray-100/50 transition-all duration-300">
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={hotel.thumbnail}
            alt={hotel.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {/* Rating Badge */}
          <div className="absolute top-4 left-4">
            <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <span className="text-sm font-semibold text-[#1d1d1f]">{hotel.reviewScore.toFixed(1)}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <h3 className="text-lg font-semibold text-[#1d1d1f] group-hover:text-gray-600 transition-colors line-clamp-1">
                {hotel.name}
              </h3>
              <p className="text-sm text-gray-500">
                {hotel.city}, {hotel.country}
              </p>
            </div>
            <StarRating rating={hotel.starRating} />
          </div>

          {/* Amenities */}
          <div className="flex flex-wrap gap-2 mt-4">
            {hotel.amenities.slice(0, 3).map((amenity) => (
              <span
                key={amenity}
                className="text-xs text-gray-500 bg-[#f5f5f7] px-2.5 py-1 rounded-full"
              >
                {amenity}
              </span>
            ))}
            {hotel.amenities.length > 3 && (
              <span className="text-xs text-gray-400">
                +{hotel.amenities.length - 3}
              </span>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="text-xs text-gray-400">
              {hotel.reviewCount.toLocaleString()} reviews
            </div>
            <div className="text-sm font-medium text-[#1d1d1f]">
              View details →
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
