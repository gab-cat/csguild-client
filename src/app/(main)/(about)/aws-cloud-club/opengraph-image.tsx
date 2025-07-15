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
        background: 'linear-gradient(135deg, #0f1419 0%, #1a202c 100%)',
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
      {/* AWS-style cloud pattern */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 20%, rgba(255, 153, 0, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(0, 123, 194, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, rgba(35, 47, 62, 0.2) 0%, transparent 50%)
          `,
        }}
      />
      
      {/* Floating cloud elements */}
      <div
        style={{
          position: 'absolute',
          top: '80px',
          left: '120px',
          fontSize: '40px',
          opacity: 0.2,
          color: '#ff9900',
        }}
      >
        ☁️
      </div>
      <div
        style={{
          position: 'absolute',
          top: '120px',
          right: '100px',
          fontSize: '30px',
          opacity: 0.3,
          color: '#007bce',
        }}
      >
        ☁️
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: '150px',
          left: '80px',
          fontSize: '35px',
          opacity: 0.25,
          color: '#ff9900',
        }}
      >
        ☁️
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
        {/* AWS-style logo */}
        <div
          style={{
            width: '140px',
            height: '140px',
            background: 'linear-gradient(45deg, #ff9900, #007bce)',
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
          ☁️
          {/* Small AWS-colored accent */}
          <div
            style={{
              position: 'absolute',
              bottom: '-8px',
              right: '-8px',
              width: '24px',
              height: '24px',
              background: '#ff9900',
              borderRadius: '50%',
              border: '3px solid #232f3e',
            }}
          />
        </div>
        
        {/* Title */}
        <div
          style={{
            fontSize: '64px',
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #ff9900, #007bce)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            marginBottom: '20px',
            lineHeight: '1.1',
            textAlign: 'center',
          }}
        >
          AWS Cloud Club
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
          Empowering Students with Cloud Computing Excellence
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
          <span>☁️ Cloud Infrastructure</span>
          <span>•</span>
          <span>🚀 Serverless</span>
          <span>•</span>
          <span>📊 DevOps</span>
        </div>
      </div>
    </div>,
    {
      ...size,
    }
  )
}