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
        background: 'linear-gradient(135deg, #0c1221 0%, #1e293b 100%)',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        color: '#f1f5f9',
        position: 'relative',
      }}
    >
      {/* Strategic grid pattern */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)
          `,
        }}
      />
      
      {/* Chess piece elements */}
      <div
        style={{
          position: 'absolute',
          top: '60px',
          left: '80px',
          fontSize: '40px',
          opacity: 0.15,
          color: '#3b82f6',
        }}
      >
        ♚
      </div>
      <div
        style={{
          position: 'absolute',
          top: '140px',
          right: '100px',
          fontSize: '32px',
          opacity: 0.2,
          color: '#10b981',
        }}
      >
        ♞
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: '120px',
          left: '120px',
          fontSize: '36px',
          opacity: 0.18,
          color: '#8b5cf6',
        }}
      >
        ♜
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: '180px',
          right: '80px',
          fontSize: '28px',
          opacity: 0.12,
          color: '#3b82f6',
        }}
      >
        ♟
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
        {/* Logo with chess motif */}
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
            border: '3px solid #1e293b',
          }}
        >
          ♚
          {/* Strategic accent pieces */}
          <div
            style={{
              position: 'absolute',
              top: '-12px',
              right: '-12px',
              width: '28px',
              height: '28px',
              background: '#8b5cf6',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              border: '2px solid #0c1221',
            }}
          >
            ♞
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: '-12px',
              left: '-12px',
              width: '24px',
              height: '24px',
              background: '#10b981',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              border: '2px solid #0c1221',
            }}
          >
            ♟
          </div>
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
          TACTICS
        </div>
        
        {/* Subtitle */}
        <div
          style={{
            fontSize: '28px',
            color: '#94a3b8',
            textAlign: 'center',
            maxWidth: '800px',
            lineHeight: '1.3',
            marginBottom: '30px',
          }}
        >
          Strategic Gaming & Competitive Esports Community
        </div>
        
        {/* Gaming elements */}
        <div
          style={{
            display: 'flex',
            gap: '25px',
            fontSize: '20px',
            color: '#64748b',
          }}
        >
          <span>🎮 Gaming</span>
          <span>•</span>
          <span>🏆 Esports</span>
          <span>•</span>
          <span>🧠 Strategy</span>
          <span>•</span>
          <span>🤝 Teams</span>
        </div>
      </div>
    </div>,
    {
      ...size,
    }
  )
}