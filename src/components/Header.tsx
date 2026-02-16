'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [showSignIn, setShowSignIn] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setShowSignIn(false);
      setSubmitted(false);
      setEmail('');
    }, 2000);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
        <nav className="max-w-[980px] mx-auto px-6">
          <div className="flex justify-between items-center h-12">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="text-white text-sm font-semibold">A</span>
              </div>
              <span className="text-sm font-medium text-gray-900">Agentix Travel</span>
            </Link>

            {/* Nav links */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-xs text-gray-500 hover:text-gray-900">
                Home
              </Link>
              <Link href="/hotels" className="text-xs text-gray-500 hover:text-gray-900">
                Hotels
              </Link>
              <Link href="/how-it-works" className="text-xs text-gray-500 hover:text-gray-900">
                How It Works
              </Link>
              <Link href="/how-it-works#faq" className="text-xs text-gray-500 hover:text-gray-900">
                Support
              </Link>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowSignIn(true)}
                className="text-xs text-gray-500 hover:text-gray-900"
              >
                Sign In
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Sign In Modal */}
      {showSignIn && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowSignIn(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-8">
            <button
              onClick={() => setShowSignIn(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {!submitted ? (
              <>
                <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-lg font-semibold">A</span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Welcome back</h2>
                  <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-300"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-300"
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-black text-white text-sm font-medium py-2.5 rounded-xl hover:bg-gray-800 transition-colors"
                  >
                    Sign In
                  </button>
                </form>

                <p className="text-center text-xs text-gray-500 mt-4">
                  Don&apos;t have an account?{' '}
                  <button className="text-black font-medium hover:underline">Sign up</button>
                </p>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Welcome!</h3>
                <p className="text-sm text-gray-500 mt-1">Signing you in...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
