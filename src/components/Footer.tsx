import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#f5f5f7] mt-auto">
      <div className="max-w-[980px] mx-auto px-6 py-8">
        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-8 border-b border-gray-300/50">
          <div>
            <h3 className="text-xs font-semibold text-gray-900 mb-3">Explore</h3>
            <ul className="space-y-2">
              <li><Link href="/hotels" className="text-xs text-gray-500 hover:text-gray-900">Hotels</Link></li>
              <li><Link href="#" className="text-xs text-gray-500 hover:text-gray-900">Experiences</Link></li>
              <li><Link href="#" className="text-xs text-gray-500 hover:text-gray-900">Destinations</Link></li>
              <li><Link href="#" className="text-xs text-gray-500 hover:text-gray-900">Deals</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-gray-900 mb-3">Company</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-xs text-gray-500 hover:text-gray-900">About Us</Link></li>
              <li><Link href="#" className="text-xs text-gray-500 hover:text-gray-900">Careers</Link></li>
              <li><Link href="#" className="text-xs text-gray-500 hover:text-gray-900">Press</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-gray-900 mb-3">Support</h3>
            <ul className="space-y-2">
              <li><Link href="/how-it-works" className="text-xs text-gray-500 hover:text-gray-900">How It Works</Link></li>
              <li><Link href="/how-it-works#faq" className="text-xs text-gray-500 hover:text-gray-900">FAQ</Link></li>
              <li><Link href="/refunds" className="text-xs text-gray-500 hover:text-gray-900">Cancellation Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-gray-900 mb-3">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-xs text-gray-500 hover:text-gray-900">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-xs text-gray-500 hover:text-gray-900">Terms of Service</Link></li>
              <li><Link href="/refunds" className="text-xs text-gray-500 hover:text-gray-900">Refund Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-4 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} AgentixAI. All rights reserved.
          </p>
          <p className="text-xs text-gray-400">
            Powered by LiteAPI
          </p>
        </div>
      </div>
    </footer>
  );
}
