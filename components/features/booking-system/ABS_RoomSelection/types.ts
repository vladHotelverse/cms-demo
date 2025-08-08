export interface RoomSelectionConfig {
  id: string
  title: string
  description: string
  url: string
  type: 'iframe'
  iframe: {
    width: string
    height: string
    frameBorder: number
    allowFullScreen: boolean
    title: string
  }
}

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