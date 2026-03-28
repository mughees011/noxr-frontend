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
      'NOXR Studio ("NOXR", "we", "us", or "our") operates noxr.pk. This Privacy Policy describes how we collect, use, and protect your personal information when you visit our website or make a purchase.',
      'We take your privacy seriously. We collect only what is necessary to fulfil your order and improve our service. We do not sell your data. We do not share it with third parties beyond what is required to deliver your order.',
      'By using our website, you agree to the collection and use of information in accordance with this policy. This policy is effective as of January 2025.',
    ],
  },
  {
    id: 'collection',
    number: '02',
    title: 'Information We Collect',
    content: [
      'When you place an order, we collect: your name, email address, phone number, shipping address, and payment information. Payment details are processed through encrypted third-party gateways and are never stored on our servers.',
      'When you browse our website, we automatically collect: your IP address, browser type, pages viewed, and time spent on the site. This data is used only in aggregate form to improve our site performance.',
      'If you subscribe to our newsletter or contact us, we store your email address and the content of your communication. You may unsubscribe from marketing emails at any time.',
      'We do not collect sensitive personal data such as race, religion, health information, or financial data beyond what is necessary to process payments.',
    ],
  },
  {
    id: 'use',
    number: '03',
    title: 'How We Use Your Information',
    content: [
      'Order fulfilment: to process and deliver your purchases, send order confirmations, tracking information, and handle returns or exchanges.',
      'Customer service: to respond to your enquiries, resolve disputes, and provide support when needed.',
      'Site improvement: anonymised, aggregated browsing data helps us understand how our site is used and where to improve the experience.',
      'Marketing communications: if you have opted in, we may send you information about new drops, exclusive offers, and brand updates. You can opt out at any time.',
      'Legal compliance: we may use or disclose your information when required by law, court order, or governmental authority.',
    ],
  },
  {
    id: 'sharing',
    number: '04',
    title: 'Information Sharing',
    content: [
      'We do not sell, trade, or rent your personal information to third parties.',
      'We share information only with service providers necessary to operate our business: courier partners (to deliver your order), payment processors (to handle transactions securely), and email service providers (to send transactional and marketing emails). These parties are contractually obligated to keep your data confidential.',
      'In the event of a merger, acquisition, or sale of assets, your data may be transferred. We will notify you via email and provide choices if such a transfer materially changes how your data is used.',
    ],
  },
  {
    id: 'cookies',
    number: '05',
    title: 'Cookies',
    content: [
      'We use cookies to improve your browsing experience, remember your preferences, and understand how our site is used.',
      'Essential cookies are required for the site to function (e.g. your shopping cart). You cannot opt out of these.',
      'Analytics cookies help us understand traffic patterns. These are anonymised and do not identify you personally.',
      'You can control or delete cookies through your browser settings at any time. Disabling cookies may affect some site functionality.',
    ],
  },
  {
    id: 'security',
    number: '06',
    title: 'Data Security',
    content: [
      'We use industry-standard security measures to protect your personal information: SSL encryption for all data transmission, secure password hashing for account credentials, and restricted internal access on a need-to-know basis.',
      'No method of transmission over the internet is 100% secure. While we strive to use commercially acceptable means to protect your data, we cannot guarantee absolute security.',
      'In the event of a data breach that affects your rights or freedoms, we will notify affected users within 72 hours of becoming aware of the breach.',
    ],
  },
  {
    id: 'rights',
    number: '07',
    title: 'Your Rights',
    content: [
      'You have the right to: access the personal data we hold about you, correct inaccurate data, request deletion of your data, object to processing of your data, and request a copy of your data in a portable format.',
      'To exercise any of these rights, email hello@noxr.pk with the subject line "Data Request". We will respond within 30 days.',
      'You have the right to unsubscribe from marketing communications at any time using the unsubscribe link in any email we send, or by contacting us directly.',
    ],
  },
  {
    id: 'retention',
    number: '08',
    title: 'Data Retention',
    content: [
      'We retain your personal information for as long as necessary to fulfil the purposes described in this policy, unless a longer retention period is required by law.',
      'Order data is retained for 7 years for accounting and legal compliance purposes.',
      'Newsletter subscriber data is retained until you unsubscribe.',
      'Customer support communications are retained for 3 years.',
      'You may request deletion of your account and associated data at any time, subject to our legal retention obligations.',
    ],
  },
  {
    id: 'changes',
    number: '09',
    title: 'Changes to This Policy',
    content: [
      'We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page with an updated effective date.',
      'For material changes that significantly affect your rights, we will send an email notification to users with active accounts.',
      'We encourage you to review this policy periodically. Your continued use of our site after changes are posted constitutes acceptance of the updated policy.',
    ],
  },
  {
    id: 'contact',
    number: '10',
    title: 'Contact',
    content: [
      'If you have questions about this Privacy Policy or how we handle your data, contact us at:',
      'Email: hello@noxr.pk',
      'NOXR Studio, Karachi, Pakistan',
      'We will respond to all privacy-related enquiries within 5 business days.',
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
              Privacy<br />
              <em className="italic">Policy.</em>
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