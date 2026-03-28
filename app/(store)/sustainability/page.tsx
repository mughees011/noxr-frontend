'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'

function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true) },
      { threshold }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return { ref, inView }
}

const PILLARS = [
  {
    number: '01',
    title: 'Material Integrity',
    body: 'Every fabric we use is selected based on a single criterion: will it last? We source 100% ring-spun cotton — no blended fillers, no synthetic shortcuts.',
    stat: '100%',
    statLabel: 'Natural Cotton',
  },
  {
    number: '02',
    title: 'Intentional Quantity',
    body: 'We produce in small batches by design. By keeping runs limited and refusing to restock, we ensure that what we make gets worn — not discarded.',
    stat: '0',
    statLabel: 'Overstock Policy',
  },
  {
    number: '03',
    title: 'Considered Packaging',
    body: 'Our packaging uses no single-use plastic. Every order ships in recycled kraft paper. The box is designed to be reused.',
    stat: '100%',
    statLabel: 'Plastic-Free',
  },
  {
    number: '04',
    title: 'Local Production',
    body: 'NOXR is made in Pakistan. Working with local manufacturers reduces our shipping footprint dramatically compared to overseas production.',
    stat: 'Local',
    statLabel: 'Karachi Made',
  },
]

const COMMITMENTS = [
  { label: 'No virgin synthetic fibres in core range' },
  { label: 'Recycled or FSC-certified paper in all packaging' },
  { label: 'No intentional overproduction — limited runs only' },
  { label: 'Garment care instructions to extend product life' },
  { label: 'Local manufacturing to reduce transport emissions' },
  { label: 'No seasonal sale cycles driving excess consumption' },
]

export default function SustainabilityPage() {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => { setTimeout(() => setLoaded(true), 100) }, [])

  return (
    <div className="min-h-screen bg-[#F7F3ED]">

      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden flex items-end"
        style={{ minHeight: '70vh' }}
      >
        <div
          style={{
            position: 'absolute', inset: 0,
            backgroundImage: "url('/sustainability/hero.jpg')",
            backgroundSize: 'cover', backgroundPosition: 'center 35%',
            filter: 'brightness(0.42) saturate(0.65) contrast(1.05)',
            transform: loaded ? 'scale(1)' : 'scale(1.04)',
            transition: 'transform 2.4s cubic-bezier(0.25,0.46,0.45,0.94)',
          }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,18,8,0.88) 0%, rgba(26,18,8,0.08) 65%)' }} />

        <div
          className="relative w-full px-5 md:px-[52px] pb-12 md:pb-20 max-w-[1240px] mx-auto"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'none' : 'translateY(20px)',
            transition: 'all 1.6s cubic-bezier(0.25,0.46,0.45,0.94) 0.3s'
          }}
        >
          <p className="overline mb-6" style={{ color: 'rgba(247,243,237,0.35)' }}>
            Our Responsibility
          </p>
          <h1
            className="font-display font-light text-[#F7F3ED] mb-6"
            style={{
              fontSize: 'clamp(48px, 12vw, 112px)',
              lineHeight: 0.9,
              letterSpacing: '-0.025em',
            }}
          >
            Built to<br />
            <em style={{ fontStyle: 'italic', color: 'rgba(247,243,237,0.5)' }}>Last.</em>
          </h1>
          <p
            className="font-body font-light"
            style={{ fontSize: '14px', lineHeight: 1.8, color: 'rgba(247,243,237,0.45)', maxWidth: '380px' }}
          >
            Sustainability at NOXR is not a campaign. It is a consequence of building things properly.
          </p>
        </div>
      </section>

      {/* ── Opening statement ── */}
      <OpeningStatement />

      {/* ── Four pillars ── */}
      <PillarsSection />

      {/* ── Commitments list ── */}
      <CommitmentsSection commitments={COMMITMENTS} />

      {/* ── Editorial image break ── */}
      <ImageBreak />

      {/* ── CTA ── */}
      <div className="border-t px-5 md:px-[52px] py-12 md:py-20" style={{ borderColor: 'rgba(26,18,8,0.08)' }}>
        <div className="max-w-[1240px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="overline mb-3">The collection</p>
            <h2 className="font-display font-light text-[#1A1208]" style={{ fontSize: 'clamp(28px, 7vw, 44px)', letterSpacing: '-0.01em' }}>
              Buy less. Buy better.
            </h2>
          </div>
          <Link href="/shop" className="btn-primary"><span>Shop the Collection</span></Link>
        </div>
      </div>
    </div>
  )
}

function OpeningStatement() {
  const { ref, inView } = useInView(0.15)
  return (
    <section ref={ref} className="px-5 md:px-[52px] py-16 md:py-32">
      
      {/* Mobile: Stack, Desktop: 2-col */}
      <div
        className="max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10 lg:gap-20"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? 'none' : 'translateY(20px)',
          transition: 'all 1s ease',
        }}
      >
        <div>
          <p className="overline mb-5">Philosophy</p>
          <div style={{ width: '28px', height: '0.5px', backgroundColor: 'rgba(26,18,8,0.15)' }} />
        </div>
        
        <div>
          <blockquote
            className="font-display font-light mb-8"
            style={{
              fontSize: 'clamp(22px, 6vw, 44px)',
              fontStyle: 'italic',
              lineHeight: 1.3,
              letterSpacing: '-0.01em',
              color: '#1A1208',
            }}
          >
            "The most sustainable garment is the one you never need to replace."
          </blockquote>
          <p className="font-body font-light" style={{ fontSize: '14px', lineHeight: 1.85, color: 'rgba(26,18,8,0.45)' }}>
            We did not set out to be a sustainable brand. We set out to make clothing that lasts. The two turned out to be the same thing.
          </p>
        </div>
      </div>
    </section>
  )
}

function PillarsSection() {
  return (
    <section className="bg-[#F2EDE6] px-5 md:px-[52px]">
      <div className="max-w-[1240px] mx-auto">
        {PILLARS.map((pillar, i) => (
          <PillarRow key={pillar.number} pillar={pillar} index={i} isLast={i === PILLARS.length - 1} />
        ))}
      </div>
    </section>
  )
}

function PillarRow({ pillar, index, isLast }: { pillar: typeof PILLARS[0]; index: number; isLast: boolean }) {
  const { ref, inView } = useInView(0.15)
  return (
    <div
      ref={ref}
      className="py-10 md:py-20 border-b"
      style={{
        borderColor: isLast ? 'transparent' : 'rgba(26,18,8,0.08)',
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : 'translateY(20px)',
        transition: `all 0.9s ease ${index * 0.08}s`,
      }}
    >
      {/* Mobile: Stack all 3 elements */}
      {/* Desktop: 3-col grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_160px] gap-6 lg:gap-12">
        
        {/* Label */}
        <div>
          <span className="overline block mb-3" style={{ color: 'rgba(26,18,8,0.25)' }}>{pillar.number}</span>
          <h3 className="font-display font-light text-[#1A1208]" style={{ fontSize: 'clamp(20px, 5vw, 24px)', lineHeight: 1.1 }}>
            {pillar.title}
          </h3>
        </div>

        {/* Body */}
        <p className="font-body font-light" style={{ fontSize: '14px', lineHeight: 1.85, color: 'rgba(26,18,8,0.45)' }}>
          {pillar.body}
        </p>

        {/* Stat */}
        <div className="lg:text-right">
          <p className="font-display font-light text-[#1A1208] mb-1" style={{ fontSize: 'clamp(32px, 8vw, 36px)', letterSpacing: '-0.02em' }}>
            {pillar.stat}
          </p>
          <p className="overline" style={{ color: 'rgba(26,18,8,0.3)' }}>{pillar.statLabel}</p>
        </div>
      </div>
    </div>
  )
}

function CommitmentsSection({ commitments }: { commitments: { label: string }[] }) {
  const { ref, inView } = useInView(0.1)
  return (
    <section
      ref={ref}
      className="px-5 md:px-[52px] py-16 md:py-32"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : 'translateY(20px)',
        transition: 'all 1s ease'
      }}
    >
      {/* Mobile: Stack, Desktop: 2-col */}
      <div className="max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10 lg:gap-20">
        
        <div>
          <p className="overline mb-5">Our Commitments</p>
          <div style={{ width: '28px', height: '0.5px', backgroundColor: 'rgba(26,18,8,0.15)' }} />
        </div>
        
        <div>
          {commitments.map((c, i) => (
            <div
              key={i}
              className="flex items-center gap-4 py-4 border-b"
              style={{
                borderColor: 'rgba(26,18,8,0.07)',
                opacity: inView ? 1 : 0,
                transform: inView ? 'none' : 'translateX(-10px)',
                transition: `all 0.8s ease ${i * 0.07}s`,
              }}
            >
              <div style={{ width: '20px', height: '0.5px', backgroundColor: 'rgba(26,18,8,0.2)', flexShrink: 0 }} />
              <p className="font-body font-light" style={{ fontSize: '13px', color: 'rgba(26,18,8,0.6)' }}>
                {c.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ImageBreak() {
  const { ref, inView } = useInView(0.1)
  return (
    <section ref={ref} className="px-5 md:px-[52px] pb-16 md:pb-32">
      
      {/* Mobile: Stack, Desktop: 2-col */}
      <div className="max-w-[1240px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { img: '/sustainability/fabric.jpg', caption: 'Premium ring-spun cotton sourcing' },
          { img: '/sustainability/packaging.jpg', caption: 'Recycled kraft packaging' },
        ].map((item, i) => (
          <div
            key={i}
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? 'none' : 'translateY(20px)',
              transition: `all 1s ease ${i * 0.15}s`
            }}
          >
            <div
              className="relative overflow-hidden mb-3"
              style={{ aspectRatio: '4/3', backgroundColor: '#EDE7DC' }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: '-5%',
                  backgroundImage: `url('${item.img}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'brightness(0.9) saturate(0.8)'
                }}
              />
            </div>
            <p className="overline" style={{ color: 'rgba(26,18,8,0.3)' }}>{item.caption}</p>
          </div>
        ))}
      </div>
    </section>
  )
}