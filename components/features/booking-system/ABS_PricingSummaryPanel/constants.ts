// Configuration constants for ABS_PricingSummaryPanel
export const PANEL_CONFIG = {
  // Dimensions
  DEFAULT_WIDTH: 'w-[400px]',
  DEFAULT_STICKY_POSITION: 'top-28',
  IMAGE_HEIGHT: 'h-40',

  // Timing
  TOAST_DURATION: 3000, // ms
  LOADING_ANIMATION_DURATION: 300, // ms
  TRANSITION_DURATION: 'duration-300',

  // Performance
  PERFORMANCE_THRESHOLD: 100, // ms for large dataset rendering
  MAX_ITEMS_BEFORE_WARNING: 1000,

  // Layout breakpoints
  MOBILE_BREAKPOINT: 'w-[300px]',
  TABLET_BREAKPOINT: 'w-[400px]',
  DESKTOP_BREAKPOINT: 'w-[500px]',
} as const

// Default fallback image
export const DEFAULT_ROOM_IMAGE =
  'https://hvdataprostgweu.blob.core.windows.net/renderimages/h305/views/01_main/01d77a02-b92f-4214-a87c-79920dcbeded/background.webp'
