import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-[680px] mx-auto px-6 py-16">
        <h1 className="text-3xl font-semibold text-[#1d1d1f] mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-12">Last updated: February 2026</p>

        <div className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-[#1d1d1f] mb-3">1. Agreement to Terms</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              By accessing or using Agentix Travel (&quot;the Service&quot;), you agree to be bound by these Terms of Service.
              If you disagree with any part of these terms, you may not access the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1d1d1f] mb-3">2. Description of Service</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Agentix Travel is a hotel booking platform that connects users with accommodation providers worldwide.
              We act as an intermediary between you and hotels, facilitating the booking process.
              The actual accommodation contract is between you and the hotel.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1d1d1f] mb-3">3. Booking and Payment</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              When you make a booking through our Service:
            </p>
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-2">
              <li>You confirm that all information provided is accurate and complete</li>
              <li>Payment is processed securely through our payment provider</li>
              <li>Prices displayed include applicable taxes unless otherwise stated</li>
              <li>Confirmation is subject to hotel availability</li>
              <li>You agree to the hotel&apos;s specific terms and conditions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1d1d1f] mb-3">4. Cancellations and Refunds</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Cancellation policies vary by hotel and rate type. The applicable cancellation policy is displayed
              during the booking process and in your confirmation email. Please review the specific terms before
              completing your booking. See our <a href="/refunds" className="text-black underline">Refund Policy</a> for details.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1d1d1f] mb-3">5. User Responsibilities</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">You agree to:</p>
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-2">
              <li>Provide accurate personal and payment information</li>
              <li>Comply with hotel rules and regulations during your stay</li>
              <li>Not use the Service for any unlawful purpose</li>
              <li>Not attempt to gain unauthorized access to our systems</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1d1d1f] mb-3">6. Limitation of Liability</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              We act solely as an intermediary and are not responsible for the actions, omissions, or defaults
              of hotels or other service providers. Our liability is limited to the booking fee paid to us,
              excluding the accommodation cost paid to hotels.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1d1d1f] mb-3">7. Intellectual Property</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              All content on this website, including text, graphics, logos, and software, is the property of
              Agentix Travel or its licensors and is protected by intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1d1d1f] mb-3">8. Changes to Terms</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon
              posting to the website. Your continued use of the Service constitutes acceptance of the modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1d1d1f] mb-3">9. Governing Law</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              These terms are governed by applicable law. Any disputes shall be resolved through appropriate
              legal channels in the jurisdiction where the Service operates.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1d1d1f] mb-3">10. Contact</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              For questions about these Terms of Service, please contact us through our website.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
