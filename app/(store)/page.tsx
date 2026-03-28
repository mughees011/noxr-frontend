'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'

// ─── Types ────────────────────────────────────────────────────────────────────
interface Product {
  _id: string
  name: string
  category: string
  price: number
  images: { url: string }[]
  slug: string
  featured?: boolean
  tag?: string
}



const TRUST_SIGNALS = [
  'Free shipping over PKR 5,000',
  '7-day return policy',
  'Premium cotton only',
  'Ships within 24 hours',
  'Made in Pakistan',
  'Limited quantities',
  'Quality inspected',
]

// ─── Hook ─────────────────────────────────────────────────────────────────────
function useInView() {
  const ref = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setInView(true), { threshold: 0.1 })
      if (ref.current) obs.observe(ref.current)
      return () => obs.disconnect()
    }, [])
  return { ref, inView }
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [scrollY, setScrollY] = useState(0)
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])


  useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/products')
      const data = await res.json()

      if (Array.isArray(data)) {
        setProducts(data.slice(0, 4))
      }
    } catch (err) {
      console.error(err)
    }
  }

  fetchProducts()
}, [])
  return (
    <div className="bg-[#F7F3ED]">

      {/* ═══ HERO ═══ Mobile-first: text first, image below */}
      <HeroSection scrollY={scrollY} />

      {/* ═══ TRUST STRIP ═══ Thumb-scroll marquee */}
      <TrustMarquee />

      {/* ═══ INTRO ═══ Single column on mobile */}
      <IntroSection />

      {/* ═══ PRODUCTS ═══ 1 col mobile, 2 col tablet, 4 col desktop */}
      <ProductsSection products={products} />

      {/* ═══ COLLECTIONS ═══ Stacked cards */}
      <CollectionsSection />

      {/* ═══ CTA ═══ Simple centered block */}
      <CTASection />

    </div>
  )
}

// ═══ HERO SECTION ═══
// Mobile: text content → CTA → image
// Desktop: side-by-side split
function HeroSection({ scrollY }: { scrollY: number }) {
  return (
    <section 
      className="relative min-h-[85vh] md:min-h-[90vh] flex items-center"
      style={{ paddingTop: '80px' }}
    >
      {/* Desktop: Split layout */}
      <div className="hidden lg:grid lg:grid-cols-[52fr_48fr] w-full max-w-[1240px] mx-auto gap-0 px-6 lg:px-[52px]">
        
        {/* Left: Image with parallax */}
        <div className="relative overflow-hidden" style={{ aspectRatio: '4/5' }}>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/banners/bumyw.webp')",
              filter: 'brightness(0.88) saturate(0.8)',
              // transform: `translateY(${scrollY * 0.18}px)`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[rgba(237,231,220,0.12)] to-transparent" />
        </div>

        {/* Right: Text content */}
        <div className="flex flex-col justify-center pl-16">
          <div className="animate-fade-up">
            <p className="overline mb-5">STRUCTURED ESSENTIALS FOR FOCUSED LIVING.</p>
            <h1 
              className="font-display font-light text-[#1A1208] mb-6"
              style={{ fontSize: 'clamp(52px, 6vw, 96px)', lineHeight: 0.92, letterSpacing: '-0.025em' }}
            >
              PREMIUM<br />
              <em className="italic" style={{ color: 'rgba(26,18,8,0.5)' }}>MINIMAL APPAREL</em>
            </h1>
            <p 
              className="font-body font-light mb-10"
              style={{ fontSize: '13px', lineHeight: 1.85, color: 'rgba(26,18,8,0.45)', maxWidth: '380px' }}
            >
              {/* Designed with clarity. Produced in limited quantities */}
              Precision cut garments built for discipline, clarity, and everyday performance. Limited quantities. No excess.
            </p>
            <div className="flex gap-4">
              <Link href="/shop" className="btn-primary">
                <span>Shop Collection</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: Stacked layout (text → image) */}
      <div className="lg:hidden w-full px-5">
        
        {/* Text content first (thumb reach zone) */}
        <div className="pt-8 pb-10">
          <p className="overline mb-4">NOXR Studio</p>
          <h1 
            className="font-display font-light text-[#1A1208] mb-5"
            style={{ fontSize: 'clamp(42px, 13vw, 64px)', lineHeight: 0.94, letterSpacing: '-0.025em' }}
          >
            Built to<br />
            <em className="italic" style={{ color: 'rgba(26,18,8,0.5)' }}>Last.</em>
          </h1>
          <p 
            className="font-body font-light mb-8"
            style={{ fontSize: '14px', lineHeight: 1.75, color: 'rgba(26,18,8,0.45)' }}
          >
            Premium menswear designed for clarity. Limited quantities. No restocks.
          </p>
          
          {/* CTA in thumb zone */}
          <Link href="/shop" className="btn-primary block text-center">
            <span>Shop Collection</span>
          </Link>
        </div>

        {/* Image below */}
        <div className="relative w-full overflow-hidden mb-8" style={{ aspectRatio: '3/4' }}>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/banners/bumyw.webp')",
              filter: 'brightness(0.88) saturate(0.8)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[rgba(237,231,220,0.12)] to-transparent" />
        </div>
      </div>
    </section>
  )
}

// ═══ TRUST MARQUEE ═══
// Infinite scroll trust signals
function TrustMarquee() {
  return (
    <div 
      className="border-t border-b overflow-hidden bg-[#100D08]"
      style={{ borderColor: 'rgba(26,18,8,0.6)' }}
    >
      <div className="animate-marquee flex gap-12 py-5 px-6">
        {[...TRUST_SIGNALS, ...TRUST_SIGNALS].map((text, i) => (
          <span
            key={i}
            className="font-body font-light whitespace-nowrap"
            style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(247,243,237,0.4)' }}
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  )
}

// ═══ INTRO SECTION ═══
// Mobile: Single column
// Desktop: 2 columns
function IntroSection() {
  const { ref, inView } = useInView()
  return (
    <section 
      ref={ref}
      className="py-16 md:py-28 px-5 md:px-[52px]"
      style={{ opacity: inView ? 1 : 0, transform: inView ? 'none' : 'translateY(20px)', transition: 'all 1s ease' }}
    >
      <div className="max-w-[1240px] mx-auto">
        
        {/* Mobile: single column */}
        <div className="md:grid md:grid-cols-2 md:gap-20">
          
          {/* Label */}
          <div className="mb-8 md:mb-0">
            <p className="overline mb-3">Philosophy</p>
            <h2 
              className="font-display font-light text-[#1A1208]"
              style={{ fontSize: 'clamp(28px, 6vw, 44px)', lineHeight: 1.1, letterSpacing: '-0.01em' }}
            >
              Less. Done better.
            </h2>
          </div>

          {/* Body */}
          <div className="space-y-5">
            <p className="font-body font-light" style={{ fontSize: '14px', lineHeight: 1.8, color: 'rgba(26,18,8,0.45)' }}>
              We refine proportion. <br />
              We control weight.
            </p>
            <p className="font-body font-light" style={{ fontSize: '14px', lineHeight: 1.8, color: 'rgba(26,18,8,0.45)' }}>
              We remove excess.
            </p>

            {/* Stats in thumb-friendly layout */}
            {/* <div className="grid grid-cols-3 gap-4 pt-6 border-t" style={{ borderColor: 'rgba(26,18,8,0.08)' }}>
              {[
                { value: '25+', label: 'Pieces' },
                { value: '3', label: 'Collections' },
                { value: '2023', label: 'Founded' },
              ].map(stat => (
                <div key={stat.label}>
                  <p className="font-display font-light text-[#1A1208]" style={{ fontSize: '24px', marginBottom: '4px' }}>
                    {stat.value}
                  </p>
                  <p className="overline">{stat.label}</p>
                </div>
              ))}
            </div> */}
          </div>
        </div>
      </div>
    </section>
  )
}

// ═══ PRODUCTS SECTION ═══
// Mobile: 1 column (easy thumb scroll)
// Tablet: 2 columns
// Desktop: 4 columns
function ProductsSection({ products }: { products: Product[] }) {
  const { ref, inView } = useInView()
  return (
    <section ref={ref} className="py-16 md:py-24 px-5 md:px-[52px]">
      <div className="max-w-[1240px] mx-auto">
        
        {/* Header */}
        <div className="mb-10 md:mb-16">
          <p className="overline mb-3">New Season</p>
          <h2 
            className="font-display font-light text-[#1A1208]"
            style={{ fontSize: 'clamp(32px, 7vw, 56px)', lineHeight: 1, letterSpacing: '-0.02em' }}
          >
            Featured Pieces
          </h2>
        </div>

        {/* Grid: 1 col mobile → 2 col tablet → 4 col desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-5">
          {products.map((product, i) => (
            <ProductCard key={product._id} product={product} index={i} inView={inView} />
          ))}
        </div>

        {/* View all - thumb-friendly button */}
        <div className="text-center mt-10 md:mt-16">
          <Link href="/shop" className="btn-primary">
            <span>View All Products</span>
          </Link>
        </div>
      </div>
    </section>
  )
}

// ═══ PRODUCT CARD ═══
// Optimized for thumb tapping
function ProductCard({ product, index, inView }: { product: Product; index: number; inView: boolean }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="block group"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : 'translateY(20px)',
        transition: `all 0.8s ease ${index * 0.1}s`,
      }}
    >
      {/* Image */}
      <div className="relative overflow-hidden mb-4" style={{ aspectRatio: '3/4', backgroundColor: '#EDE7DC' }}>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${product.images?.[0]?.url}')`,
            filter: 'brightness(0.95) saturate(0.85)',
          }}
        />
        
        {/* Tag */}
        {product.tag && (
          <div className="product-tag">{product.tag}</div>
        )}

        {/* Mobile: CTA always visible, not hidden */}
        <div className="absolute bottom-0 left-0 right-0 bg-[rgba(247,243,237,0.95)] backdrop-blur-sm border-t py-3 px-4 flex justify-between items-center" style={{ borderColor: 'rgba(26,18,8,0.08)' }}>
          <span className="font-body font-light text-[#1A1208]" style={{ fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
            View
          </span>
          <span className="font-display text-[#1A1208]" style={{ fontSize: '14px' }}>→</span>
        </div>
      </div>

      {/* Info */}
      <p className="overline mb-2">{product.category}</p>
      <div className="flex justify-between items-baseline gap-3">
        <h3 className="font-display font-light text-[#1A1208]" style={{ fontSize: '16px', letterSpacing: '0.01em' }}>
          {product.name}
        </h3>
        <span className="font-body font-light" style={{ fontSize: '12px', color: 'rgba(26,18,8,0.45)' }}>
          PKR {product.price.toLocaleString()}
        </span>
      </div>
    </Link>
  )
}

// ═══ COLLECTIONS ═══
// Stacked cards on mobile
function CollectionsSection() {
  const { ref, inView } = useInView()
  return (
    <section ref={ref} className="py-16 md:py-24 px-5 md:px-[52px]">
      <div className="max-w-[1240px] mx-auto">
        
        <div className="mb-10 md:mb-16">
          <p className="overline mb-3">Shop by Line</p>
          <h2 className="font-display font-light text-[#1A1208]" style={{ fontSize: 'clamp(32px, 7vw, 56px)', lineHeight: 1, letterSpacing: '-0.02em' }}>
            Collections
          </h2>
        </div>

        {/* Grid: 1 col mobile → 2 col desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <CollectionCard title="Essentials" description="Core pieces for everyday wear" link="/shop?category=essentials" inView={inView} index={0} />
          <CollectionCard title="Premium" description="Elevated designs for the bold" link="/shop?category=premium" inView={inView} index={1} />
        </div>
      </div>
    </section>
  )
}

function CollectionCard({ title, description, link, inView, index }: { title: string; description: string; link: string; inView: boolean; index: number }) {
  return (
    <Link
      href={link}
      className="relative block overflow-hidden"
      style={{
        height: '320px',
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : 'translateY(20px)',
        transition: `all 0.8s ease ${index * 0.15}s`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#E5DDD2] to-[#C8BFB3]" />
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8">
        <h3 className="font-display font-light text-white mb-3" style={{ fontSize: 'clamp(36px, 8vw, 52px)', letterSpacing: '-0.01em' }}>
          {title}
        </h3>
        <p className="font-body font-light mb-6" style={{ fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)' }}>
          {description}
        </p>
        <span className="inline-block border border-white px-8 py-3 font-body font-light" style={{ fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'white' }}>
          Explore
        </span>
      </div>
    </Link>
  )
}

// ═══ CTA SECTION ═══
// Simple centered block
function CTASection() {
  const { ref, inView } = useInView()
  return (
    <section ref={ref} className="py-16 md:py-24 px-5 md:px-[52px] border-t" style={{ borderColor: 'rgba(26,18,8,0.08)', opacity: inView ? 1 : 0, transition: 'opacity 1s ease' }}>
      <div className="max-w-[600px] mx-auto text-center">
        <p className="overline mb-4">Join the community</p>
        <h2 className="font-display font-light text-[#1A1208] mb-6" style={{ fontSize: 'clamp(28px, 7vw, 44px)', lineHeight: 1.1, letterSpacing: '-0.01em' }}>
          @noxr
        </h2>
        <p className="font-body font-light mb-8" style={{ fontSize: '14px', lineHeight: 1.75, color: 'rgba(26,18,8,0.45)' }}>
          Tag us in your fits. Join the community.
        </p>
        <a 
          href="https://www.instagram.com/noxr.co/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn-primary inline-block"
        >
          <span>Follow on Instagram</span>
        </a>
      </div>
    </section>
  )
}