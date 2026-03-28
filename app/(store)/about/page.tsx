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

const VALUES = [
  {
    number: '01',
    title: 'Quality First',
    body: 'Every fabric is sourced with intention. We refuse to cut corners — from the weight of the cotton to the finish of the stitching.',
  },
  {
    number: '02',
    title: 'No Noise',
    body: "We don't chase trends. NOXR is built on restraint — each piece is designed to last beyond the season it dropped.",
  },
  {
    number: '03',
    title: 'Limited Always',
    body: "We keep quantities intentionally small. Once it's gone, it's gone. That's the point.",
  },
]

export default function AboutPage() {
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
            position: 'absolute',
            inset: 0,
            backgroundImage: "url('/about/hero.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center 20%',
            filter: 'brightness(0.45) saturate(0.7) contrast(1.05)',
            transform: loaded ? 'scale(1)' : 'scale(1.04)',
            transition: 'transform 2.4s cubic-bezier(0.25,0.46,0.45,0.94)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(26,18,8,0.85) 0%, rgba(26,18,8,0.1) 60%, transparent 100%)',
          }}
        />

        {/* Content */}
        <div
          className="relative w-full px-5 md:px-[52px] pb-12 md:pb-20 max-w-[1240px] mx-auto"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'none' : 'translateY(24px)',
            transition: 'all 1.6s cubic-bezier(0.25,0.46,0.45,0.94) 0.3s',
          }}
        >
          <p
            className="font-body font-light mb-4"
            style={{ fontSize: '9px', letterSpacing: '0.45em', textTransform: 'uppercase', color: 'rgba(247,243,237,0.4)' }}
          >
            Est. 2023 · Karachi
          </p>
          <h1
            className="font-display font-light text-[#F7F3ED] mb-6"
            style={{
              fontSize: 'clamp(56px, 14vw, 144px)',
              lineHeight: 0.88,
              letterSpacing: '-0.025em',
            }}
          >
            NOXR
          </h1>
          <p
            className="font-body font-light"
            style={{ fontSize: '14px', lineHeight: 1.75, color: 'rgba(247,243,237,0.5)', maxWidth: '420px' }}
          >
            A menswear brand built on the belief that less — done better — is always more.
          </p>
        </div>
      </section>

      {/* ── Mission ── */}
      <MissionSection />

      {/* ── Stats strip ── */}
      <StatsStrip />

      {/* ── Values ── */}
      <ValuesSection />

      {/* ── Lookbook split ── */}
      <LookbookSection />

      {/* ── CTA ── */}
      <div
        className="border-t px-5 md:px-[52px] py-12 md:py-20"
        style={{ borderColor: 'rgba(26,18,8,0.08)' }}
      >
        <div className="max-w-[1240px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <h2
            className="font-display font-light text-[#1A1208]"
            style={{ fontSize: 'clamp(28px, 7vw, 52px)', letterSpacing: '-0.01em' }}
          >
            Ready to shop?
          </h2>
          <Link href="/shop" className="btn-primary">
            <span>Browse the Collection</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

function MissionSection() {
  const { ref, inView } = useInView()
  return (
    <section
      ref={ref}
      className="px-5 md:px-[52px] py-16 md:py-32"
    >
      <div className="max-w-[1240px] mx-auto">
        
        {/* Mobile: Stack, Desktop: 2-col */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          
          <div
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? 'none' : 'translateY(20px)',
              transition: 'all 1s ease',
            }}
          >
            <p className="overline mb-6">Our Story</p>
            <h2
              className="font-display font-light text-[#1A1208]"
              style={{ fontSize: 'clamp(28px, 7vw, 60px)', lineHeight: 1.05, letterSpacing: '-0.015em' }}
            >
              Built in the quiet.
              <br />
              <em className="italic">Worn in the noise.</em>
            </h2>
          </div>

          <div
            className="space-y-5"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? 'none' : 'translateY(20px)',
              transition: 'all 1s ease 0.2s',
            }}
          >
            {[
              'NOXR started as a response. To oversaturated feeds, to fast fashion, to brands that shout. We wanted to make something that didn\'t need to explain itself.',
              'Every piece we release is designed with a single question in mind: will this still feel right in five years? If the answer isn\'t yes, it doesn\'t make the cut.',
              'We\'re based in Karachi. We ship across Pakistan. We\'re building something slowly, on purpose.',
            ].map((p, i) => (
              <p
                key={i}
                className="font-body font-light"
                style={{ fontSize: '14px', lineHeight: 1.8, color: 'rgba(26,18,8,0.45)' }}
              >
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function StatsStrip() {
  const { ref, inView } = useInView()
  const stats = [
    { value: '2023', label: 'Founded' },
    { value: '3', label: 'Collections' },
    { value: '25+', label: 'Pieces designed' },
    { value: '100%', label: 'Cotton quality' },
  ]
  return (
    <div
      ref={ref}
      className="border-t border-b px-5 md:px-[52px] py-12 md:py-16 bg-[#F2EDE6]"
      style={{ borderColor: 'rgba(26,18,8,0.08)' }}
    >
      {/* Mobile: 2x2, Desktop: 4 cols */}
      <div
        className="max-w-[1240px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8"
        style={{
          opacity: inView ? 1 : 0,
          transition: 'opacity 1s ease',
        }}
      >
        {stats.map((s, i) => (
          <div
            key={s.label}
            className="text-center"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? 'none' : 'translateY(16px)',
              transition: `all 0.8s ease ${i * 0.1}s`,
            }}
          >
            <p
              className="font-display font-light text-[#1A1208] mb-2"
              style={{ fontSize: 'clamp(32px, 8vw, 52px)', letterSpacing: '-0.01em' }}
            >
              {s.value}
            </p>
            <p className="overline">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function ValuesSection() {
  const { ref, inView } = useInView()
  return (
    <section className="px-5 md:px-[52px] py-16 md:py-32">
      <div className="max-w-[1240px] mx-auto">
        <p
          ref={ref as any}
          className="overline mb-10 md:mb-16"
          style={{ opacity: inView ? 1 : 0, transition: 'opacity 0.9s ease' }}
        >
          What We Stand For
        </p>
        <div>
          {VALUES.map((val, i) => (
            <ValueRow key={val.number} val={val} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ValueRow({ val, index }: { val: typeof VALUES[0]; index: number }) {
  const { ref, inView } = useInView(0.2)
  return (
    <div
      ref={ref}
      className="py-8 md:py-12 border-t"
      style={{
        borderColor: 'rgba(26,18,8,0.08)',
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : 'translateY(16px)',
        transition: `all 0.9s ease ${index * 0.1}s`,
      }}
    >
      {/* Mobile: Stack, Desktop: 2-col with number/title left, body right */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6 lg:gap-8">
        
        <div className="flex items-start gap-4">
          <span
            className="font-body font-light"
            style={{ fontSize: '8px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(26,18,8,0.25)', marginTop: '4px' }}
          >
            {val.number}
          </span>
          <h3
            className="font-display font-light text-[#1A1208]"
            style={{ fontSize: 'clamp(20px, 5vw, 28px)', letterSpacing: '-0.01em' }}
          >
            {val.title}
          </h3>
        </div>
        
        <div className="lg:pl-10">
          <p
            className="font-body font-light"
            style={{ fontSize: '14px', lineHeight: 1.8, color: 'rgba(26,18,8,0.45)' }}
          >
            {val.body}
          </p>
        </div>
      </div>
    </div>
  )
}

function LookbookSection() {
  const { ref, inView } = useInView(0.1)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const check = () => {
      setIsDesktop(window.innerWidth >= 768)
    }

    check()
    window.addEventListener('resize', check)

    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <section ref={ref} className="px-5 md:px-[52px] pb-16 md:pb-32">
      <div className="max-w-[1240px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { img: '/about/lookbook-1.jpg', offset: false },
          { img: '/about/lookbook-2.jpg', offset: true },
        ].map((item, i) => (
          <div
            key={i}
            className="relative overflow-hidden"
            style={{
              aspectRatio: '4/5',
              backgroundColor: '#EDE7DC',
              marginTop: item.offset && isDesktop ? '60px' : 0,
              opacity: inView ? 1 : 0,
              transform: inView ? 'none' : `translateY(${i === 0 ? 20 : 40}px)`,
              transition: `all 1.2s cubic-bezier(0.25,0.46,0.45,0.94) ${i * 0.2}s`,
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: '-5%',
                backgroundImage: `url('${item.img}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center top',
                filter: 'brightness(0.9) saturate(0.8)',
              }}
            />
          </div>
        ))}
      </div>
    </section>
  )
}