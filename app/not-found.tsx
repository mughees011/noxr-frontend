'use client'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div 
      className="min-h-screen flex items-center justify-center px-6" 
      style={{ backgroundColor: '#F7F3ED' }}
    >
      <div className="text-center max-w-md">
        <h1 
          className="font-display text-8xl md:text-9xl mb-6" 
          style={{ 
            fontFamily: "'Cormorant Garamond', serif",
            color: '#1A1208',
            fontWeight: 300,
            letterSpacing: '-0.02em'
          }}
        >
          404
        </h1>
        
        <p 
          className="font-body text-base md:text-lg mb-8" 
          style={{ 
            fontFamily: "'Jost', sans-serif",
            color: 'rgba(26,18,8,0.6)',
            fontWeight: 300,
            lineHeight: 1.6
          }}
        >
          This page doesn't exist. Perhaps it was never meant to be.
        </p>
        
        <Link 
          href="/" 
          className="btn-primary"
          style={{
            display: 'inline-block',
            fontFamily: "'Jost', sans-serif",
            fontSize: '9px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            padding: '16px 56px',
            border: '0.5px solid #1A1208',
            backgroundColor: 'transparent',
            color: '#1A1208',
            textDecoration: 'none',
            transition: 'all 0.3s ease',
          }}
        >
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  )
}