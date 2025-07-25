import { ArrowUpCircle, CreditCard, Pencil } from 'lucide-react'
import type React from 'react'
import { useState } from 'react'
import { Card, CardContent } from '../../ui/card'
import type { AvailableSection } from '../types'

interface SectionCardProps {
  section: AvailableSection
  exploreLabel: string
  fromLabel: string
  euroSuffix: string
}

const SectionCard: React.FC<SectionCardProps> = ({ section, fromLabel, euroSuffix }) => {
  const [isHovered, setIsHovered] = useState(false)

  const formatPrice = (price: number): string => {
    return `${price.toFixed(2)} ${euroSuffix}`
  }

  const getIconAndColors = () => {
    switch (section.type) {
      case 'room':
        return {
          icon: ArrowUpCircle,
          iconColor: 'text-blue-500',
          bgHover: 'hover:bg-blue-50',
          borderHover: 'hover:border-blue-300',
        }
      case 'customization':
        return {
          icon: Pencil,
          iconColor: 'text-green-500',
          bgHover: 'hover:bg-green-50',
          borderHover: 'hover:border-green-300',
        }
      case 'offer':
        return {
          icon: CreditCard,
          iconColor: 'text-purple-500',
          bgHover: 'hover:bg-purple-50',
          borderHover: 'hover:border-purple-300',
        }
      default:
        return {
          icon: ArrowUpCircle,
          iconColor: 'text-neutral-600',
          bgHover: 'hover:bg-neutral-50',
          borderHover: 'hover:border-neutral-300',
        }
    }
  }

  const { icon: IconComponent, iconColor, bgHover, borderHover } = getIconAndColors()

  return (
    <Card
      className={`transition-all duration-300 border-2 ${
        isHovered ? `${bgHover} ${borderHover}` : 'border-neutral-200 hover:border-neutral-300'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={section.onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`p-2 rounded-full transition-colors duration-200 ${
                isHovered ? 'bg-white shadow-sm' : 'bg-neutral-50'
              }`}
            >
              <IconComponent className={`h-5 w-5 ${iconColor}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium text-sm text-neutral-800">{section.label}</h3>
              </div>
              {section.startingPrice !== undefined && (
                <p className="text-xs text-neutral-500">
                  {fromLabel} {formatPrice(section.startingPrice)}
                </p>
              )}
            </div>
          </div>

          {/* <Button
            variant="ghost"
            size="sm"
            className={`text-blue-600 font-medium hover:bg-blue-50 transition-colors duration-200 ${
              isHovered ? 'bg-blue-50' : ''
            }`}
          >
            <span className="text-xs">{exploreLabel}</span>
            <ChevronRight className="h-3 w-3 ml-1" />
          </Button> */}
        </div>

        {/* Show description on hover */}
        {isHovered && section.description && (
          <div className="mt-3 pl-10 animate-in fade-in duration-500">
            <p className="text-xs text-neutral-600 leading-relaxed">{section.description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default SectionCard
