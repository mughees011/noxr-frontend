'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

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

const APPROACH_BLOCKS = [
  {
    title: 'Structured Environment',
    description: 'Clear systems. Defined processes. No chaos.',
  },
  {
    title: 'Ownership Mindset',
    description: 'Your work. Your responsibility. Your growth.',
  },
  {
    title: 'Long-term Brand Building',
    description: 'We measure in years, not quarters.',
  },
  {
    title: 'Creative Discipline',
    description: 'Creativity within constraints. Intention over impulse.',
  },
]


interface OpenPosition {
  title: string
  location: string
  type: string
  description: string
}

const OPEN_POSITIONS: OpenPosition[] = [
  // Example positions - remove if not hiring
  // {
  //   title: 'Content Creation Intern',
  //   location: 'Karachi',
  //   type: 'Internship',
  //   description: 'Photography, videography, and social media content for product drops.',
  // },
]

const INTERNSHIP_PROGRAMS = [
  {
    title: 'Content Creation',
    description: 'Photography, videography, social media content.',
    duration: '3-6 months',
  },
  {
    title: 'Fashion Design',
    description: 'Pattern making, fabric sourcing, garment construction.',
    duration: '6 months',
  },
  {
    title: 'Operations',
    description: 'Logistics, inventory, fulfillment operations.',
    duration: '3-6 months',
  },
  {
    title: 'Social Media',
    description: 'Content planning, community management, analytics.',
    duration: '3-6 months',
  },
]

const APPLICATION_STEPS = [
  {
    number: '01',
    title: 'Submit CV and Portfolio',
    description: 'Send your resume and relevant work samples.',
  },
  {
    number: '02',
    title: 'Interview',
    description: 'Meet the team. Discuss fit and expectations.',
  },
  {
    number: '03',
    title: 'Trial Project',
    description: 'Complete a brief project to demonstrate capability.',
  },
]

export default function CareersPage() {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => { setTimeout(() => setLoaded(true), 100) }, [])

  return (
    <div className="min-h-screen bg-[#F7F3ED]">

      {/* Hero Section */}
      <section
        className="px-5 md:px-[52px] pt-32 md:pt-40 pb-20 md:pb-32 border-b"
        style={{ borderColor: 'rgba(26,18,8,0.08)' }}
      >
        <div
          className="max-w-[900px] mx-auto"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'none' : 'translateY(20px)',
            transition: 'all 1.2s ease',
          }}
        >
          <p className="overline mb-6 md:mb-8">Careers</p>
          <h1
            className="font-display font-light text-[#1A1208] mb-8 md:mb-12"
            style={{
              fontSize: 'clamp(42px, 10vw, 88px)',
              lineHeight: 0.9,
              letterSpacing: '-0.025em',
            }}
          >
            JOIN THE<br />STUDIO.
          </h1>
          
          <p
            className="font-body font-light mb-8"
            style={{
              fontSize: 'clamp(16px, 3.5vw, 22px)',
              lineHeight: 1.4,
              color: 'rgba(26,18,8,0.6)',
              letterSpacing: '0.01em',
            }}
          >
            We build with discipline. We grow with intent.
          </p>

          <p
            className="font-body font-light"
            style={{
              fontSize: '14px',
              lineHeight: 1.85,
              color: 'rgba(26,18,8,0.5)',
              maxWidth: '640px',
            }}
          >
            NOXR is building a focused, design-led label rooted in precision and restraint. We look for individuals who value clarity, ownership, and long-term growth.
          </p>
        </div>
      </section>

      {/* Our Approach */}
      <ApproachSection />

      {/* Philosophy Statement */}
      <section className="px-5 md:px-[52px] py-16 md:py-24 border-b" style={{ borderColor: 'rgba(26,18,8,0.08)', backgroundColor: '#F2EDE6' }}>
        <div className="max-w-[900px] mx-auto text-center">
          <blockquote
            className="font-display font-light text-[#1A1208]"
            style={{
              fontSize: 'clamp(24px, 5vw, 36px)',
              lineHeight: 1.3,
              fontStyle: 'italic',
              letterSpacing: '-0.01em',
            }}
          >
            We value output over noise.<br />
            We prefer depth over speed.<br />
            We build slowly and correctly.
          </blockquote>
        </div>
      </section>

      {/* Open Positions */}
      <OpenPositionsSection />

      {/* Internship Programs */}
      <InternshipSection />

      {/* Application Process */}
      <ApplicationProcessSection />

      {/* Contact */}
      <section className="px-5 md:px-[52px] py-16 md:py-24 border-t" style={{ borderColor: 'rgba(26,18,8,0.08)' }}>
        <div className="max-w-[900px] mx-auto text-center">
          <p className="overline mb-6">Get in Touch</p>
          <h2
            className="font-display font-light text-[#1A1208] mb-8"
            style={{ fontSize: 'clamp(28px, 6vw, 44px)', letterSpacing: '-0.01em' }}
          >
            Ready to Apply?
          </h2>
          <div className="space-y-4 mb-10">
            <a
              href="mailto:careers@noxr.pk"
              className="font-body font-light block"
              style={{
                fontSize: '18px',
                color: '#1A1208',
                textDecoration: 'none',
                borderBottom: '0.5px solid rgba(26,18,8,0.3)',
                display: 'inline-block',
                paddingBottom: '2px',
              }}
            >
              careers@noxr.pk
            </a>
            <p
              className="font-body font-light"
              style={{ fontSize: '12px', color: 'rgba(26,18,8,0.4)', lineHeight: 1.6 }}
            >
              Or email{' '}
              <a
                href="mailto:hello@noxr.pk"
                style={{
                  color: '#1A1208',
                  textDecoration: 'none',
                  borderBottom: '0.5px solid rgba(26,18,8,0.3)',
                }}
              >
                hello@noxr.pk
              </a>
              {' '}with subject line:<br />
              <span style={{ fontFamily: "'Jost', sans-serif", fontSize: '11px', letterSpacing: '0.1em' }}>
                CAREERS – Position Name
              </span>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

function ApproachSection() {
  const { ref, inView } = useInView()
  return (
    <section
      ref={ref}
      className="px-5 md:px-[52px] py-16 md:py-24"
    >
      <div className="max-w-[1240px] mx-auto">
        <p
          className="overline mb-12 md:mb-16"
          style={{
            opacity: inView ? 1 : 0,
            transition: 'opacity 0.9s ease',
          }}
        >
          Our Approach
        </p>

        {/* Mobile: 1 col, Tablet: 2 col, Desktop: 4 col */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
          {APPROACH_BLOCKS.map((block, i) => (
            <div
              key={block.title}
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'none' : 'translateY(20px)',
                transition: `all 0.8s ease ${i * 0.1}s`,
              }}
            >
              <h3
                className="font-display font-light text-[#1A1208] mb-3"
                style={{ fontSize: 'clamp(18px, 4vw, 22px)', lineHeight: 1.2 }}
              >
                {block.title}
              </h3>
              <p
                className="font-body font-light"
                style={{ fontSize: '13px', lineHeight: 1.7, color: 'rgba(26,18,8,0.5)' }}
              >
                {block.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function OpenPositionsSection() {
  const { ref, inView } = useInView()
  const isHiring = OPEN_POSITIONS.length > 0

  return (
    <section
      ref={ref}
      className="px-5 md:px-[52px] py-16 md:py-24 border-b"
      style={{ borderColor: 'rgba(26,18,8,0.08)' }}
    >
      <div className="max-w-[900px] mx-auto">
        <p
          className="overline mb-12"
          style={{
            opacity: inView ? 1 : 0,
            transition: 'opacity 0.9s ease',
          }}
        >
          Open Positions
        </p>

        {isHiring ? (
          <div className="space-y-6">
            {OPEN_POSITIONS.map((position, i) => (
              <div
                key={position.title}
                className="p-6 md:p-8 border"
                style={{
                  borderColor: 'rgba(26,18,8,0.08)',
                  opacity: inView ? 1 : 0,
                  transform: inView ? 'none' : 'translateY(16px)',
                  transition: `all 0.8s ease ${i * 0.1}s`,
                }}
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                  <div>
                    <h3
                      className="font-display font-light text-[#1A1208] mb-2"
                      style={{ fontSize: 'clamp(20px, 4vw, 28px)' }}
                    >
                      {position.title}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      <span className="overline" style={{ color: 'rgba(26,18,8,0.4)' }}>
                        {position.location}
                      </span>
                      <span style={{ color: 'rgba(26,18,8,0.2)' }}>·</span>
                      <span className="overline" style={{ color: 'rgba(26,18,8,0.4)' }}>
                        {position.type}
                      </span>
                    </div>
                  </div>
                  <a href="mailto:careers@noxr.pk" className="btn-primary flex-shrink-0">
                    <span>Apply</span>
                  </a>
                </div>
                <p
                  className="font-body font-light"
                  style={{ fontSize: '13px', lineHeight: 1.7, color: 'rgba(26,18,8,0.5)' }}
                >
                  {position.description}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="text-center py-12 border"
            style={{
              borderColor: 'rgba(26,18,8,0.08)',
              opacity: inView ? 1 : 0,
              transition: 'opacity 1s ease',
            }}
          >
            <p
              className="font-body font-light mb-6"
              style={{ fontSize: '14px', lineHeight: 1.8, color: 'rgba(26,18,8,0.5)' }}
            >
              We are not actively hiring at the moment.
            </p>
            <a href="mailto:careers@noxr.pk?subject=Portfolio Submission" className="btn-ghost">
              Submit Portfolio for Future Opportunities
            </a>
          </div>
        )}
      </div>
    </section>
  )
}

function InternshipSection() {
  const { ref, inView } = useInView()
  return (
    <section
      ref={ref}
      className="px-5 md:px-[52px] py-16 md:py-24 border-b"
      style={{ borderColor: 'rgba(26,18,8,0.08)' }}
    >
      <div className="max-w-[900px] mx-auto">
        <p
          className="overline mb-12"
          style={{
            opacity: inView ? 1 : 0,
            transition: 'opacity 0.9s ease',
          }}
        >
          Internship Programs
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {INTERNSHIP_PROGRAMS.map((program, i) => (
            <div
              key={program.title}
              className="p-6 border"
              style={{
                borderColor: 'rgba(26,18,8,0.08)',
                opacity: inView ? 1 : 0,
                transform: inView ? 'none' : 'translateY(16px)',
                transition: `all 0.8s ease ${i * 0.1}s`,
              }}
            >
              <h3
                className="font-display font-light text-[#1A1208] mb-2"
                style={{ fontSize: 'clamp(18px, 4vw, 22px)' }}
              >
                {program.title}
              </h3>
              <p className="overline mb-3" style={{ color: 'rgba(26,18,8,0.35)' }}>
                {program.duration}
              </p>
              <p
                className="font-body font-light"
                style={{ fontSize: '13px', lineHeight: 1.7, color: 'rgba(26,18,8,0.5)' }}
              >
                {program.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ApplicationProcessSection() {
  const { ref, inView } = useInView()
  return (
    <section
      ref={ref}
      className="px-5 md:px-[52px] py-16 md:py-24 border-b"
      style={{ borderColor: 'rgba(26,18,8,0.08)', backgroundColor: '#F2EDE6' }}
    >
      <div className="max-w-[900px] mx-auto">
        <p
          className="overline mb-12"
          style={{
            opacity: inView ? 1 : 0,
            transition: 'opacity 0.9s ease',
          }}
        >
          Application Process
        </p>

        <div className="space-y-8">
          {APPLICATION_STEPS.map((step, i) => (
            <div
              key={step.number}
              className="flex gap-6"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'none' : 'translateX(-16px)',
                transition: `all 0.8s ease ${i * 0.15}s`,
              }}
            >
              <span
                className="font-body font-light flex-shrink-0"
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.2em',
                  color: 'rgba(26,18,8,0.25)',
                  marginTop: '2px',
                }}
              >
                {step.number}
              </span>
              <div className="flex-1">
                <h3
                  className="font-display font-light text-[#1A1208] mb-2"
                  style={{ fontSize: 'clamp(18px, 4vw, 24px)' }}
                >
                  {step.title}
                </h3>
                <p
                  className="font-body font-light"
                  style={{ fontSize: '13px', lineHeight: 1.7, color: 'rgba(26,18,8,0.5)' }}
                >
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}