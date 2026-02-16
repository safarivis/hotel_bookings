import { NextRequest, NextResponse } from 'next/server';
import { searchHotels } from '@/lib/liteapi';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const destination = searchParams.get('destination') || 'Paris';
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const guests = parseInt(searchParams.get('guests') || '2');
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');

  try {
    const allHotels = await searchHotels({
      destination,
      checkIn,
      checkOut,
      guests,
      rooms: 1,
    });

    const total = allHotels.length;
    const hotels = allHotels.slice(offset, offset + limit);
    const hasMore = offset + limit < total;

    return NextResponse.json({
      hotels,
      total,
      hasMore,
      offset,
      limit,
    });
  } catch (error) {
    console.error('Hotel search error:', error);
    return NextResponse.json(
      { error: 'Failed to search hotels' },
      { status: 500 }
    );
  }
}
