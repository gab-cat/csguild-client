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
        background: 'linear-gradient(135deg, #0f1419 0%, #1a1f36 100%)',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        color: '#fafafa',
        position: 'relative',
      }}
    >
      {/* Background pattern */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)
          `,
        }}
      />
      
      {/* Floating code elements */}
      <div
        style={{
          position: 'absolute',
          top: '80px',
          left: '100px',
          fontSize: '24px',
          opacity: 0.2,
          color: '#3b82f6',
          fontFamily: 'monospace',
        }}
      >
        {'{ code }'}
      </div>
      <div
        style={{
          position: 'absolute',
          top: '140px',
          right: '120px',
          fontSize: '20px',
          opacity: 0.15,
          color: '#10b981',
          fontFamily: 'monospace',
        }}
      >
        {'</dev>'}
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: '120px',
          left: '80px',
          fontSize: '22px',
          opacity: 0.18,
          color: '#8b5cf6',
          fontFamily: 'monospace',
        }}
      >
        {'function()'}
      </div>
      
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
        {/* Logo/Icon */}
        <div
          style={{
            width: '140px',
            height: '140px',
            background: 'linear-gradient(45deg, #3b82f6, #10b981)',
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '40px',
            fontSize: '72px',
            fontWeight: 'bold',
            position: 'relative',
          }}
        >
          {'</>'}
          {/* Tech accent elements */}
          <div
            style={{
              position: 'absolute',
              top: '-10px',
              right: '-10px',
              width: '24px',
              height: '24px',
              background: '#8b5cf6',
              borderRadius: '50%',
              border: '3px solid #0f1419',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-10px',
              left: '-10px',
              width: '20px',
              height: '20px',
              background: '#f59e0b',
              borderRadius: '50%',
              border: '2px solid #0f1419',
            }}
          />
        </div>
        
        {/* Title */}
        <div
          style={{
            fontSize: '88px',
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #3b82f6, #10b981)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            marginBottom: '20px',
            lineHeight: '1.1',
          }}
        >
          CS Guild
        </div>
        
        {/* Subtitle */}
        <div
          style={{
            fontSize: '28px',
            color: '#a1a1aa',
            textAlign: 'center',
            maxWidth: '800px',
            lineHeight: '1.3',
            marginBottom: '30px',
          }}
        >
          Computer Science Guild - Building the Future Together
        </div>
        
        {/* Tech elements */}
        <div
          style={{
            display: 'flex',
            gap: '25px',
            fontSize: '20px',
            color: '#71717a',
          }}
        >
          <span>💻 Programming</span>
          <span>•</span>
          <span>🚀 Innovation</span>
          <span>•</span>
          <span>🤝 Community</span>
        </div>
      </div>
    </div>,
    {
      ...size,
    }
  )
}
