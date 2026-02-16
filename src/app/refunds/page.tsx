import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function RefundsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-[680px] mx-auto px-6 py-16">
        <h1 className="text-3xl font-semibold text-[#1d1d1f] mb-2">Refund &amp; Cancellation Policy</h1>
        <p className="text-sm text-gray-500 mb-12">Last updated: February 2026</p>

        <div className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-[#1d1d1f] mb-3">Understanding Cancellation Policies</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Each hotel sets its own cancellation policy, which is clearly displayed during the booking process.
              The cancellation terms shown at checkout apply to your specific booking. Please review these carefully
              before confirming your reservation.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1d1d1f] mb-3">Types of Rates</h2>

            <div className="space-y-4 mt-4">
              <div className="p-4 bg-green-50 rounded-xl">
                <h3 className="font-medium text-green-800 mb-2">Free Cancellation Rates</h3>
                <p className="text-sm text-green-700">
                  These rates allow you to cancel without charge up until a specified deadline (typically 24-72 hours
                  before check-in). The exact deadline is shown on your booking confirmation.
                </p>
              </div>

              <div className="p-4 bg-orange-50 rounded-xl">
                <h3 className="font-medium text-orange-800 mb-2">Partially Refundable Rates</h3>
                <p className="text-sm text-orange-700">
                  Some rates may charge a cancellation fee (often one night&apos;s stay) if cancelled after a certain date.
                  The remaining amount would be refunded.
                </p>
              </div>

              <div className="p-4 bg-red-50 rounded-xl">
                <h3 className="font-medium text-red-800 mb-2">Non-Refundable Rates</h3>
                <p className="text-sm text-red-700">
                  These discounted rates cannot be cancelled or modified. No refund is available if you cancel,
                  modify, or fail to arrive. Consider travel insurance for these bookings.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1d1d1f] mb-3">How to Cancel a Booking</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              To cancel or modify your booking:
            </p>
            <ol className="list-decimal list-inside text-gray-600 text-sm space-y-2">
              <li>Refer to your confirmation email for the booking reference</li>
              <li>Contact us with your booking details</li>
              <li>We will process your cancellation according to the applicable policy</li>
              <li>Refunds (if applicable) will be issued to your original payment method</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1d1d1f] mb-3">Refund Processing</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">When a refund is applicable:</p>
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-2">
              <li>Refunds are processed within 5-10 business days</li>
              <li>The refund will be credited to the original payment method</li>
              <li>Your bank may take additional time to reflect the credit</li>
              <li>Currency conversion rates may affect the final refund amount</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1d1d1f] mb-3">No-Show Policy</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              If you do not arrive at the hotel without cancelling (&quot;no-show&quot;), you will typically be charged
              for the full stay. The hotel may also cancel any remaining nights of your reservation.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1d1d1f] mb-3">Modifications</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Date changes or other modifications are subject to availability and may result in price changes.
              Some rates do not permit modifications. Contact us as early as possible if you need to change
              your booking.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1d1d1f] mb-3">Exceptional Circumstances</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              In cases of force majeure (natural disasters, government travel restrictions, etc.), we will work
              with hotels to find appropriate solutions. Each situation is handled on a case-by-case basis.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1d1d1f] mb-3">Travel Insurance</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              We strongly recommend purchasing travel insurance, especially for non-refundable bookings. Travel
              insurance can protect you against unforeseen circumstances that may require cancellation.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1d1d1f] mb-3">Contact Us</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              For cancellation requests or questions about our refund policy, please contact us through our
              website. Include your booking reference number for faster assistance.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
