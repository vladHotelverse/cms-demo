import type React from 'react'
import BookingInfoItem from './BookingInfoItem'
import type { BookingInfoBarItemProps } from '../types'
import { getIcon } from '../helpers'
interface RoomItemsGridProps {
  items: BookingInfoBarItemProps[]
  roomId: string
  isMobile?: boolean
}

export const RoomItemsGrid: React.FC<RoomItemsGridProps> = ({ items, roomId, isMobile = false }) => {
  if (isMobile) {
    return (
      <div className="grid grid-cols-1 gap-3 pt-3 min-w-0 overflow-hidden">
        {items.map((item, index) => (
          <BookingInfoItem
            key={`mobile-${roomId}-${item.icon}-${item.label}-${index}`}
            icon={getIcon(item.icon)}
            label={item.label}
            value={item.value}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 h-full w-full max-w-[60%] min-w-0">
      {items.map((item, index) => (
        <div key={`${roomId}-${item.icon}-${item.label}-${index}`} className="flex items-center gap-4 h-full min-w-0">
          <div className="flex-shrink-0">{getIcon(item.icon, 'h-4 w-4 text-gray-400')}</div>
          <div className="flex flex-col min-w-0 flex-1 gap-1.5 overflow-hidden">
            <span className="text-xs font-medium text-gray-600 truncate">{item.label}</span>
            <span className="text-sm text-gray-900 font-semibold truncate">{item.value}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
