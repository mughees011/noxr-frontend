'use client';

import Link from 'next/link';
import Image from 'next/image'
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Add newsletter subscription logic here
    console.log('Subscribing:', email);
    setEmail('');
  };

  return (
    <footer className="bg-[#F6F1E8] text-[#1A1A1A] border-t border-[#E8E2D8]">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/">
              <Image
                src="/logo/noxr-logo-1.png"
                alt="NOXR"
                width={120}
                height={40}
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Built for focus.
            </p>
            <div className="flex gap-4 pt-4">
              <SocialLink href="https://www.instagram.com/noxr.co/" label="Instagram">
                <InstagramIcon />
              </SocialLink>
              <SocialLink href="#" label="Twitter">
                <TwitterIcon />
              </SocialLink>
              <SocialLink href="#" label="Facebook">
                <FacebookIcon />
              </SocialLink>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs uppercase tracking-wider mb-4 text-zinc-500">
              Shop
            </h4>
            <ul className="space-y-3">
              <FooterLink href="/shop">All Products</FooterLink>
              <FooterLink href="/shop?new=true">New Drops</FooterLink>
              <FooterLink href="/collections">Collections</FooterLink>
              <FooterLink href="/shop?category=premium">Premium</FooterLink>
              <FooterLink href="/shop?category=essentials">Essentials</FooterLink>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs uppercase tracking-wider mb-4 text-zinc-500">
              Company
            </h4>
            <ul className="space-y-3">
              <FooterLink href="/about">About Us</FooterLink>
              <FooterLink href="/sustainability">Sustainability</FooterLink>
              <FooterLink href="/careers">Careers</FooterLink>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs uppercase tracking-wider mb-4 text-zinc-500">
              Stay Connected
            </h4>
            <p className="text-zinc-500 text-sm mb-4">
              Get early access to new drops and exclusive content.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                required
                className="w-full bg-transparent border border-zinc-800 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
              />
              <button
                type="submit"
                className="w-full bg-black text-white py-3 text-xs uppercase tracking-wider font-medium hover:bg-[#3A2E22] transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Support Links */}
        <div className="pt-6 border-t border-zinc-800">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <h5 className="text-xs uppercase tracking-wider mb-4 text-zinc-500">
                Customer Care
              </h5>
              <ul className="space-y-2">
                <FooterLink href="/returns" small>Returns & Exchanges</FooterLink>
                <FooterLink href="/contact" small>Contact Support</FooterLink>
                <FooterLink href="/shipping" small>Shipping Info</FooterLink>
                <FooterLink href="/track-order" small>Track Order</FooterLink>
                <FooterLink href="/size-guide" small>Size Guide</FooterLink>
                <FooterLink href="/faq" small>FAQ</FooterLink>
              </ul>
            </div>
            <div>
              <h5 className="text-xs uppercase tracking-wider mb-4 text-zinc-500">
                ACCOUNT
              </h5>
              <ul className="space-y-2">
                <FooterLink href="/login" small>Sign In</FooterLink>
                <FooterLink href="/register" small>Create Account</FooterLink>
                <FooterLink href="/account" small>My Account</FooterLink>
              </ul>
            </div>
            <div>
              <h5 className="text-xs uppercase tracking-wider mb-4 text-zinc-500">
                Legal
              </h5>
              <ul className="space-y-2">
                <FooterLink href="/privacy" small>Privacy Policy</FooterLink>
                <FooterLink href="/terms" small>Terms of Service</FooterLink>
                <FooterLink href="/cookies" small>Cookie Policy</FooterLink>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-zinc-500">
            <p>© 2026 NOXR. All rights reserved.</p>
            <p className="text-xs">
              Designed & Built with precision
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ 
  href, 
  children, 
  small = false 
}: { 
  href: string; 
  children: React.ReactNode;
  small?: boolean;
}) {
  return (
    <li>
      <Link
        href={href}
        className={`text-[#6B665E] hover:text-[#1A1A1A] transition-colors ${
          small ? 'text-xs' : 'text-sm'
        }`}
      >
        {children}
      </Link>
    </li>
  );
}

function SocialLink({ 
  href, 
  label, 
  children 
}: { 
  href: string; 
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-10 h-10 border border-[#1A1A1A] flex items-center justify-center text-[#6B665E] hover:text-black hover:border-black transition-colors"
    >
      {children}
    </a>
  );
}

function PaymentBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-zinc-900 border border-zinc-800 px-3 py-1.5 text-xs text-zinc-400">
      {children}
    </span>
  );
}

// Social Media Icons
function InstagramIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
    </svg>
  );
}
