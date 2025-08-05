import clsx from 'clsx'
import type React from 'react'

export interface BookingInfoItemProps {
  icon: React.ReactNode
  label: string
  value: string | React.ReactNode
  className?: string
}

const BookingInfoItem: React.FC<BookingInfoItemProps> = ({ icon, label, value, className }) => {
  return (
    <div className={clsx('flex flex-col min-w-0', className)}>
      <div className="flex items-center gap-2 min-w-0">
        <div className="flex-shrink-0">{icon}</div>
        <span className="text-sm font-medium truncate">{label}</span>
      </div>
      <div className={clsx('text-black font-semibold mt-1 break-words overflow-hidden')}>{value}</div>
    </div>
  )
}

export default BookingInfoItem
