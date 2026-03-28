'use client'

import { useState, useRef, useEffect } from 'react'

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return { ref, inView }
}

type Unit = 'cm' | 'in'
type Fit = 'essentials' | 'premium'

const SIZE_DATA = {
  essentials: {
    label: 'Essentials — Relaxed Fit',
    sub: 'Our Essentials range has a relaxed, slightly oversized silhouette. If you are between sizes, size down.',
    headers: ['Size', 'Chest', 'Length', 'Shoulder', 'Sleeve'],
    rows: [
      { size: 'XS', cm: ['86–91', '66', '42', '60'], inch: ['34–36', '26', '16.5', '23.5'] },
      { size: 'S',  cm: ['91–97', '68', '44', '62'], inch: ['36–38', '26.8', '17.3', '24.4'] },
      { size: 'M',  cm: ['97–102', '70', '46', '64'], inch: ['38–40', '27.6', '18.1', '25.2'] },
      { size: 'L',  cm: ['102–107', '72', '48', '66'], inch: ['40–42', '28.3', '18.9', '26'] },
      { size: 'XL', cm: ['107–112', '74', '50', '68'], inch: ['42–44', '29.1', '19.7', '26.8'] },
      { size: 'XXL',cm: ['112–117', '76', '52', '70'], inch: ['44–46', '29.9', '20.5', '27.6'] },
    ],
  },
  premium: {
    label: 'Premium — Structured Fit',
    sub: 'Our Premium range has a more structured silhouette with slightly narrower shoulders. True to size.',
    headers: ['Size', 'Chest', 'Length', 'Shoulder', 'Sleeve'],
    rows: [
      { size: 'XS', cm: ['84–89', '64', '41', '59'], inch: ['33–35', '25.2', '16.1', '23.2'] },
      { size: 'S',  cm: ['89–94', '66', '43', '61'], inch: ['35–37', '26', '16.9', '24'] },
      { size: 'M',  cm: ['94–99', '68', '45', '63'], inch: ['37–39', '26.8', '17.7', '24.8'] },
      { size: 'L',  cm: ['99–104', '70', '47', '65'], inch: ['39–41', '27.6', '18.5', '25.6'] },
      { size: 'XL', cm: ['104–109', '72', '49', '67'], inch: ['41–43', '28.3', '19.3', '26.4'] },
      { size: 'XXL',cm: ['109–114', '74', '51', '69'], inch: ['43–45', '29.1', '20.1', '27.2'] },
    ],
  },
}

const HOW_TO_MEASURE = [
  { label: 'Chest', instruction: 'Measure around the fullest part of your chest, keeping the tape horizontal under your arms.' },
  { label: 'Length', instruction: 'Measure from the highest point of the shoulder straight down to the hem.' },
  { label: 'Shoulder', instruction: 'Measure from the edge of one shoulder seam across to the other.' },
  { label: 'Sleeve', instruction: 'Measure from the shoulder seam down to the end of the cuff with your arm slightly bent.' },
]

const SIZE_FINDER_QUESTIONS = [
  { id: 'height', label: 'Your Height', options: ['Under 165cm', '165–175cm', '175–185cm', '185–195cm', 'Over 195cm'] },
  { id: 'weight', label: 'Your Weight', options: ['Under 60kg', '60–70kg', '70–80kg', '80–90kg', '90–100kg', 'Over 100kg'] },
  { id: 'preference', label: 'Fit Preference', options: ['I like it fitted', 'I like it relaxed', 'I prefer very oversized'] },
]

const SIZE_RECOMMENDATION: Record<string, string> = {
  'Under 165cm-Under 60kg-I like it fitted': 'XS',
  'Under 165cm-60–70kg-I like it fitted': 'S',
  'Under 165cm-60–70kg-I like it relaxed': 'M',
  'default': 'M',
}

export default function SizeGuidePage() {
  const [unit, setUnit] = useState<Unit>('cm')
  const [activeFit, setActiveFit] = useState<Fit>('essentials')
  const [highlightSize, setHighlightSize] = useState<string | null>(null)
  const [finderAnswers, setFinderAnswers] = useState<Record<string, string>>({})
  const [recommendation, setRecommendation] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)
  const { ref: tableRef, inView: tableIn } = useInView(0.1)
  const { ref: measureRef, inView: measureIn } = useInView(0.1)

  useEffect(() => { setTimeout(() => setLoaded(true), 100) }, [])

  const data = SIZE_DATA[activeFit]

  const handleFinderAnswer = (questionId: string, answer: string) => {
    const next = { ...finderAnswers, [questionId]: answer }
    setFinderAnswers(next)
    if (Object.keys(next).length === SIZE_FINDER_QUESTIONS.length) {
      const key = `${next.height}-${next.weight}-${next.preference}`
      const result = SIZE_RECOMMENDATION[key] ?? SIZE_RECOMMENDATION['default']
      setRecommendation(result)
      setHighlightSize(result)
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F3ED]">

      {/* ── Header ── */}
      <div style={{ borderBottom: '0.5px solid rgba(26,18,8,0.08)', paddingTop: '120px',paddingBottom: '48px',paddingLeft: '20px',paddingRight: '20px' }}>
        <div
          className="max-w-[1240px] mx-auto md:px-[52px] flex justify-between items-end"
          style={{ opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(16px)', transition: 'all 1.2s ease 0.1s' }}
        >
          <div>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: '9px', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(26,18,8,0.3)', marginBottom: '20px' }}>Fit & Measurement</p>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(52px, 7vw, 96px)', fontWeight: 300, lineHeight: 0.9, letterSpacing: '-0.025em', color: '#1A1208' }}>
              Size Guide
            </h1>
          </div>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: '12.5px', fontWeight: 300, lineHeight: 1.8, color: 'rgba(26,18,8,0.4)', maxWidth: '260px', paddingBottom: '8px' }}>
            All measurements are of the garment, not the body. When in doubt, size up.
          </p>
        </div>
      </div>

      <div style={{ padding: '48px 20px 120px' }} className="md:px-[52px] md:py-[80px]">
        <div className="max-w-[1240px] mx-auto" style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>

          {/* ── Size Finder ── */}
          <SizeFinder
            questions={SIZE_FINDER_QUESTIONS}
            answers={finderAnswers}
            recommendation={recommendation}
            onAnswer={handleFinderAnswer}
            onReset={() => { setFinderAnswers({}); setRecommendation(null); setHighlightSize(null) }}
          />

          {/* ── Table controls ── */}
          <div ref={tableRef} style={{ opacity: tableIn ? 1 : 0, transition: 'opacity 1s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
              {/* Fit selector */}
              <div style={{ display: 'flex', gap: '2px' }}>
                {(['essentials', 'premium'] as Fit[]).map(f => (
                  <button
                    key={f}
                    onClick={() => setActiveFit(f)}
                    style={{
                      fontFamily: "'Jost', sans-serif", fontSize: '9px',
                      letterSpacing: '0.28em', textTransform: 'uppercase',
                      padding: '10px 24px',
                      backgroundColor: activeFit === f ? '#1A1208' : 'transparent',
                      color: activeFit === f ? '#F7F3ED' : 'rgba(26,18,8,0.4)',
                      border: `0.5px solid ${activeFit === f ? '#1A1208' : 'rgba(26,18,8,0.15)'}`,
                      cursor: 'none', transition: 'all 0.35s ease',
                    }}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>

              {/* Unit toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                {(['cm', 'in'] as Unit[]).map(u => (
                  <button
                    key={u}
                    onClick={() => setUnit(u)}
                    style={{
                      fontFamily: "'Jost', sans-serif", fontSize: '9px',
                      letterSpacing: '0.2em', textTransform: 'uppercase',
                      padding: '8px 18px',
                      backgroundColor: unit === u ? '#1A1208' : 'transparent',
                      color: unit === u ? '#F7F3ED' : 'rgba(26,18,8,0.35)',
                      border: `0.5px solid ${unit === u ? '#1A1208' : 'rgba(26,18,8,0.12)'}`,
                      cursor: 'none', transition: 'all 0.3s ease',
                    }}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>

            {/* Sub label */}
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: '11.5px', fontWeight: 300, color: 'rgba(26,18,8,0.4)', marginBottom: '32px', lineHeight: 1.7 }}>
              {data.sub}
            </p>

            {/* Table */}
            <div style={{overflowX: 'auto',WebkitOverflowScrolling: 'touch',border: '0.5px solid rgba(26,18,8,0.08)'}}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '0.5px solid rgba(26,18,8,0.08)', backgroundColor: '#F2EDE6' }}>
                    {data.headers.map(h => (
                      <th
                        key={h}
                        style={{
                          padding: '14px 20px',
                          fontFamily: "'Jost', sans-serif", fontSize: '8.5px',
                          letterSpacing: '0.35em', textTransform: 'uppercase',
                          color: 'rgba(26,18,8,0.4)', fontWeight: 300,
                          textAlign: h === 'Size' ? 'left' : 'center',
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.rows.map((row, i) => {
                    const isHighlighted = highlightSize === row.size
                    const values = unit === 'cm' ? row.cm : row.inch
                    return (
                      <tr
                        key={row.size}
                        onClick={() => setHighlightSize(isHighlighted ? null : row.size)}
                        style={{
                          backgroundColor: isHighlighted ? 'rgba(26,18,8,0.04)' : i % 2 === 0 ? '#F7F3ED' : '#FAF8F4',
                          borderBottom: '0.5px solid rgba(26,18,8,0.05)',
                          cursor: 'none', transition: 'background-color 0.3s ease',
                        }}
                      >
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{
                              fontFamily: "'Cormorant Garamond', serif",
                              fontSize: '18px', fontWeight: isHighlighted ? 400 : 300,
                              color: isHighlighted ? '#1A1208' : 'rgba(26,18,8,0.7)',
                              transition: 'all 0.3s ease',
                            }}>
                              {row.size}
                            </span>
                            {isHighlighted && (
                              <span style={{ fontFamily: "'Jost', sans-serif", fontSize: '7.5px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(26,18,8,0.4)', backgroundColor: 'rgba(26,18,8,0.06)', padding: '3px 8px' }}>
                                {recommendation === row.size ? 'Recommended' : 'Selected'}
                              </span>
                            )}
                          </div>
                        </td>
                        {values.map((v, vi) => (
                          <td key={vi} style={{ padding: '16px 20px', textAlign: 'center', fontFamily: "'Jost', sans-serif", fontSize: '12px', fontWeight: 300, color: 'rgba(26,18,8,0.55)' }}>
                            {v}
                          </td>
                        ))}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── How to measure ── */}
          <div ref={measureRef} style={{ opacity: measureIn ? 1 : 0, transform: measureIn ? 'none' : 'translateY(20px)', transition: 'all 1.2s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '48px' }}>
              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: '9px', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(26,18,8,0.3)' }}>How to Measure</p>
              <div style={{ flex: 1, height: '0.5px', backgroundColor: 'rgba(26,18,8,0.08)' }} />
            </div>

            <div style={{display: 'grid',gridTemplateColumns: '1fr',gap: '12px'}}className="md:grid md:grid-cols-4 md:gap-[3px]">
              {HOW_TO_MEASURE.map((item, i) => (
                <div
                  key={item.label}
                  style={{
                    padding: '28px 24px',
                    backgroundColor: '#F2EDE6',
                    border: '0.5px solid rgba(26,18,8,0.06)',
                    opacity: measureIn ? 1 : 0,
                    transform: measureIn ? 'none' : 'translateY(16px)',
                    transition: `all 0.9s ease ${i * 0.08}s`,
                  }}
                >
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '20px', fontWeight: 400, color: '#1A1208', marginBottom: '12px' }}>{item.label}</p>
                  <p style={{ fontFamily: "'Jost', sans-serif", fontSize: '11.5px', fontWeight: 300, lineHeight: 1.8, color: 'rgba(26,18,8,0.45)' }}>{item.instruction}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Fit tips ── */}
          <div style={{ borderTop: '0.5px solid rgba(26,18,8,0.08)', paddingTop: '48px' }}>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: '9px', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(26,18,8,0.3)', marginBottom: '28px' }}>Fit Notes</p>
            <div style={{display: 'grid',gridTemplateColumns: '1fr',gap: '20px'}}className="md:grid md:grid-cols-3 md:gap-6">
              {[
                { title: 'Shrinkage', body: 'Our garments are pre-washed. Expect minimal shrinkage (1–2%) after the first wash. Wash cold to preserve.' },
                { title: 'Between sizes?', body: 'For a relaxed look, go up. For a fitted look, stay true. Our Premium range runs slightly narrower in the shoulders.' },
                { title: 'Still unsure?', body: 'Email us at hello@noxr.pk with your height, weight and preferred fit. We\'ll tell you exactly what to order.' },
              ].map(tip => (
                <div key={tip.title} style={{ paddingTop: '20px', borderTop: '0.5px solid rgba(26,18,8,0.08)' }}>
                  <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '18px', fontWeight: 400, color: '#1A1208', marginBottom: '10px' }}>{tip.title}</h4>
                  <p style={{ fontFamily: "'Jost', sans-serif", fontSize: '12px', fontWeight: 300, lineHeight: 1.8, color: 'rgba(26,18,8,0.45)' }}>{tip.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Size Finder widget ───────────────────────────────────────────────────────
function SizeFinder({ questions, answers, recommendation, onAnswer, onReset }: {
  questions: typeof SIZE_FINDER_QUESTIONS
  answers: Record<string, string>
  recommendation: string | null
  onAnswer: (id: string, answer: string) => void
  onReset: () => void
}) {
  const { ref, inView } = useInView(0.1)
  return (
    <div
      ref={ref}
      style={{
        border: '0.5px solid rgba(26,18,8,0.08)',
        backgroundColor: '#F2EDE6',
        padding: '48px',
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : 'translateY(20px)',
        transition: 'all 1.2s ease',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '36px' }}>
        <div>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: '9px', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(26,18,8,0.3)', marginBottom: '10px' }}>Interactive</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '32px', fontWeight: 300, color: '#1A1208', letterSpacing: '-0.01em' }}>Find Your Size</h2>
        </div>
        {Object.keys(answers).length > 0 && (
          <button onClick={onReset} className="btn-ghost" style={{ fontSize: '9px' }}>Reset</button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {questions.map((q, qi) => (
          <div key={q.id} style={{ opacity: qi === 0 || answers[questions[qi - 1]?.id] ? 1 : 0.3, transition: 'opacity 0.5s ease' }}>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: '9px', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(26,18,8,0.4)', marginBottom: '14px' }}>{q.label}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {q.options.map(opt => (
                <button
                  key={opt}
                  onClick={() => onAnswer(q.id, opt)}
                  disabled={qi > 0 && !answers[questions[qi - 1]?.id]}
                  style={{
                    fontFamily: "'Jost', sans-serif", fontSize: '10px',
                    letterSpacing: '0.15em',
                    padding: '12px 20px',
                    border: `0.5px solid ${answers[q.id] === opt ? '#1A1208' : 'rgba(26,18,8,0.15)'}`,
                    backgroundColor: answers[q.id] === opt ? '#1A1208' : 'transparent',
                    color: answers[q.id] === opt ? '#F7F3ED' : 'rgba(26,18,8,0.5)',
                    cursor: 'none', transition: 'all 0.3s ease',
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {recommendation && (
        <div style={{ marginTop: '36px', paddingTop: '28px', borderTop: '0.5px solid rgba(26,18,8,0.1)', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: '9px', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(26,18,8,0.35)', marginBottom: '6px' }}>We recommend</p>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '52px', fontWeight: 300, color: '#1A1208', lineHeight: 1, letterSpacing: '-0.02em' }}>{recommendation}</span>
          </div>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: '12px', fontWeight: 300, lineHeight: 1.8, color: 'rgba(26,18,8,0.45)', maxWidth: '280px' }}>
            Based on your answers. This is for our Essentials range. Premium runs half a size narrower in the shoulder.
          </p>
        </div>
      )}
    </div>
  )
}






// 'use client'

// import { useState, useRef, useEffect } from 'react'

// function useInView(threshold = 0.12) {
//   const ref = useRef<HTMLDivElement>(null)
//   const [inView, setInView] = useState(false)
//   useEffect(() => {
//     const obs = new IntersectionObserver(
//       ([e]) => { if (e.isIntersecting) setInView(true) },
//       { threshold }
//     )
//     if (ref.current) obs.observe(ref.current)
//     return () => obs.disconnect()
//   }, [])
//   return { ref, inView }
// }

// const SIZE_DATA = {
//   essentials: [
//     { size: 'XS', chest: 96, length: 70, shoulder: 45, sleeve: 20 },
//     { size: 'S', chest: 102, length: 72, shoulder: 47, sleeve: 21 },
//     { size: 'M', chest: 108, length: 74, shoulder: 49, sleeve: 22 },
//     { size: 'L', chest: 114, length: 76, shoulder: 51, sleeve: 23 },
//     { size: 'XL', chest: 120, length: 78, shoulder: 53, sleeve: 24 },
//     { size: 'XXL', chest: 126, length: 80, shoulder: 55, sleeve: 25 },
//   ],
//   premium: [
//     { size: 'XS', chest: 98, length: 71, shoulder: 46, sleeve: 21 },
//     { size: 'S', chest: 104, length: 73, shoulder: 48, sleeve: 22 },
//     { size: 'M', chest: 110, length: 75, shoulder: 50, sleeve: 23 },
//     { size: 'L', chest: 116, length: 77, shoulder: 52, sleeve: 24 },
//     { size: 'XL', chest: 122, length: 79, shoulder: 54, sleeve: 25 },
//     { size: 'XXL', chest: 128, length: 81, shoulder: 56, sleeve: 26 },
//   ],
// }

// const MEASUREMENTS = [
//   {
//     title: 'Chest',
//     instruction: 'Measure around the fullest part of your chest, keeping the tape horizontal.',
//   },
//   {
//     title: 'Length',
//     instruction: 'Measure from the highest point of the shoulder to the bottom hem.',
//   },
//   {
//     title: 'Shoulder',
//     instruction: 'Measure from the edge of one shoulder to the other across the back.',
//   },
//   {
//     title: 'Sleeve',
//     instruction: 'Measure from the shoulder seam to the cuff with the arm relaxed.',
//   },
// ]

// export default function SizeGuidePage() {
//   const [loaded, setLoaded] = useState(false)
//   const [unit, setUnit] = useState<'cm' | 'in'>('cm')
//   const [collection, setCollection] = useState<'essentials' | 'premium'>('essentials')
//   const [highlighted, setHighlighted] = useState<string | null>(null)
  
//   // Size finder state
//   const [height, setHeight] = useState('')
//   const [weight, setWeight] = useState('')
//   const [fit, setFit] = useState('')
//   const [recommendation, setRecommendation] = useState<string | null>(null)

//   useEffect(() => { setTimeout(() => setLoaded(true), 100) }, [])

//   const convert = (cm: number) => unit === 'cm' ? cm : Math.round(cm / 2.54)

//   const handleFindSize = () => {
//     // Simple size recommendation logic
//     const h = parseInt(height)
//     const w = parseInt(weight)
    
//     if (!h || !w || !fit) return
    
//     let size = 'M'
//     if (w < 65) size = fit === 'relaxed' ? 'M' : 'S'
//     else if (w < 75) size = fit === 'relaxed' ? 'L' : 'M'
//     else if (w < 85) size = fit === 'relaxed' ? 'XL' : 'L'
//     else size = fit === 'relaxed' ? 'XXL' : 'XL'
    
//     setRecommendation(size)
//     setHighlighted(size)
//   }

//   const handleReset = () => {
//     setHeight('')
//     setWeight('')
//     setFit('')
//     setRecommendation(null)
//     setHighlighted(null)
//   }

//   return (
//     <div className="min-h-screen bg-[#F7F3ED]">

//       {/* ── Header ── */}
//       <section className="px-5 md:px-[52px] pt-24 md:pt-32 pb-12 md:pb-16 border-b" style={{ borderColor: 'rgba(26,18,8,0.08)' }}>
//         <div
//           className="max-w-[1240px] mx-auto"
//           style={{
//             opacity: loaded ? 1 : 0,
//             transform: loaded ? 'none' : 'translateY(20px)',
//             transition: 'all 1.2s ease 0.1s',
//           }}
//         >
//           <p className="overline mb-5">Fit Guide</p>
//           <h1
//             className="font-display font-light text-[#1A1208] mb-6"
//             style={{
//               fontSize: 'clamp(42px, 10vw, 96px)',
//               lineHeight: 0.9,
//               letterSpacing: '-0.025em',
//             }}
//           >
//             Size Guide
//           </h1>
//           <p
//             className="font-body font-light"
//             style={{
//               fontSize: '14px',
//               lineHeight: 1.8,
//               color: 'rgba(26,18,8,0.45)',
//               maxWidth: '480px',
//             }}
//           >
//             All measurements are in garment dimensions, not body measurements. For best results, compare to a garment that fits you well.
//           </p>
//         </div>
//       </section>

//       {/* ── Size Finder Widget ── */}
//       <section className="px-5 md:px-[52px] py-16 md:py-20 bg-[#F2EDE6] border-b" style={{ borderColor: 'rgba(26,18,8,0.08)' }}>
//         <div className="max-w-[800px] mx-auto">
//           <h2
//             className="font-display font-light text-[#1A1208] mb-8 text-center"
//             style={{ fontSize: 'clamp(24px, 5vw, 32px)', letterSpacing: '-0.01em' }}
//           >
//             Find Your Size
//           </h2>

//           {recommendation ? (
//             <div className="text-center mb-8 p-6 border" style={{ borderColor: 'rgba(107,143,94,0.3)', backgroundColor: 'rgba(107,143,94,0.05)' }}>
//               <p className="font-body font-light mb-2" style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(107,143,94,0.7)' }}>
//                 Recommended Size
//               </p>
//               <p className="font-display font-light text-[#1A1208] mb-4" style={{ fontSize: '48px', letterSpacing: '-0.02em' }}>
//                 {recommendation}
//               </p>
//               <button onClick={handleReset} className="btn-ghost" style={{ fontSize: '9px' }}>
//                 Try Again
//               </button>
//             </div>
//           ) : (
//             <div className="space-y-6">
              
//               {/* Mobile: Stack inputs, Desktop: 3-col grid */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div>
//                   <label className="font-body font-light block mb-3" style={{ fontSize: '9px', letterSpacing: '0.38em', textTransform: 'uppercase', color: 'rgba(26,18,8,0.35)' }}>
//                     Height (cm)
//                   </label>
//                   <input
//                     type="number"
//                     value={height}
//                     onChange={e => setHeight(e.target.value)}
//                     placeholder="175"
//                     className="w-full bg-transparent border-b outline-none py-3"
//                     style={{ borderColor: 'rgba(26,18,8,0.2)', fontSize: '14px', color: '#1A1208' }}
//                   />
//                 </div>

//                 <div>
//                   <label className="font-body font-light block mb-3" style={{ fontSize: '9px', letterSpacing: '0.38em', textTransform: 'uppercase', color: 'rgba(26,18,8,0.35)' }}>
//                     Weight (kg)
//                   </label>
//                   <input
//                     type="number"
//                     value={weight}
//                     onChange={e => setWeight(e.target.value)}
//                     placeholder="70"
//                     className="w-full bg-transparent border-b outline-none py-3"
//                     style={{ borderColor: 'rgba(26,18,8,0.2)', fontSize: '14px', color: '#1A1208' }}
//                   />
//                 </div>

//                 <div>
//                   <label className="font-body font-light block mb-3" style={{ fontSize: '9px', letterSpacing: '0.38em', textTransform: 'uppercase', color: 'rgba(26,18,8,0.35)' }}>
//                     Preferred Fit
//                   </label>
//                   <select
//                     value={fit}
//                     onChange={e => setFit(e.target.value)}
//                     className="w-full bg-transparent border-b outline-none py-3"
//                     style={{ borderColor: 'rgba(26,18,8,0.2)', fontSize: '14px', color: '#1A1208' }}
//                   >
//                     <option value="">Select</option>
//                     <option value="fitted">Fitted</option>
//                     <option value="relaxed">Relaxed</option>
//                   </select>
//                 </div>
//               </div>

//               <button
//                 onClick={handleFindSize}
//                 disabled={!height || !weight || !fit}
//                 className="btn-primary w-full md:w-auto"
//                 style={{ opacity: (!height || !weight || !fit) ? 0.5 : 1 }}
//               >
//                 <span>Find My Size</span>
//               </button>
//             </div>
//           )}
//         </div>
//       </section>

//       {/* ── Size Tables ── */}
//       <section className="px-5 md:px-[52px] py-16 md:py-20">
//         <div className="max-w-[1240px] mx-auto">
          
//           {/* Controls */}
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
            
//             {/* Collection toggle */}
//             <div className="flex gap-2">
//               {(['essentials', 'premium'] as const).map(c => (
//                 <button
//                   key={c}
//                   onClick={() => setCollection(c)}
//                   className="px-5 py-2"
//                   style={{
//                     fontSize: '9px',
//                     letterSpacing: '0.28em',
//                     textTransform: 'uppercase',
//                     backgroundColor: collection === c ? '#1A1208' : 'transparent',
//                     color: collection === c ? '#F7F3ED' : 'rgba(26,18,8,0.4)',
//                     border: `0.5px solid ${collection === c ? '#1A1208' : 'rgba(26,18,8,0.15)'}`,
//                     fontFamily: "'Jost', sans-serif",
//                     fontWeight: 300,
//                   }}
//                 >
//                   {c}
//                 </button>
//               ))}
//             </div>

//             {/* Unit toggle */}
//             <div className="flex gap-2">
//               {(['cm', 'in'] as const).map(u => (
//                 <button
//                   key={u}
//                   onClick={() => setUnit(u)}
//                   className="px-4 py-2"
//                   style={{
//                     fontSize: '9px',
//                     letterSpacing: '0.2em',
//                     textTransform: 'uppercase',
//                     backgroundColor: unit === u ? '#1A1208' : 'transparent',
//                     color: unit === u ? '#F7F3ED' : 'rgba(26,18,8,0.4)',
//                     border: `0.5px solid ${unit === u ? '#1A1208' : 'rgba(26,18,8,0.15)'}`,
//                     fontFamily: "'Jost', sans-serif",
//                     fontWeight: 300,
//                   }}
//                 >
//                   {u}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Table - horizontal scroll on mobile */}
//           <div className="overflow-x-auto border" style={{ borderColor: 'rgba(26,18,8,0.08)' }}>
//             <table className="w-full" style={{ minWidth: '600px' }}>
//               <thead>
//                 <tr style={{ backgroundColor: '#F2EDE6' }}>
//                   <th className="text-left p-4 font-body font-light" style={{ fontSize: '9px', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(26,18,8,0.3)' }}>
//                     Size
//                   </th>
//                   <th className="text-left p-4 font-body font-light" style={{ fontSize: '9px', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(26,18,8,0.3)' }}>
//                     Chest
//                   </th>
//                   <th className="text-left p-4 font-body font-light" style={{ fontSize: '9px', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(26,18,8,0.3)' }}>
//                     Length
//                   </th>
//                   <th className="text-left p-4 font-body font-light" style={{ fontSize: '9px', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(26,18,8,0.3)' }}>
//                     Shoulder
//                   </th>
//                   <th className="text-left p-4 font-body font-light" style={{ fontSize: '9px', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(26,18,8,0.3)' }}>
//                     Sleeve
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {SIZE_DATA[collection].map((row, i) => (
//                   <tr
//                     key={row.size}
//                     className="border-t"
//                     style={{
//                       borderColor: 'rgba(26,18,8,0.05)',
//                       backgroundColor: highlighted === row.size ? 'rgba(107,143,94,0.08)' : 'transparent',
//                     }}
//                   >
//                     <td className="p-4 font-body font-light" style={{ fontSize: '12px', color: highlighted === row.size ? '#1A1208' : 'rgba(26,18,8,0.6)', fontWeight: highlighted === row.size ? 400 : 300 }}>
//                       {row.size}
//                     </td>
//                     <td className="p-4 font-body font-light" style={{ fontSize: '12px', color: 'rgba(26,18,8,0.6)' }}>
//                       {convert(row.chest)}
//                     </td>
//                     <td className="p-4 font-body font-light" style={{ fontSize: '12px', color: 'rgba(26,18,8,0.6)' }}>
//                       {convert(row.length)}
//                     </td>
//                     <td className="p-4 font-body font-light" style={{ fontSize: '12px', color: 'rgba(26,18,8,0.6)' }}>
//                       {convert(row.shoulder)}
//                     </td>
//                     <td className="p-4 font-body font-light" style={{ fontSize: '12px', color: 'rgba(26,18,8,0.6)' }}>
//                       {convert(row.sleeve)}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </section>

//       {/* ── How to Measure ── */}
//       <section className="px-5 md:px-[52px] py-16 md:py-20 bg-[#F2EDE6] border-t" style={{ borderColor: 'rgba(26,18,8,0.08)' }}>
//         <div className="max-w-[1240px] mx-auto">
//           <h2
//             className="font-display font-light text-[#1A1208] mb-10 text-center"
//             style={{ fontSize: 'clamp(24px, 5vw, 32px)', letterSpacing: '-0.01em' }}
//           >
//             How to Measure
//           </h2>

//           {/* Mobile: 1 col, Tablet: 2 col, Desktop: 4 col */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//             {MEASUREMENTS.map((m, i) => (
//               <MeasurementCard key={m.title} measurement={m} index={i} />
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ── Fit Notes ── */}
//       <section className="px-5 md:px-[52px] py-16 md:py-20">
//         <div className="max-w-[1240px] mx-auto">
//           <h2
//             className="font-display font-light text-[#1A1208] mb-10"
//             style={{ fontSize: 'clamp(24px, 5vw, 32px)', letterSpacing: '-0.01em' }}
//           >
//             Fit Notes
//           </h2>

//           {/* Mobile: Stack, Desktop: 3-col */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {[
//               { title: 'Shrinkage', body: 'All cotton garments are pre-washed but may shrink 2-3% with hot water. Wash cold for best results.' },
//               { title: 'Between Sizes', body: 'If you\'re between sizes, we recommend sizing up for a relaxed fit or your usual size for a fitted look.' },
//               { title: 'Still Unsure?', body: 'Email us at hello@noxr.pk with your measurements and preferred fit — we\'ll help you find the right size.' },
//             ].map((note, i) => (
//               <div key={i} className="p-6 border" style={{ borderColor: 'rgba(26,18,8,0.08)' }}>
//                 <h3 className="font-display font-light text-[#1A1208] mb-3" style={{ fontSize: '18px' }}>
//                   {note.title}
//                 </h3>
//                 <p className="font-body font-light" style={{ fontSize: '12px', lineHeight: 1.7, color: 'rgba(26,18,8,0.45)' }}>
//                   {note.body}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>
//     </div>
//   )
// }

// function MeasurementCard({ measurement, index }: { measurement: typeof MEASUREMENTS[0]; index: number }) {
//   const { ref, inView } = useInView(0.2)
//   return (
//     <div
//       ref={ref}
//       className="text-center"
//       style={{
//         opacity: inView ? 1 : 0,
//         transform: inView ? 'none' : 'translateY(16px)',
//         transition: `all 0.8s ease ${index * 0.1}s`,
//       }}
//     >
//       <div
//         className="w-16 h-16 mx-auto mb-4 border flex items-center justify-center"
//         style={{ borderColor: 'rgba(26,18,8,0.15)' }}
//       >
//         <span className="font-display font-light text-[#1A1208]" style={{ fontSize: '20px' }}>
//           {index + 1}
//         </span>
//       </div>
//       <h3 className="font-display font-light text-[#1A1208] mb-2" style={{ fontSize: '18px' }}>
//         {measurement.title}
//       </h3>
//       <p className="font-body font-light" style={{ fontSize: '11px', lineHeight: 1.6, color: 'rgba(26,18,8,0.4)' }}>
//         {measurement.instruction}
//       </p>
//     </div>
//   )
// }