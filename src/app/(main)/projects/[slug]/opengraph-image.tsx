import { ImageResponse } from 'next/og'

// TODO: Update to use Convex projects API

// Image metadata
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

interface ProjectOGImageProps {
  params: Promise<{
    slug: string
  }>
}

// Image generation
export default async function Image({ params }: ProjectOGImageProps) {
  const { slug } = await params
  
  let project
  let hasError = false
  
  try {
    project = await projectsApi.getProjectBasic(decodeURIComponent(slug))
  } catch (error) {
    console.error('Failed to fetch project for OG image:', error)
    hasError = true
  }

  if (hasError || !project) {
    // Simple fallback OG image
    return new ImageResponse(
      <div
        style={{
          fontSize: 48,
          background: 'linear-gradient(135deg, #0f0720 0%, #1a0b2e 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fafafa',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: '80px',
            fontWeight: 'bold',
            color: '#ec4899',
            marginBottom: '30px',
          }}
        >
          Project Not Found
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: '32px',
            color: '#8b5cf6',
          }}
        >
          Explore amazing projects on CS Guild
        </div>
      </div>,
      {
        ...size,
      }
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
    case 'OPEN':
      return '#10b981'
    case 'IN_PROGRESS':
      return '#8b5cf6'
    case 'COMPLETED':
      return '#ec4899'
    case 'CANCELLED':
      return '#ef4444'
    default:
      return '#6b7280'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return new ImageResponse(
    <div
      style={{
        fontSize: 48,
        background: 'linear-gradient(135deg, #0f0720 0%, #1a0b2e 100%)',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px',
        color: '#fafafa',
      }}
    >
      {/* Project Status */}
      <div
        style={{
          display: 'flex',
          fontSize: '24px',
          fontWeight: 'bold',
          color: getStatusColor(project.status),
          backgroundColor: getStatusColor(project.status) + '20',
          padding: '12px 24px',
          borderRadius: '12px',
          marginBottom: '40px',
        }}
      >
        {project.status.replace('_', ' ')}
      </div>

      {/* Project Title */}
      <div
        style={{
          display: 'flex',
          fontSize: '72px',
          fontWeight: 'bold',
          color: '#ec4899',
          marginBottom: '30px',
          textAlign: 'center',
          maxWidth: '1000px',
        }}
      >
        {project.title}
      </div>

      {/* Project Description */}
      <div
        style={{
          display: 'flex',
          fontSize: '28px',
          color: '#d1d5db',
          textAlign: 'center',
          maxWidth: '900px',
          marginBottom: '40px',
        }}
      >
        {project.description?.substring(0, 100)}...
      </div>

      {/* Additional Details */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '40px',
          marginBottom: '30px',
        }}
      >
        {/* Due Date */}
        {project.dueDate && (
          <div
            style={{
              display: 'flex',
              fontSize: '20px',
              color: '#8b5cf6',
            }}
          >
            📅 Due {formatDate(project.dueDate)}
          </div>
        )}
        
        {/* Role Count */}
        <div
          style={{
            display: 'flex',
            fontSize: '20px',
            color: '#ec4899',
          }}
        >
          👥 {project.roles?.length || 0} roles available
        </div>
      </div>

      {/* Owner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          fontSize: '24px',
          color: '#d1d5db',
          marginBottom: '20px',
        }}
      >
        <div
          style={{
            display: 'flex',
            width: '50px',
            height: '50px',
            backgroundColor: '#8b5cf6',
            borderRadius: '25px',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#ffffff',
            marginRight: '15px',
          }}
        >
          {project.owner.firstName[0]}{project.owner.lastName[0]}
        </div>
        by {project.owner.firstName} {project.owner.lastName}
      </div>

      {/* CS Guild branding */}
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          bottom: '40px',
          right: '60px',
          fontSize: '20px',
          color: '#8b5cf6',
          fontWeight: 'bold',
        }}
      >
        CS Guild
      </div>
    </div>,
    {
      ...size,
    }
  )
}
