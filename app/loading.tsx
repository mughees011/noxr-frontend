'use client'
export default function Loading() {
  return (
    <div 
      className="min-h-screen flex items-center justify-center" 
      style={{ backgroundColor: '#F7F3ED' }}
    >
      <div className="text-center">
        {/* Spinner */}
        <div className="inline-block relative w-16 h-16 mb-6">
          <div 
            className="absolute top-0 left-0 w-full h-full rounded-full animate-spin"
            style={{
              border: '2px solid rgba(26,18,8,0.1)',
              borderTopColor: '#1A1208',
            }}
          />
        </div>
        
        <p 
          className="font-body text-sm" 
          style={{ 
            fontFamily: "'Jost', sans-serif",
            color: 'rgba(26,18,8,0.35)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            fontSize: '9px'
          }}
        >
          Loading...
        </p>
      </div>
    </div>
  )
}