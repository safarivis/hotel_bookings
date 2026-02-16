import { NextRequest, NextResponse } from 'next/server';

const GROK_API_KEY = process.env.GROK_API_KEY;
const GROK_API_URL = 'https://api.x.ai/v1/chat/completions';

const SYSTEM_PROMPT = `You are a helpful travel assistant for Agentix Travel, a hotel booking platform. Your role is to:

1. Help users find hotels and answer questions about destinations
2. Explain the booking process and how it works
3. Address concerns about payment security and booking guarantees
4. Provide travel tips and recommendations

Key facts about Agentix Travel:
- We offer 2+ million hotels in 190+ countries
- Payments are processed securely via Stripe (PCI DSS Level 1 compliant)
- All bookings are confirmed directly with hotels
- We offer 24/7 support
- Many hotels offer free cancellation

Be friendly, concise, and helpful. Keep responses under 150 words unless more detail is needed. If you don't know something specific about a booking, suggest the user check their confirmation email or contact support.`;

export async function POST(request: NextRequest) {
  try {
    const { message, history = [] } = await request.json();

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      );
    }

    // If no API key, return a helpful fallback response
    if (!GROK_API_KEY) {
      return NextResponse.json({
        success: true,
        message: getFallbackResponse(message),
        isDemo: true,
      });
    }

    // Build messages array with history
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.slice(-10), // Keep last 10 messages for context
      { role: 'user', content: message },
    ];

    const response = await fetch(GROK_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'grok-beta',
        messages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Chat API] Grok error:', response.status, errorText);
      return NextResponse.json({
        success: true,
        message: getFallbackResponse(message),
        isDemo: true,
      });
    }

    const data = await response.json();
    const aiMessage = data.choices?.[0]?.message?.content || getFallbackResponse(message);

    return NextResponse.json({
      success: true,
      message: aiMessage,
    });
  } catch (error) {
    console.error('[Chat API] Error:', error);
    return NextResponse.json({
      success: true,
      message: "I'm having trouble connecting right now. For immediate assistance, please email support@agentixtravel.com or check our How It Works page for common questions.",
      isDemo: true,
    });
  }
}

function getFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('book') || lowerMessage.includes('reservation')) {
    return "To book a hotel, simply search for your destination, select your dates, choose a room, and complete the secure checkout. You'll receive an instant confirmation email with all your booking details.";
  }

  if (lowerMessage.includes('cancel') || lowerMessage.includes('refund')) {
    return "Cancellation policies vary by hotel and rate type. Free cancellation options are clearly marked during booking. Check your confirmation email for specific terms, or contact our support team for help.";
  }

  if (lowerMessage.includes('payment') || lowerMessage.includes('secure') || lowerMessage.includes('safe')) {
    return "Your payment is completely secure. We use Stripe for processing, which is PCI DSS Level 1 certified — the highest security standard. Your card details are never stored on our servers.";
  }

  if (lowerMessage.includes('confirm') || lowerMessage.includes('guarantee')) {
    return "Every booking is confirmed directly with the hotel. You'll receive an official confirmation number that the hotel recognizes. If any issues arise, we'll find you alternative accommodation at no extra cost.";
  }

  if (lowerMessage.includes('contact') || lowerMessage.includes('support') || lowerMessage.includes('help')) {
    return "I'm here to help! For booking issues, check your confirmation email first. For urgent matters, contact support@agentixtravel.com or call our 24/7 hotline. What specific question can I help with?";
  }

  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return "Hello! Welcome to Agentix Travel. I'm your AI assistant. I can help you find hotels, explain our booking process, or answer questions about your travel plans. What can I help you with today?";
  }

  return "I can help you with hotel searches, booking questions, payment security, cancellation policies, and travel tips. What would you like to know?";
}
