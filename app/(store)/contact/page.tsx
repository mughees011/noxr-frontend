'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'

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

const CONTACT_INFO = [
  {
    title: 'Email',
    value: 'noxrwear@gmail.com',
    subtitle: 'Response within 24 hours',
    link: 'mailto:noxrwear@gmail.com',
  },
  {
    title: 'Phone',
    value: '+92 337 7033279',
    subtitle: 'Mon-Sat, 10AM-6PM PKT',
    link: 'tel:+923377033279',
  },
  {
    title: 'Studio',
    value: 'Karachi, Pakistan',
    subtitle: 'By appointment only',
    link: null,
  },
]

export default function ContactPage() {
  const [loaded, setLoaded] = useState(false)
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle')
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const { ref: formRef, inView: formIn } = useInView()

  useEffect(() => { setTimeout(() => setLoaded(true), 100) }, [])

  const update = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setFormState('submitting')

  try {
    await api.post('/contact', form)

    setFormState('success')
    setForm({ name: '', email: '', subject: '', message: '' })

    setTimeout(() => setFormState('idle'), 3000)

  } catch (error) {
    setFormState('idle')
    alert('Something went wrong. Please try again.')
  }
}

  return (
    <div className="min-h-screen bg-[#F7F3ED]">

      {/* ── Header ── */}
      <section className="px-5 md:px-[52px] pt-24 md:pt-32 pb-12 md:pb-16 border-b" style={{ borderColor: 'rgba(26,18,8,0.08)' }}>
        <div
          className="max-w-[1240px] mx-auto"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'none' : 'translateY(20px)',
            transition: 'all 1.2s ease 0.1s',
          }}
        >
          <p className="overline mb-5">Get in Touch</p>
          <h1
            className="font-display font-light text-[#1A1208] mb-6"
            style={{
              fontSize: 'clamp(42px, 10vw, 96px)',
              lineHeight: 0.9,
              letterSpacing: '-0.025em',
            }}
          >
            Contact
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
            Have a question about an order, product, or collaboration? We're here to help.
          </p>
        </div>
      </section>

      {/* ── Main Content ── */}
      <div className="px-5 md:px-[52px] py-16 md:py-24">
        <div className="max-w-[1240px] mx-auto">
          
          {/* Mobile: Stack form → info cards */}
          {/* Desktop: 2-col (form left, info right) */}
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12 lg:gap-20">
            
            {/* Form */}
            <div
              ref={formRef}
              style={{
                opacity: formIn ? 1 : 0,
                transform: formIn ? 'none' : 'translateY(20px)',
                transition: 'all 1s ease',
              }}
            >
              <h2
                className="font-display font-light text-[#1A1208] mb-8"
                style={{ fontSize: 'clamp(24px, 5vw, 32px)', letterSpacing: '-0.01em' }}
              >
                Send us a message
              </h2>

              {formState === 'success' ? (
                <div
                  className="p-6 border mb-8"
                  style={{
                    borderColor: 'rgba(107,143,94,0.3)',
                    backgroundColor: 'rgba(107,143,94,0.05)',
                  }}
                >
                  <p
                    className="font-body font-light"
                    style={{ fontSize: '13px', color: 'rgba(107,143,94,0.9)' }}
                  >
                    ✓ Message sent. We'll get back to you within 24 hours.
                  </p>
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Name + Email row on desktop, stack on mobile */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Name"
                    type="text"
                    value={form.name}
                    onChange={v => update('name', v)}
                    placeholder="Your name"
                  />
                  <FormField
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={v => update('email', v)}
                    placeholder="your@email.com"
                  />
                </div>

                <FormField
                  label="Subject"
                  type="text"
                  value={form.subject}
                  onChange={v => update('subject', v)}
                  placeholder="What's this about?"
                />

                <div>
                  <label
                    className="font-body font-light block mb-3"
                    style={{
                      fontSize: '9px',
                      letterSpacing: '0.38em',
                      textTransform: 'uppercase',
                      color: 'rgba(26,18,8,0.35)',
                    }}
                  >
                    Message
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={form.message}
                    onChange={e => update('message', e.target.value)}
                    placeholder="Tell us what you need help with..."
                    className="w-full bg-transparent border-b resize-none outline-none"
                    style={{
                      borderColor: 'rgba(26,18,8,0.2)',
                      padding: '12px 0',
                      fontFamily: "'Jost', sans-serif",
                      fontSize: '14px',
                      fontWeight: 300,
                      color: '#1A1208',
                      transition: 'border-color 0.3s ease',
                    }}
                    onFocus={e => { e.target.style.borderBottomColor = 'rgba(26,18,8,0.5)' }}
                    onBlur={e => { e.target.style.borderBottomColor = 'rgba(26,18,8,0.2)' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={formState === 'submitting'}
                  className="btn-primary"
                  style={{ opacity: formState === 'submitting' ? 0.6 : 1 }}
                >
                  <span>{formState === 'submitting' ? 'Sending…' : 'Send Message'}</span>
                </button>
              </form>
            </div>

            {/* Info Cards */}
            <div className="space-y-6">
              {CONTACT_INFO.map((info, i) => (
                <ContactCard key={info.title} info={info} index={i} />
              ))}

              {/* FAQ link */}
              <div
                className="pt-8 border-t"
                style={{ borderColor: 'rgba(26,18,8,0.08)' }}
              >
                <p
                  className="font-body font-light mb-4"
                  style={{ fontSize: '11px', color: 'rgba(26,18,8,0.4)' }}
                >
                  Looking for quick answers?
                </p>
                <Link href="/faq" className="btn-ghost">
                  Visit our FAQ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Map placeholder ── */}
      {/* <div className="px-5 md:px-[52px] pb-16 md:pb-24">
        <div
          className="max-w-[1240px] mx-auto relative overflow-hidden"
          style={{ aspectRatio: '16/9', backgroundColor: '#EDE7DC' }}
        >
          Replace with actual map embed
          <div className="absolute inset-0 flex items-center justify-center">
            <p
              className="font-body font-light"
              style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(26,18,8,0.2)' }}
            >
              Map - Karachi, Pakistan
            </p>
          </div>
        </div>
      </div> */}
    </div>
  )
}

function FormField({
  label,
  type,
  value,
  onChange,
  placeholder,
}: {
  label: string
  type: string
  value: string
  onChange: (v: string) => void
  placeholder: string
}) {
  return (
    <div>
      <label
        className="font-body font-light block mb-3"
        style={{
          fontSize: '9px',
          letterSpacing: '0.38em',
          textTransform: 'uppercase',
          color: 'rgba(26,18,8,0.35)',
        }}
      >
        {label}
      </label>
      <input
        type={type}
        required
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent border-b outline-none"
        style={{
          borderColor: 'rgba(26,18,8,0.2)',
          padding: '12px 0',
          fontFamily: "'Jost', sans-serif",
          fontSize: '14px',
          fontWeight: 300,
          color: '#1A1208',
          transition: 'border-color 0.3s ease',
        }}
        onFocus={e => { e.target.style.borderBottomColor = 'rgba(26,18,8,0.5)' }}
        onBlur={e => { e.target.style.borderBottomColor = 'rgba(26,18,8,0.2)' }}
      />
    </div>
  )
}

function ContactCard({ info, index }: { info: typeof CONTACT_INFO[0]; index: number }) {
  const { ref, inView } = useInView()
  
  const content = (
    <div
      ref={ref}
      className="p-6 border"
      style={{
        borderColor: 'rgba(26,18,8,0.08)',
        backgroundColor: '#F2EDE6',
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : 'translateY(16px)',
        transition: `all 0.8s ease ${index * 0.1}s`,
      }}
    >
      <p
        className="font-body font-light mb-2"
        style={{
          fontSize: '8.5px',
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: 'rgba(26,18,8,0.3)',
        }}
      >
        {info.title}
      </p>
      <p
        className="font-display font-light text-[#1A1208] mb-1"
        style={{ fontSize: '18px', letterSpacing: '0.01em' }}
      >
        {info.value}
      </p>
      <p
        className="font-body font-light"
        style={{ fontSize: '11px', color: 'rgba(26,18,8,0.35)' }}
      >
        {info.subtitle}
      </p>
    </div>
  )

  return info.link ? (
    <a
      href={info.link}
      style={{ textDecoration: 'none', display: 'block' }}
    >
      {content}
    </a>
  ) : content
}