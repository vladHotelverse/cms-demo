import { Icon } from '@/lib/iconify-fallback'
import type React from 'react'

const iconMap = {
  // Bed icons - more specific representations
  bed: 'mdi:bed-single', // Default bed icon
  'bed-twin': 'mdi:bed-single', // Twin beds
  'bed-king': 'mdi:bed-king', // King size bed
  'bed-double': 'mdi:bed-double', // Double bed
  
  // Building and structure icons
  hotel: 'solar:buildings-3-bold-duotone',
  building: 'solar:buildings-2-bold-duotone',
  home: 'solar:home-bold-duotone',
  layout: 'solar:widget-2-bold-duotone',
  layers: 'solar:layers-bold-duotone',
  floor: 'solar:layers-bold-duotone',
  
  // View icons - more specific to what guests see
  'city-view': 'solar:city-bold-duotone', // City view - shows skyline
  'garden-view': 'mdi:flower', // Garden view - flower icon
  'stage-view': 'mdi:theater', // Stage view - clear theater design
  'mountain-view': 'solar:mountains-bold-duotone', // Mountain view
  
  // Water/Sea view icons - differentiated
  waves: 'solar:swimming-bold', // Access to Pool / Close to Pool
  'pool-view': 'mdi:pool', // Pool view - actual pool icon
  'lateral-sea-view': 'mdi:waves-arrow-right', // Lateral sea view
  'sea-frontal-view': 'mdi:waves-arrow-up', // Sea frontal view
  
  // Location and amenity icons
  location: 'solar:map-point-wave-bold-duotone', // Better location indicator
  utensils: 'solar:cup-hot-bold', // Restaurant/dining
  baby: 'solar:users-group-rounded-bold', // Family
  heart: 'mdi:spa', // Wellness/spa
  umbrella: 'mdi:beach', // Beach access
  'volume-x': 'solar:soundwave-bold', // Quiet zone
  
  // Distribution and room feature icons
  flower: 'mdi:flower-tulip', // Garden access
  'door-open': 'mdi:balcony', // Balcony
  link: 'solar:link-round-bold', // Connecting rooms
  sofa: 'mdi:sofa-single', // Living room/sofa bed
  sun: 'mdi:weather-sunset', // Terrace/sun exposure
  
  // Special feature icons
  users: 'solar:users-group-two-rounded-bold',
  compass: 'solar:compass-big-bold',
  eye: 'solar:eye-bold', // Best views
  package: 'solar:box-bold',
  accessibility: 'mdi:wheelchair-accessibility', // Proper accessibility icon
  sparkles: 'solar:star-bold', // Premium features
  
  // Additional mappings from mockData
  'arrow-up': 'solar:arrow-up-bold', // Upper floor
  'corner-up-right': 'mdi:flower-tulip-outline', // Garden/Stage view fallback
} as const

// Context-based icon overrides for specific labels
const labelIconMap: Record<string, string> = {
  'Close to Pool': 'mdi:swim',
  'Access to Pool': 'mdi:pool',
  'Pool View': 'mdi:pool',
  'Lateral Sea View': 'mdi:beach',
  'Sea Frontal View': 'mdi:island',
  'Garden View': 'mdi:tree',
  'Stage View': 'mdi:theater',
  'Afternoon Sun': 'mdi:weather-sunset',
  'All-day Sun': 'mdi:weather-sunny',
  'Terrace': 'mdi:balcony',
}

interface IconRendererProps {
  iconName?: string
  className?: string
  fallbackImageUrl?: string
  label?: string // Add label prop to help differentiate icons
}

export const IconRenderer: React.FC<IconRendererProps> = ({ 
  iconName, 
  className = 'h-10 w-10', 
  fallbackImageUrl,
  label 
}) => {
  if (!iconName) {
    return fallbackImageUrl ? (
      <img src={fallbackImageUrl} alt="Icon" className="object-contain w-12 aspect-square" />
    ) : (
      <Icon icon="solar:widget-bold" className={className} />
    )
  }

  // First check if we have a label-specific icon
  if (label && labelIconMap[label]) {
    return <Icon icon={labelIconMap[label]} className={className} />
  }

  const iconString = iconMap[iconName as keyof typeof iconMap]
  if (!iconString) {
    console.warn(`Icon not found in iconMap: ${iconName}`)
    return <Icon icon="solar:widget-bold" className={className} />
  }
  
  return <Icon icon={iconString} className={className} />
}