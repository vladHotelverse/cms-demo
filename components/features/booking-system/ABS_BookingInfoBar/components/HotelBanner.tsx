import type React from 'react'

interface HotelBannerProps {
  hotelImage: string
  showBanner: boolean
}

const HotelBanner: React.FC<HotelBannerProps> = ({ hotelImage, showBanner }) => {
  if (!showBanner) return null

  return (
    <section className="bg-white rounded-t-lg">
      <div className="w-full overflow-hidden h-48 container mx-auto">
        <img src={hotelImage} alt="Hotel exterior view" className="w-full h-full object-cover rounded-t-lg" />
      </div>
    </section>
  )
}

export default HotelBanner
