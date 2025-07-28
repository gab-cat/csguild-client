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
        background: 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        color: '#2d2d2d',
        position: 'relative',
      }}
    >
      {/* Notion-style block elements */}
      <div
        style={{
          position: 'absolute',
          top: '100px',
          left: '120px',
          width: '120px',
          height: '8px',
          background: '#e6e6e6',
          borderRadius: '4px',
          opacity: 0.6,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '120px',
          left: '120px',
          width: '80px',
          height: '8px',
          background: '#d1d5db',
          borderRadius: '4px',
          opacity: 0.5,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '150px',
          right: '120px',
          width: '100px',
          height: '8px',
          background: '#e6e6e6',
          borderRadius: '4px',
          opacity: 0.4,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '130px',
          right: '120px',
          width: '140px',
          height: '8px',
          background: '#d1d5db',
          borderRadius: '4px',
          opacity: 0.3,
        }}
      />
      
      {/* Notion-style page icon background */}
      <div
        style={{
          position: 'absolute',
          top: '80px',
          right: '100px',
          fontSize: '32px',
          opacity: 0.2,
        }}
      >
        📝
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: '200px',
          left: '80px',
          fontSize: '28px',
          opacity: 0.15,
        }}
      >
        📊
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
        {/* Notion-style logo */}
        <div
          style={{
            width: '140px',
            height: '140px',
            background: '#2d2d2d',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '40px',
            fontSize: '80px',
            position: 'relative',
          }}
        >
          📝
          {/* Notion-style shadow */}
          <div
            style={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              width: '140px',
              height: '140px',
              background: '#e6e6e6',
              borderRadius: '20px',
              zIndex: -1,
            }}
          />
        </div>
        
        {/* Title */}
        <div
          style={{
            fontSize: '84px',
            fontWeight: 'bold',
            color: '#2d2d2d',
            marginBottom: '20px',
            lineHeight: '1.1',
          }}
        >
          Notion
        </div>
        
        {/* Subtitle */}
        <div
          style={{
            fontSize: '28px',
            color: '#6b7280',
            textAlign: 'center',
            maxWidth: '800px',
            lineHeight: '1.3',
            marginBottom: '30px',
          }}
        >
          All-in-one Workspace for Student Productivity & Organization
        </div>
        
        {/* Feature elements */}
        <div
          style={{
            display: 'flex',
            gap: '25px',
            fontSize: '20px',
            color: '#9ca3af',
          }}
        >
          <span>📝 Notes</span>
          <span>•</span>
          <span>📊 Databases</span>
          <span>•</span>
          <span>🗓️ Planning</span>
          <span>•</span>
          <span>🤝 Collaboration</span>
        </div>
      </div>
    </div>,
    {
      ...size,
    }
  )
}