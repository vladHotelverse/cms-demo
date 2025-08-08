import React from 'react'

export interface RoomSelectionProps {
  title: string
  description: string
  url: string
  iframe?: {
    width: string
    height: string
    frameBorder: number
    allowFullScreen: boolean
    title: string
  }
  className?: string
}

export const ABS_RoomSelection: React.FC<RoomSelectionProps> = ({
  title,
  description,
  url,
  iframe = {
    width: '100%',
    height: '400px', // This will be overridden by responsive logic
    frameBorder: 0,
    allowFullScreen: true,
    title: 'Choose your room number - Interactive Hotel Map',
  },
  className = '',
}) => {
  // Dynamic height based on screen size: 800px for desktop, 400px for mobile
  const getResponsiveHeight = () => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768 ? '800px' : '400px'
    }
    return '400px' // Fallback for SSR
  }

  const [height, setHeight] = React.useState(getResponsiveHeight)

  React.useEffect(() => {
    const handleResize = () => {
      setHeight(getResponsiveHeight())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const dynamicIframe = {
    ...iframe,
    height
  }

  return (
    <section className={`w-full ${className}`}>
      <div className="container mx-auto px-4 py-8 max-h-[800px] relative bg-white p-4 md:p-6 rounded-lg shadow border border-neutral-300 ">
        <div className='absolute left-6'>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {title}
          </h2>
          <p className="text-gray-600 text-sm md:text-base mb-0">
            {description}
          </p>
        </div>
          <iframe
            src={url}
            width={dynamicIframe.width}
            height={dynamicIframe.height}
            frameBorder={dynamicIframe.frameBorder}
            allowFullScreen={true}
            title={dynamicIframe.title}
            className="w-full rounded-lg mt-10"
            style={{ minHeight: height, borderRadius: '10px' }}
          />
      </div>
    </section>
  )
}

export default ABS_RoomSelection