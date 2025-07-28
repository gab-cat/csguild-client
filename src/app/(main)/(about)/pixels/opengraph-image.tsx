import { ImageResponse } from 'next/og'

// Image metadata
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

// Image generation
export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        fontSize: 48,
        background: '#fffef5',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        color: '#1e3a8a',
        position: 'relative',
      }}
    >
      {/* Background decorative elements */}
      <div
        style={{
          position: 'absolute',
          top: '60px',
          left: '100px',
          width: '40px',
          height: '40px',
          background: '#dc2626',
          borderRadius: '50%',
          opacity: 0.3,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '150px',
          right: '120px',
          width: '30px',
          height: '30px',
          background: '#16a34a',
          borderRadius: '50%',
          opacity: 0.4,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '100px',
          left: '150px',
          width: '35px',
          height: '35px',
          background: '#2563eb',
          borderRadius: '50%',
          opacity: 0.3,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '180px',
          right: '180px',
          width: '25px',
          height: '25px',
          background: '#dc2626',
          transform: 'rotate(45deg)',
          opacity: 0.4,
        }}
      />
      
      {/* Main content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <div
          style={{
            width: '140px',
            height: '140px',
            background: '#dc2626',
            borderRadius: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '40px',
            border: '6px solid #1e3a8a',
            position: 'relative',
          }}
        >
          <div
            style={{
              width: '120px',
              height: '120px',
              background: '#fffef5',
              borderRadius: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '72px',
              fontWeight: 'bold',
              color: '#dc2626',
            }}
          >
            P
          </div>
          {/* Small decorative dots */}
          <div
            style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              width: '24px',
              height: '24px',
              background: '#dc2626',
              borderRadius: '50%',
              border: '3px solid #1e3a8a',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-8px',
              left: '-8px',
              width: '16px',
              height: '16px',
              background: '#16a34a',
              borderRadius: '50%',
              border: '2px solid #1e3a8a',
            }}
          />
        </div>
        
        {/* Title */}
        <div
          style={{
            fontSize: '96px',
            fontWeight: 'bold',
            color: '#1e3a8a',
            marginBottom: '20px',
            lineHeight: '1.1',
            letterSpacing: '-2px',
          }}
        >
          PIXELS
        </div>
        
        {/* Subtitle */}
        <div
          style={{
            fontSize: '28px',
            color: '#1e3a8a',
            textAlign: 'center',
            maxWidth: '900px',
            lineHeight: '1.3',
            opacity: 0.8,
            marginBottom: '30px',
          }}
        >
          Pioneers of Ignatian Expressive Electronic Arts and Learning Society
        </div>
        
        {/* Creative elements */}
        <div
          style={{
            display: 'flex',
            gap: '30px',
            fontSize: '24px',
            color: '#1e3a8a',
            opacity: 0.7,
          }}
        >
          <span>📸 Photography</span>
          <span>🎨 Digital Art</span>
          <span>🎬 Visual Stories</span>
        </div>
      </div>
    </div>,
    {
      ...size,
    }
  )
}