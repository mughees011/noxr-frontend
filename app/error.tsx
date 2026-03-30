'use client'
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div 
      className="min-h-screen flex items-center justify-center px-6" 
      style={{ backgroundColor: '#F7F3ED' }}
    >
      <div className="text-center max-w-md">
        <h1 
          className="font-display text-6xl md:text-8xl mb-6" 
          style={{ 
            fontFamily: "'Cormorant Garamond', serif",
            color: '#1A1208',
            fontWeight: 300,
            letterSpacing: '-0.02em'
          }}
        >
          Oops
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
          Something unexpected happened. Don't worry, we're on it.
        </p>
        
        <button 
          onClick={() => reset()} 
          className="btn-primary"
          style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: '9px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            padding: '16px 56px',
            border: '0.5px solid #1A1208',
            backgroundColor: 'transparent',
            color: '#1A1208',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
        >
          <span>Try Again</span>
        </button>
      </div>
    </div>
  )
}