'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Section = 'homepage' | 'about' | 'sustainability' | 'footer'

interface HomepageContent {
  heroHeadline: string
  heroSubtext: string
  ctaButtonText: string
  featuredCollectionTitle: string
  brandStatement: string
}

interface AboutContent {
  heroText: string
  missionStatement: string
  valuesDescription: string
}

interface SustainabilityContent {
  pageTitle: string
  introduction: string
  commitmentBlocks: string
}

interface FooterContent {
  brandDescription: string
  socialLinks: string
}

interface ContentData {
  homepage: HomepageContent
  about: AboutContent
  sustainability: SustainabilityContent
  footer: FooterContent
}

export default function ContentManagerPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Section>('homepage')
  const [content, setContent] = useState<ContentData>({
    homepage: {
      heroHeadline: '',
      heroSubtext: '',
      ctaButtonText: '',
      featuredCollectionTitle: '',
      brandStatement: '',
    },
    about: {
      heroText: '',
      missionStatement: '',
      valuesDescription: '',
    },
    sustainability: {
      pageTitle: '',
      introduction: '',
      commitmentBlocks: '',
    },
    footer: {
      brandDescription: '',
      socialLinks: '',
    },
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/admin/content', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('noxr_admin_token')}`
          }
        })
        const data = await res.json()
        if (data) {
  setContent({
    homepage: data.homepage || {
      heroHeadline: '',
      heroSubtext: '',
      ctaButtonText: '',
      featuredCollectionTitle: '',
      brandStatement: '',
    },
    about: data.about || {
      heroText: '',
      missionStatement: '',
      valuesDescription: '',
    },
    sustainability: data.sustainability || {
      pageTitle: '',
      introduction: '',
      commitmentBlocks: '',
    },
    footer: data.footer || {
      brandDescription: '',
      socialLinks: '',
    },
  })
}
      } catch (error) {
        console.error('Content fetch error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    
    try {
      await fetch('http://localhost:5000/api/admin/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('noxr_admin_token')}`
        },
        body: JSON.stringify(content)
      })
      
      alert('Content saved successfully')
    } catch (error) {
      console.error('Save error:', error)
      alert('Failed to save content')
    } finally {
      setSaving(false)
    }
  }

  const updateField = (section: Section, field: string, value: string) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F7F3ED' }}>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 68px)' }}>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          
          {/* Header */}
          <div style={{ padding: '48px 52px 0' }}>
            <p className="overline mb-3">Brand Messaging</p>
            <h1
              className="font-display font-light text-[#1A1208]"
              style={{ fontSize: 'clamp(36px, 5vw, 56px)', lineHeight: 1, letterSpacing: '-0.02em', marginBottom: '24px' }}
            >
              Content Manager
            </h1>
          </div>

          {/* Tabs */}
          <div style={{ borderBottom: '0.5px solid rgba(26,18,8,0.08)', padding: '0 52px' }}>
            <div style={{ display: 'flex', gap: '32px' }}>
              {(['homepage', 'about', 'sustainability', 'footer'] as Section[]).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="relative py-4 capitalize font-body font-light"
                  style={{
                    fontSize: '11px',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: activeTab === tab ? '#1A1208' : 'rgba(26,18,8,0.35)',
                    background: 'none',
                    border: 'none',
                  }}
                >
                  {tab}
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '-1px',
                      left: 0,
                      right: 0,
                      height: '1px',
                      backgroundColor: '#1A1208',
                      transform: activeTab === tab ? 'scaleX(1)' : 'scaleX(0)',
                      transition: 'transform 0.3s ease',
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '32px 52px 100px' }}>
            <div className="max-w-[800px]">
              
              {loading ? (
                <p className="overline" style={{ color: 'rgba(26,18,8,0.3)' }}>Loading content...</p>
              ) : (
                <>
                  {activeTab === 'homepage' && (
                    <HomepageTab content={content.homepage} updateField={(field, value) => updateField('homepage', field, value)} />
                  )}
                  {activeTab === 'about' && (
                    <AboutTab content={content.about} updateField={(field, value) => updateField('about', field, value)} />
                  )}
                  {activeTab === 'sustainability' && (
                    <SustainabilityTab content={content.sustainability} updateField={(field, value) => updateField('sustainability', field, value)} />
                  )}
                  {activeTab === 'footer' && (
                    <FooterTab content={content.footer} updateField={(field, value) => updateField('footer', field, value)} />
                  )}
                </>
              )}
            </div>
          </div>

          {/* Save Button - Fixed Bottom Right */}
          <div style={{ position: 'fixed', bottom: '32px', right: '52px', zIndex: 10 }}>
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary"
              style={{ padding: '16px 32px', opacity: saving ? 0.6 : 1 }}
            >
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface TabProps {
  content: any
  updateField: (field: string, value: string) => void
}

interface ContentFieldProps {
  label: string
  type: 'text' | 'textarea'
  value: string
  onChange: (value: string) => void
  placeholder: string
  rows?: number
}

function HomepageTab({ content, updateField }: TabProps) {
  return (
    <div className="space-y-8">
      <ContentField
        label="Hero Headline"
        type="text"
        value={content?.heroHeadline || ''}
        onChange={(v) => updateField('heroHeadline', v)}
        placeholder="LESS — DONE BETTER"
      />
      
      <ContentField
        label="Hero Subtext"
        type="textarea"
        value={content.heroSubtext}
        onChange={(v) => updateField('heroSubtext', v)}
        placeholder="Premium essentials built to last."
        rows={3}
      />
      
      <ContentField
        label="CTA Button Text"
        type="text"
        value={content.ctaButtonText}
        onChange={(v) => updateField('ctaButtonText', v)}
        placeholder="Explore Collection"
      />
      
      <ContentField
        label="Featured Collection Title"
        type="text"
        value={content.featuredCollectionTitle}
        onChange={(v) => updateField('featuredCollectionTitle', v)}
        placeholder="Winter Drop 2026"
      />
      
      <ContentField
        label="Brand Statement"
        type="textarea"
        value={content.brandStatement}
        onChange={(v) => updateField('brandStatement', v)}
        placeholder="We build with discipline. We grow with intent..."
        rows={4}
      />
    </div>
  )
}

function AboutTab({ content, updateField }: TabProps) {
  return (
    <div className="space-y-8">
      <ContentField
        label="Hero Text"
        type="textarea"
        value={content.heroText}
        onChange={(v) => updateField('heroText', v)}
        placeholder="NOXR is built on precision..."
        rows={4}
      />
      
      <ContentField
        label="Mission Statement"
        type="textarea"
        value={content.missionStatement}
        onChange={(v) => updateField('missionStatement', v)}
        placeholder="Our mission is to create..."
        rows={5}
      />
      
      <ContentField
        label="Values Description"
        type="textarea"
        value={content.valuesDescription}
        onChange={(v) => updateField('valuesDescription', v)}
        placeholder="Discipline. Restraint. Quality..."
        rows={6}
      />
    </div>
  )
}

function SustainabilityTab({ content, updateField }: TabProps) {
  return (
    <div className="space-y-8">
      <ContentField
        label="Page Title"
        type="text"
        value={content.pageTitle}
        onChange={(v) => updateField('pageTitle', v)}
        placeholder="Sustainability"
      />
      
      <ContentField
        label="Introduction"
        type="textarea"
        value={content.introduction}
        onChange={(v) => updateField('introduction', v)}
        placeholder="We believe in building responsibly..."
        rows={5}
      />
      
      <ContentField
        label="Commitment Blocks (separate with line breaks)"
        type="textarea"
        value={content.commitmentBlocks}
        onChange={(v) => updateField('commitmentBlocks', v)}
        placeholder="Ethical production\nQuality over quantity\nLong-term thinking"
        rows={8}
      />
    </div>
  )
}

function FooterTab({ content, updateField }: TabProps) {
  return (
    <div className="space-y-8">
      <ContentField
        label="Brand Description"
        type="textarea"
        value={content.brandDescription}
        onChange={(v) => updateField('brandDescription', v)}
        placeholder="NOXR is a design-led menswear label..."
        rows={4}
      />
      
      <ContentField
        label="Social Links (Instagram, TikTok URLs)"
        type="textarea"
        value={content.socialLinks}
        onChange={(v) => updateField('socialLinks', v)}
        placeholder="https://instagram.com/noxrstudio"
        rows={3}
      />
    </div>
  )
}

function ContentField({ label, type, value, onChange, placeholder, rows }: ContentFieldProps) {
  return (
    <div>
      <p className="overline mb-3" style={{ color: 'rgba(26,18,8,0.35)' }}>
        {label}
      </p>
      {type === 'textarea' ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="w-full bg-transparent border outline-none resize-none p-4"
          style={{
            borderColor: 'rgba(26,18,8,0.15)',
            fontFamily: "'Jost', sans-serif",
            fontSize: '14px',
            fontWeight: 300,
            color: '#1A1208',
            lineHeight: 1.7,
          }}
        />
      ) : (
        <input
          type="text"
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
          }}
        />
      )}
    </div>
  )
}