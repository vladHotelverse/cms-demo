import type React from 'react'
import BookingInfoItem from './BookingInfoItem'
import { getIcon } from '../helpers'
import type { BookingInfoBarItemProps } from '../types'

interface SingleBookingInfoProps {
  title: string
  items: BookingInfoBarItemProps[]
}

const SingleBookingInfo: React.FC<SingleBookingInfoProps> = ({ title, items = [] }) => {
  return (
    <>
      {/* XL Desktop version - compact view only on large screens */}
      <div className="hidden xl:block">
        <div className="container mx-auto py-3">
          <h4 className="ml-4 mb-4 font-medium text-md">{title}</h4>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-y-4 gap-x-8 p-4">
            {items?.map((item, index) => (
              <BookingInfoItem
                key={`${item.icon}-${item.label}-${index}`}
                icon={getIcon(item.icon)}
                label={item.label}
                value={item.value}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile/Tablet/Desktop version - accordion for smaller screens */}
      <div className="block xl:hidden">
        <div className="container mx-auto p-4 overflow-hidden">
          <h4 className="mb-4 font-medium text-md">{title}</h4>
          <div className="grid grid-cols-2 gap-2 min-w-0">
            {items?.map((item, index) => (
              <BookingInfoItem
                key={`mobile-${item.icon}-${item.label}-${index}`}
                icon={getIcon(item.icon)}
                label={item.label}
                value={item.value}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default SingleBookingInfo
