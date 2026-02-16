import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-[680px] mx-auto px-6 py-16">
        <h1 className="text-3xl font-semibold text-[#1d1d1f] mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-12">Last updated: February 2026</p>

        <div className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-[#1d1d1f] mb-3">1. Information We Collect</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              We collect information you provide directly to us when making a booking:
            </p>
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-2">
              <li><strong>Contact Information:</strong> Name, email address, phone number</li>
              <li><strong>Booking Details:</strong> Hotel selections, dates, guest preferences</li>
              <li><strong>Payment Information:</strong> Processed securely by our payment provider (we do not store card details)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1d1d1f] mb-3">2. How We Use Your Information</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">We use collected information to:</p>
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-2">
              <li>Process and confirm your hotel bookings</li>
              <li>Send booking confirmations and updates</li>
              <li>Provide customer support</li>
              <li>Improve our services</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1d1d1f] mb-3">3. Information Sharing</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">We share your information with:</p>
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-2">
              <li><strong>Hotels:</strong> To complete your reservation</li>
              <li><strong>Payment Processors:</strong> To process your payment securely</li>
              <li><strong>Service Providers:</strong> Who assist in operating our platform</li>
            </ul>
            <p className="text-gray-600 text-sm leading-relaxed mt-3">
              We do not sell your personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1d1d1f] mb-3">4. Data Security</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              We implement appropriate security measures to protect your personal information. Payment data is
              processed through PCI DSS compliant systems. However, no method of transmission over the Internet
              is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1d1d1f] mb-3">5. Data Retention</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              We retain your booking information for the period necessary to fulfill the purposes outlined in
              this policy, comply with legal obligations, resolve disputes, and enforce our agreements. Typically,
              booking records are retained for 7 years for tax and legal purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1d1d1f] mb-3">6. Your Rights</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">You have the right to:</p>
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your data (subject to legal retention requirements)</li>
              <li>Object to processing of your data</li>
              <li>Request data portability</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1d1d1f] mb-3">7. Cookies</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              We use essential cookies to enable basic website functionality. We do not use tracking or
              advertising cookies without your consent.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1d1d1f] mb-3">8. Third-Party Links</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Our website may contain links to third-party sites. We are not responsible for the privacy
              practices of these external sites.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1d1d1f] mb-3">9. Children&apos;s Privacy</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Our Service is not directed to children under 18. We do not knowingly collect personal
              information from children.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1d1d1f] mb-3">10. Changes to This Policy</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              We may update this Privacy Policy periodically. We will notify you of significant changes by
              posting the new policy on this page with an updated revision date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#1d1d1f] mb-3">11. Contact Us</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              For questions about this Privacy Policy or to exercise your rights, please contact us through
              our website.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
