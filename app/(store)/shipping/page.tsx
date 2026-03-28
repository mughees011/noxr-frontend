'use client'

import { useState, useEffect, useRef } from 'react'

function useInView(threshold = 0.08) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return { ref, inView }
}

const SECTIONS = [
  {
    id: 'processing',
    number: '01',
    title: 'Order Processing',
    content: [
      'All orders are processed within 1 to 2 business days.',
      'Orders placed after 5 PM are processed the next business day.',
      'Orders are not processed on Sundays or public holidays.',
      'You will receive a confirmation email once your order is dispatched.',
    ],
  },
  {
    id: 'delivery-times',
    number: '02',
    title: 'Delivery Times',
    content: [
      'Karachi: 1 to 2 business days after dispatch.',
      'Major cities: 2 to 4 business days after dispatch.',
      'Remote areas: 3 to 6 business days after dispatch.',
      'Delivery timelines are estimates and may vary during peak seasons.',
    ],
  },
  {
    id: 'shipping-fees',
    number: '03',
    title: 'Shipping Fees',
    content: [
      'Standard shipping fee is calculated at checkout.',
      'Free shipping may apply on orders above a certain amount during campaigns.',
      'Shipping fees are non-refundable once the order is dispatched.',
    ],
  },
  {
    id: 'tracking',
    number: '04',
    title: 'Tracking Your Order',
    content: [
      'Once shipped, you will receive a tracking number via email.',
      'You may also track your order using the Track Order page on our website.',
      'If tracking does not update within 24 hours, contact our support team.',
    ],
  },
  {
    id: 'failed-delivery',
    number: '05',
    title: 'Failed Delivery Attempts',
    content: [
      'If delivery fails due to incorrect address or unavailability, the courier may attempt re-delivery.',
      'Repeated failed attempts may result in order cancellation.',
      'Additional shipping charges may apply for re-dispatch.',
    ],
  },
  {
    id: 'damaged',
    number: '06',
    title: 'Damaged or Lost Shipments',
    content: [
      'If your order arrives damaged, contact us within 48 hours of delivery.',
      'Provide your Order ID and clear images of the issue.',
      'We will investigate with the courier and resolve accordingly.',
    ],
  },
  {
    id: 'international',
    number: '07',
    title: 'International Shipping',
    content: [
      'International shipping may be available for select regions.',
      'Customs duties and taxes are the responsibility of the customer.',
      'Delivery times vary based on destination country.',
    ],
  },
  {
    id: 'contact',
    number: '08',
    title: 'Contact',
    content: [
      'For shipping enquiries, email hello@noxr.pk.',
      'Please include your Order ID in the subject line.',
      'We respond within 24 to 48 hours.',
    ],
  },
]

export default function PrivacyPolicyPage() {
  const [loaded, setLoaded] = useState(false)
  const [activeSection, setActiveSection] = useState('overview')
  const [showTOC, setShowTOC] = useState(false)

  useEffect(() => { setTimeout(() => setLoaded(true), 100) }, [])

  return (
    <div className="min-h-screen bg-[#F7F3ED]">

      {/* Header */}
      <div className="border-b px-5 md:px-[52px] pt-24 md:pt-32 pb-8 md:pb-16" style={{ borderColor: 'rgba(26,18,8,0.08)' }}>
        <div
          className="max-w-[1240px] mx-auto"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'none' : 'translateY(16px)',
            transition: 'all 1s ease 0.1s'
          }}
        >
          <p className="overline mb-5" style={{ color: 'rgba(26,18,8,0.3)' }}>Legal</p>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <h1
              className="font-display font-light text-[#1A1208]"
              style={{
                fontSize: 'clamp(42px, 10vw, 88px)',
                lineHeight: 0.9,
                letterSpacing: '-0.025em',
              }}
            >
              Shipping <br />
              <em className="italic">Info.</em>
            </h1>
            <div className="md:pb-2">
              <p className="overline mb-1" style={{ color: 'rgba(26,18,8,0.3)' }}>Effective date</p>
              <p className="font-body font-light" style={{ fontSize: '13px', color: 'rgba(26,18,8,0.5)' }}>January 2025</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile TOC Toggle */}
      <div className="lg:hidden sticky top-[60px] z-30 bg-[#F7F3ED] border-b px-5 py-4" style={{ borderColor: 'rgba(26,18,8,0.08)' }}>
        <button
          onClick={() => setShowTOC(!showTOC)}
          className="w-full flex items-center justify-between"
        >
          <span className="overline">Contents</span>
          <span className="font-display text-[#1A1208]" style={{ fontSize: '18px' }}>
            {showTOC ? '×' : '↓'}
          </span>
        </button>

        {showTOC && (
          <div className="mt-4 space-y-2">
            {SECTIONS.map(s => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={() => { setActiveSection(s.id); setShowTOC(false) }}
                className="flex items-baseline gap-3 py-2 border-b"
                style={{
                  borderColor: 'rgba(26,18,8,0.06)',
                  color: activeSection === s.id ? '#1A1208' : 'rgba(26,18,8,0.4)',
                  textDecoration: 'none',
                }}
              >
                <span className="overline text-[7px]" style={{ color: 'rgba(26,18,8,0.2)' }}>{s.number}</span>
                <span className="font-body font-light" style={{ fontSize: '12px' }}>{s.title}</span>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="px-5 md:px-[52px] py-12 md:py-16 pb-24 md:pb-40">
        <div className="max-w-[1240px] mx-auto">
          
          {/* Desktop: 2-col (TOC + Content) */}
          {/* Mobile: 1-col (Content only, TOC in dropdown above) */}
          <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-0 lg:gap-20">

            {/* Desktop TOC */}
            <div className="hidden lg:block sticky top-6 self-start" style={{ opacity: loaded ? 1 : 0, transition: 'opacity 1s ease 0.3s' }}>
              <p className="overline mb-5" style={{ color: 'rgba(26,18,8,0.25)' }}>Contents</p>
              <div className="flex flex-col">
                {SECTIONS.map(s => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    onClick={() => setActiveSection(s.id)}
                    className="flex gap-3 items-baseline py-2 border-b"
                    style={{
                      fontFamily: "'Jost', sans-serif",
                      fontSize: '11.5px',
                      fontWeight: 300,
                      color: activeSection === s.id ? '#1A1208' : 'rgba(26,18,8,0.35)',
                      textDecoration: 'none',
                      borderColor: 'rgba(26,18,8,0.06)',
                      transition: 'color 0.3s ease',
                    }}
                  >
                    <span className="overline text-[8px] flex-shrink-0" style={{ color: 'rgba(26,18,8,0.2)' }}>{s.number}</span>
                    {s.title}
                  </a>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col">
              {SECTIONS.map((section, si) => (
                <PolicySection key={section.id} section={section} index={si} onView={() => setActiveSection(section.id)} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PolicySection({ section, index, onView }: { section: typeof SECTIONS[0]; index: number; onView: () => void }) {
  const { ref, inView } = useInView(0.2)

  useEffect(() => { if (inView) onView() }, [inView, onView])

  return (
    <div
      id={section.id}
      ref={ref}
      className="py-10 md:py-14 border-b"
      style={{
        borderColor: index < SECTIONS.length - 1 ? 'rgba(26,18,8,0.08)' : 'transparent',
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : 'translateY(16px)',
        transition: 'all 0.9s ease',
      }}
    >
      {/* Mobile: Stack, Desktop: 2-col */}
      <div className="grid grid-cols-1 lg:grid-cols-[160px_1fr] gap-6 lg:gap-10">
        
        {/* Number + Title */}
        <div>
          <span className="overline block mb-2" style={{ color: 'rgba(26,18,8,0.2)' }}>{section.number}</span>
          <h2
            className="font-display font-light text-[#1A1208]"
            style={{ fontSize: 'clamp(18px, 4vw, 22px)', lineHeight: 1.15 }}
          >
            {section.title}
          </h2>
        </div>

        {/* Content */}
        <div className="space-y-5">
          {section.content.map((para, i) => (
            <p
              key={i}
              className="font-body font-light"
              style={{
                fontSize: '14px',
                lineHeight: 1.85,
                color: para.startsWith('Email:') || para.startsWith('NOXR Studio')
                  ? 'rgba(26,18,8,0.65)'
                  : 'rgba(26,18,8,0.5)',
              }}
            >
              {para}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}