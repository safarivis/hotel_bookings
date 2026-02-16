import { NextRequest, NextResponse } from 'next/server';
import { book, getMarkupPercent } from '@/lib/liteapi';
import { upsertCustomer, saveBooking, initDb } from '@/lib/db';

// Initialize DB on first request
let dbInitialized = false;

export async function POST(request: NextRequest) {
  try {
    // Initialize DB tables if needed
    if (!dbInitialized) {
      await initDb();
      dbInitialized = true;
    }

    const body = await request.json();
    const {
      prebookId,
      transactionId,
      holder,
      guests,
      // Additional booking details for storage
      hotelId,
      hotelName,
      roomType,
      checkIn,
      checkOut,
      guestCount,
      nights,
      originalPrice,
      totalPrice,
      currency,
    } = body;

    if (!prebookId || !transactionId || !holder) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await book({
      prebookId,
      transactionId,
      holder,
      guests: guests || [{ firstName: holder.firstName, lastName: holder.lastName }],
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    // Save to database
    try {
      // Save/update customer
      const customerId = await upsertCustomer({
        email: holder.email,
        firstName: holder.firstName,
        lastName: holder.lastName,
        phone: holder.phone,
      });

      // Calculate commission
      const markupPercent = getMarkupPercent();
      const commission = totalPrice ? (totalPrice - (originalPrice || totalPrice)) : 0;

      // Save booking
      await saveBooking({
        bookingId: result.bookingId || `BK-${Date.now()}`,
        confirmationCode: result.confirmationCode,
        customerId,
        hotelId: hotelId || 'unknown',
        hotelName: hotelName || 'Hotel',
        roomType,
        checkIn: checkIn || new Date().toISOString().split('T')[0],
        checkOut: checkOut || new Date().toISOString().split('T')[0],
        guests: guestCount || 1,
        nights: nights || 1,
        originalPrice: originalPrice || 0,
        markupPrice: totalPrice || 0,
        commission,
        currency: currency || 'USD',
        status: result.status || 'confirmed',
        prebookId,
        transactionId,
      });

      console.log('[API] Booking saved to database:', result.bookingId);
    } catch (dbError) {
      // Log but don't fail the booking if DB save fails
      console.error('[API] Failed to save booking to database:', dbError);
    }

    return NextResponse.json({
      success: true,
      bookingId: result.bookingId,
      confirmationCode: result.confirmationCode,
      status: result.status,
    });
  } catch (error) {
    console.error('[API] Book error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
