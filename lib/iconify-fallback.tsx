import React from 'react'

// Simple fallback component for @iconify/react
export interface IconProps {
  icon: string
  className?: string
  width?: number | string
  height?: number | string
  style?: React.CSSProperties
}

const iconMap: Record<string, string> = {
  'mdi:bed': '🛏️',
  'mdi:home': '🏠',
  'mdi:floor': '🏢',
  'mdi:location': '📍',
  'mdi:wifi': '📶',
  'mdi:parking': '🅿️',
  'mdi:pool': '🏊',
  'mdi:gym': '💪',
  'mdi:restaurant': '🍽️',
  'mdi:spa': '🧘',
  'mdi:view': '👁️',
  'mdi:balcony': '🏠',
  'mdi:air-conditioning': '❄️',
  'mdi:heating': '🔥',
  'mdi:television': '📺',
  'mdi:coffee': '☕',
  'mdi:minibar': '🍺',
  'mdi:safe': '🔒',
  'mdi:shower': '🚿',
  'mdi:bathtub': '🛁',
  'mdi:hairdryer': '💨',
  'mdi:iron': '👔',
  'mdi:laundry': '👕',
  'mdi:room-service': '🛎️',
  'mdi:concierge': '🤵',
  'mdi:check': '✅',
  'mdi:close': '❌',
  'mdi:plus': '+',
  'mdi:minus': '-',
  'default': '🏨'
}

export const Icon: React.FC<IconProps> = ({ 
  icon, 
  className = '', 
  width = 24, 
  height = 24, 
  style = {} 
}) => {
  const emoji = iconMap[icon] || iconMap['default']
  
  return (
    <span 
      className={className}
      style={{
        display: 'inline-block',
        fontSize: typeof width === 'number' ? `${width}px` : width,
        lineHeight: 1,
        ...style
      }}
      role="img"
      aria-label={icon}
    >
      {emoji}
    </span>
  )
}

export default Icon