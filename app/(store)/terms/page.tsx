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
    id: 'overview',
    number: '01',
    title: 'Overview',
    content: [
      'These Terms of Service govern your use of noxr.pk and all purchases made from NOXR Studio.',
      'By accessing our website or placing an order, you agree to be bound by these Terms.',
      'If you do not agree with any part of these Terms, you may not use our services.',
    ],
  },
  {
    id: 'eligibility',
    number: '02',
    title: 'Eligibility',
    content: [
      'You must be at least 18 years old or using the website under the supervision of a parent or legal guardian.',
      'You agree to provide accurate, complete, and current information when placing an order or creating an account.',
      'We reserve the right to refuse service to anyone for violation of these Terms.',
    ],
  },
  {
    id: 'orders',
    number: '03',
    title: 'Orders & Acceptance',
    content: [
      'All orders are subject to availability and confirmation.',
      'We reserve the right to cancel or refuse any order at our discretion.',
      'In the event of pricing errors or stock discrepancies, we may cancel your order and issue a refund.',
      'Order confirmation does not guarantee acceptance until payment is successfully processed.',
    ],
  },
  {
    id: 'pricing',
    number: '04',
    title: 'Pricing & Payment',
    content: [
      'All prices are listed in PKR unless otherwise stated.',
      'We reserve the right to modify prices at any time without prior notice.',
      'Payment must be completed at checkout through approved payment methods.',
      'For Cash on Delivery orders, payment is due upon delivery.',
    ],
  },
  {
    id: 'shipping',
    number: '05',
    title: 'Shipping & Delivery',
    content: [
      'Delivery timelines are estimates and not guaranteed.',
      'NOXR is not responsible for delays caused by courier services or unforeseen circumstances.',
      'Risk of loss and title for items pass to you upon delivery.',
    ],
  },
  {
    id: 'returns',
    number: '06',
    title: 'Returns & Exchanges',
    content: [
      'Returns and exchanges are governed by our Returns & Exchanges Policy.',
      'We reserve the right to refuse returns that do not meet our eligibility criteria.',
      'Refunds are processed according to the timelines stated in our policy.',
    ],
  },
  {
    id: 'intellectual',
    number: '07',
    title: 'Intellectual Property',
    content: [
      'All content on this website, including logos, images, designs, text, and graphics, is the property of NOXR Studio.',
      'You may not reproduce, distribute, or use any content without written permission.',
      'Unauthorized use may result in legal action.',
    ],
  },
  {
    id: 'liability',
    number: '08',
    title: 'Limitation of Liability',
    content: [
      'NOXR shall not be liable for any indirect, incidental, or consequential damages arising from use of our website or products.',
      'Our total liability shall not exceed the amount paid for the product in question.',
      'We do not guarantee uninterrupted or error-free website operation.',
    ],
  },
  {
    id: 'privacy',
    number: '09',
    title: 'Privacy',
    content: [
      'Your use of our services is also governed by our Privacy Policy.',
      'By using our website, you consent to our collection and use of information as described therein.',
    ],
  },
  {
    id: 'changes',
    number: '10',
    title: 'Changes to Terms',
    content: [
      'We reserve the right to update or modify these Terms at any time.',
      'Changes take effect immediately upon posting on this page.',
      'Continued use of our website constitutes acceptance of updated Terms.',
    ],
  },
  {
    id: 'contact',
    number: '11',
    title: 'Contact',
    content: [
      'For questions regarding these Terms, contact hello@noxr.pk.',
      'NOXR Studio, Karachi, Pakistan.',
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
              Terms of<br />
              <em className="italic">Service.</em>
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