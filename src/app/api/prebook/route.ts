import { NextRequest, NextResponse } from 'next/server';
import { prebook } from '@/lib/liteapi';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { offerId } = body;

    if (!offerId) {
      return NextResponse.json(
        { success: false, error: 'offerId is required' },
        { status: 400 }
      );
    }

    const result = await prebook(offerId);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      prebookId: result.prebookId,
      transactionId: result.transactionId,
      secretKey: result.secretKey,
    });
  } catch (error) {
    console.error('[API] Prebook error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
