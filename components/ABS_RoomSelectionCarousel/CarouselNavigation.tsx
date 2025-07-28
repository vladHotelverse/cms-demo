import type React from 'react'

interface CarouselNavigationProps {
  onPrev: () => void
  onNext: () => void
  previousLabel?: string
  nextLabel?: string
}

const CarouselNavigation: React.FC<CarouselNavigationProps> = ({
  onPrev,
  onNext,
  previousLabel = 'Previous room',
  nextLabel = 'Next room',
}) => {
  return (
    <>
      <button
        onClick={onPrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm rounded-full shadow-md p-2 transition-all duration-200 hover:bg-white focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
        aria-label={previousLabel}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <button
        onClick={onNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm rounded-full shadow-md p-2 transition-all duration-200 hover:bg-white focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
        aria-label={nextLabel}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </>
  )
}

export default CarouselNavigation
