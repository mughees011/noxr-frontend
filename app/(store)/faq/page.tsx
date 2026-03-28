'use client'

import { useState, useRef, useEffect } from 'react'

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
  }, [])
  return { ref, inView }
}

const CATEGORIES = ['All', 'Orders', 'Shipping', 'Returns', 'Products', 'Account'] as const
type Category = (typeof CATEGORIES)[number]

const FAQS = [
  {
    category: 'Orders',
    question: 'How do I track my order?',
    answer: 'Once your order ships, you\'ll receive a tracking number via email. You can also log into your account and view order status under "My Orders". Tracking updates may take 24-48 hours to appear after shipment.',
  },
  {
    category: 'Orders',
    question: 'Can I modify or cancel my order?',
    answer: 'Orders can be modified or cancelled within 2 hours of placement. Contact us immediately at hello@noxr.pk with your order number. Once an order is processed, we cannot guarantee changes.',
  },
  {
    category: 'Shipping',
    question: 'What are your shipping rates?',
    answer: 'We offer free shipping on orders over PKR 5,000 within Pakistan. For orders below PKR 5,000, standard shipping is PKR 250. Express shipping (1-2 days) is available for PKR 500.',
  },
  {
    category: 'Shipping',
    question: 'How long does shipping take?',
    answer: 'Standard shipping takes 3-5 business days within Pakistan. Express shipping takes 1-2 business days. All orders placed before 2 PM ship the same day. Orders placed after 2 PM ship the next business day.',
  },
  {
    category: 'Shipping',
    question: 'Do you ship internationally?',
    answer: 'Currently, we only ship within Pakistan. International shipping is not available at this time, but we\'re working on expanding our delivery network.',
  },
  {
    category: 'Returns',
    question: 'What is your return policy?',
    answer: 'We accept returns within 7 days of delivery. Items must be unworn, unwashed, and have all original tags attached. Return shipping is free for exchanges. For refunds, return shipping costs PKR 250.',
  },
  {
    category: 'Returns',
    question: 'How do I initiate a return?',
    answer: 'Log into your account, go to "My Orders", and select "Return Item". You can also email hello@noxr.pk with your order number and reason for return. We\'ll send you a prepaid return label within 24 hours.',
  },
  {
    category: 'Returns',
    question: 'When will I receive my refund?',
    answer: 'Refunds are processed within 5-7 business days of receiving your return. The amount will be credited to your original payment method. Bank transfers may take an additional 3-5 business days to reflect.',
  },
  {
    category: 'Products',
    question: 'How do I know what size to order?',
    answer: 'Check our Size Guide page for detailed measurements. All garments are measured flat and compared to body measurements. If you\'re between sizes, we recommend sizing up for a relaxed fit or staying true to size for a fitted look.',
  },
  {
    category: 'Products',
    question: 'Are your products pre-shrunk?',
    answer: 'Yes, all cotton garments are pre-washed to minimize shrinkage. However, some natural shrinkage (2-3%) may still occur with hot water washes. We recommend washing cold and air drying for best results.',
  },
  {
    category: 'Products',
    question: 'Will sold-out items be restocked?',
    answer: 'No. NOXR operates on a limited-quantity model. Once an item sells out, it will not be restocked. We release new drops periodically — subscribe to our newsletter to be notified.',
  },
  {
    category: 'Account',
    question: 'How do I create an account?',
    answer: 'Click "Sign In" in the header, then select "Create Account". You\'ll need an email address and password. Account holders get early access to new drops, order tracking, and faster checkout.',
  },
  {
    category: 'Account',
    question: 'I forgot my password. How do I reset it?',
    answer: 'Go to the login page and click "Forgot Password". Enter your email address and we\'ll send you a reset link. The link is valid for 1 hour.',
  },
]

export default function FAQPage() {
  const [loaded, setLoaded] = useState(false)
  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const [search, setSearch] = useState('')
  const [openQuestion, setOpenQuestion] = useState<number | null>(null)
  const { ref: headerRef, inView: headerIn } = useInView()

  useEffect(() => { setTimeout(() => setLoaded(true), 100) }, [])

  const filtered = FAQS.filter(faq => {
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory
    const matchesSearch = search === '' ||
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-[#F7F3ED]">

      {/* Header */}
      <div className="border-b px-5 md:px-[52px] pt-24 md:pt-32 pb-8 md:pb-12" style={{ borderColor: 'rgba(26,18,8,0.08)' }}>
        <div
          ref={headerRef}
          className="max-w-[1240px] mx-auto"
          style={{
            opacity: headerIn ? 1 : 0,
            transform: headerIn ? 'none' : 'translateY(20px)',
            transition: 'all 1s ease',
          }}
        >
          <p className="overline mb-5">Help Center</p>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <h1
              className="font-display font-light text-[#1A1208]"
              style={{
                fontSize: 'clamp(42px, 10vw, 96px)',
                lineHeight: 0.9,
                letterSpacing: '-0.025em',
              }}
            >
              FAQ
            </h1>
            <p
              className="font-body font-light md:pb-2"
              style={{ fontSize: '13px', color: 'rgba(26,18,8,0.4)', maxWidth: '300px' }}
            >
              Find answers to common questions or contact us for help.
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="sticky top-[60px] md:top-0 z-30 bg-[#F7F3ED] border-b px-5 md:px-[52px] py-4" style={{ borderColor: 'rgba(26,18,8,0.08)' }}>
        <div className="max-w-[1240px] mx-auto">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search questions..."
            className="w-full bg-transparent border-b outline-none"
            style={{
              borderColor: 'rgba(26,18,8,0.2)',
              padding: '12px 0',
              fontFamily: "'Jost', sans-serif",
              fontSize: '14px',
              fontWeight: 300,
              color: '#1A1208',
            }}
            onFocus={e => { e.target.style.borderBottomColor = 'rgba(26,18,8,0.5)' }}
            onBlur={e => { e.target.style.borderBottomColor = 'rgba(26,18,8,0.2)' }}
          />
        </div>
      </div>

      {/* Categories - horizontal scroll on mobile */}
      <div className="border-b px-5 md:px-[52px] py-4 overflow-x-auto no-scrollbar" style={{ borderColor: 'rgba(26,18,8,0.08)' }}>
        <div className="max-w-[1240px] mx-auto flex gap-3 md:gap-6">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="whitespace-nowrap px-5 md:px-4 py-2 md:py-0 flex-shrink-0"
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: '9px',
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: activeCategory === cat ? '#F7F3ED' : 'rgba(26,18,8,0.4)',
                backgroundColor: activeCategory === cat ? '#1A1208' : 'transparent',
                border: `0.5px solid ${activeCategory === cat ? '#1A1208' : 'rgba(26,18,8,0.15)'}`,
                fontWeight: 300,
                transition: 'all 0.3s ease',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Questions */}
      <div className="px-5 md:px-[52px] py-12 md:py-20 pb-24 md:pb-40">
        <div className="max-w-[900px] mx-auto">
          
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <h2
                className="font-display font-light text-[#1A1208] mb-3"
                style={{ fontSize: 'clamp(24px, 5vw, 32px)' }}
              >
                No results found
              </h2>
              <p className="font-body font-light" style={{ fontSize: '13px', color: 'rgba(26,18,8,0.4)' }}>
                Try a different search term or category.
              </p>
            </div>
          ) : (
            <div className="space-y-0">
              {filtered.map((faq, i) => (
                <FAQItem
                  key={i}
                  faq={faq}
                  index={i}
                  isOpen={openQuestion === i}
                  onToggle={() => setOpenQuestion(openQuestion === i ? null : i)}
                />
              ))}
            </div>
          )}

          {/* Still need help */}
          <div className="mt-16 p-6 md:p-8 border text-center" style={{ borderColor: 'rgba(26,18,8,0.08)', backgroundColor: '#F2EDE6' }}>
            <p className="overline mb-4">Still need help?</p>
            <h3
              className="font-display font-light text-[#1A1208] mb-6"
              style={{ fontSize: 'clamp(22px, 5vw, 28px)', letterSpacing: '-0.01em' }}
            >
              We're here for you.
            </h3>
            <p className="font-body font-light mb-8" style={{ fontSize: '13px', color: 'rgba(26,18,8,0.45)', lineHeight: 1.75 }}>
              Email us at <a href="mailto:hello@noxr.pk" style={{ color: '#1A1208', textDecoration: 'none', borderBottom: '0.5px solid rgba(26,18,8,0.3)' }}>hello@noxr.pk</a> and we'll respond within 24 hours.
            </p>
            <a href="mailto:hello@noxr.pk" className="btn-primary inline-block">
              <span>Contact Support</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

function FAQItem({ faq, index, isOpen, onToggle }: { faq: typeof FAQS[0]; index: number; isOpen: boolean; onToggle: () => void }) {
  const { ref, inView } = useInView(0.1)

  return (
    <div
      ref={ref}
      className="border-b"
      style={{
        borderColor: 'rgba(26,18,8,0.08)',
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : 'translateY(12px)',
        transition: `all 0.7s ease ${index * 0.05}s`,
      }}
    >
      <button
        onClick={onToggle}
        className="w-full text-left py-6 flex items-start justify-between gap-6"
        style={{ minHeight: '48px' }}
      >
        <div className="flex-1">
          <p className="overline mb-2" style={{ color: 'rgba(26,18,8,0.25)' }}>{faq.category}</p>
          <h3
            className="font-display font-light text-[#1A1208]"
            style={{ fontSize: 'clamp(16px, 4vw, 20px)', lineHeight: 1.3 }}
          >
            {faq.question}
          </h3>
        </div>
        <span
          className="font-display flex-shrink-0 mt-1"
          style={{
            fontSize: '24px',
            color: 'rgba(26,18,8,0.3)',
            transform: isOpen ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.3s ease',
          }}
        >
          ↓
        </span>
      </button>

      {isOpen && (
        <div
          className="pb-6 pl-0 md:pl-6"
          style={{
            animation: 'fadeIn 0.4s ease',
          }}
        >
          <p
            className="font-body font-light"
            style={{
              fontSize: '14px',
              lineHeight: 1.85,
              color: 'rgba(26,18,8,0.5)',
            }}
          >
            {faq.answer}
          </p>
        </div>
      )}
    </div>
  )
}