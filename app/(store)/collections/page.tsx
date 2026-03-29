'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true) },
      { threshold }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

export default function CollectionsPage() {
  const [loaded, setLoaded] = useState(false)
  const [collections, setCollections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100)
    fetchCollections()
  }, [])

  const fetchCollections = async () => {
    try {
      const res = await fetch(`/collections`)
      const data = await res.json()
      setCollections(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch collections:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F3ED] flex items-center justify-center">
        <p className="overline" style={{ color: 'rgba(26,18,8,0.3)' }}>Loading collections...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F7F3ED]">

      {/* Hero */}
      <section className="px-5 md:px-[52px] pt-24 md:pt-32 pb-16 md:pb-24 border-b" style={{ borderColor: 'rgba(26,18,8,0.08)' }}>
        <div
          className="max-w-[1240px] mx-auto"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'none' : 'translateY(20px)',
            transition: 'all 1.2s ease 0.1s',
          }}
        >
          <p className="overline mb-5">NOXR Studio</p>
          <h1
            className="font-display font-light text-[#1A1208] mb-6"
            style={{
              fontSize: 'clamp(42px, 10vw, 96px)',
              lineHeight: 0.9,
              letterSpacing: '-0.025em',
            }}
          >
            Collections
          </h1>
          <p
            className="font-body font-light"
            style={{
              fontSize: '14px',
              lineHeight: 1.8,
              color: 'rgba(26,18,8,0.45)',
              maxWidth: '480px',
            }}
          >
            Curated drops. Each designed with a purpose. All built to the same standard.
          </p>
        </div>
      </section>

      {/* Collection Cards */}
      <section className="px-5 md:px-[52px] py-16 md:py-24">
        <div className="max-w-[1240px] mx-auto space-y-20 md:space-y-32">
          {collections.map((collection, i) => (
            <CollectionCard key={collection._id} collection={collection} index={i} />
          ))}
        </div>

        {collections.length === 0 && (
          <div className="text-center py-20">
            <p className="font-body font-light" style={{ fontSize: '13px', color: 'rgba(26,18,8,0.3)' }}>
              No collections available yet. Check back soon.
            </p>
          </div>
        )}
      </section>

      {/* CTA */}
      <div className="border-t px-5 md:px-[52px] py-12 md:py-20" style={{ borderColor: 'rgba(26,18,8,0.08)' }}>
        <div className="max-w-[1240px] mx-auto text-center">
          <p className="overline mb-4">Browse all</p>
          <h2
            className="font-display font-light text-[#1A1208] mb-8"
            style={{ fontSize: 'clamp(28px, 7vw, 44px)', letterSpacing: '-0.01em' }}
          >
            Ready to shop?
          </h2>
          <Link href="/shop" className="btn-primary">
            <span>View All Products</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

function CollectionCard({ collection, index }: { collection: any; index: number }) {
  const { ref, inView } = useInView(0.1)
  const isEven = index % 2 === 0

  return (
    <div
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : 'translateY(30px)',
        transition: 'all 1.2s cubic-bezier(0.25,0.46,0.45,0.94)',
      }}
    >
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center ${!isEven && 'lg:flex-row-reverse'}`}>
        
        {/* Image */}
        <Link
          href={`/collections/${collection.slug}`}
          className={`relative overflow-hidden block group ${!isEven && 'lg:order-2'}`}
          style={{ aspectRatio: '4/5', backgroundColor: '#EDE7DC' }}
        >
          {collection.heroImage && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url('${collection.heroImage}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'brightness(0.9) saturate(0.85)',
                transition: 'transform 0.8s ease',
              }}
              className="group-hover:scale-[1.03]"
            />
          )}
          
          {/* Overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(26,18,8,0.6) 0%, transparent 50%)',
            }}
          />

          {/* Collection title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <p
              className="font-display font-light text-white mb-2"
              style={{ fontSize: 'clamp(36px, 7vw, 52px)', letterSpacing: '-0.01em' }}
            >
              {collection.name}
            </p>
            <p
              className="font-body font-light"
              style={{ fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}
            >
              {collection.productCount || collection.productIds?.length || 0} pieces
            </p>
          </div>
        </Link>

        {/* Content */}
        <div className={`${!isEven && 'lg:order-1'}`}>
          {collection.tagline && (
            <p className="overline mb-4">{collection.tagline}</p>
          )}
          
          <h2
            className="font-display font-light text-[#1A1208] mb-6"
            style={{ fontSize: 'clamp(28px, 6vw, 44px)', lineHeight: 1.1, letterSpacing: '-0.015em' }}
          >
            {collection.name}
          </h2>
          
          <p
            className="font-body font-light mb-8"
            style={{ fontSize: '14px', lineHeight: 1.85, color: 'rgba(26,18,8,0.45)' }}
          >
            {collection.shortDescription || collection.description}
          </p>
          
          {collection.season && (
            <p className="overline mb-6" style={{ color: 'rgba(26,18,8,0.3)' }}>
              {collection.season}
            </p>
          )}
          
          <Link
            href={`/collections/${collection.slug}`}
            className="btn-primary"
          >
            <span>Explore {collection.name}</span>
          </Link>
        </div>
      </div>
    </div>
  )
}