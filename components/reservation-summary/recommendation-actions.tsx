"use client"

import { Button } from "@/components/ui/button"
import { Check, X, CheckCircle } from "lucide-react"

interface RecommendationActionsProps {
  isAccepted: boolean
  onAccept: () => void
  onDecline: () => void
  t: (key: string) => string
}

export function RecommendationActions({
  isAccepted,
  onAccept,
  onDecline,
  t
}: RecommendationActionsProps) {
  return (
    <div className="flex flex-col gap-2 flex-shrink-0">
      <Button 
        variant="outline" 
        size="sm"
        onClick={onDecline}
        disabled={isAccepted}
        className="border-red-200 text-red-600 hover:bg-red-50"
      >
        <X className="w-4 h-4 mr-1" />
        {t('decline')}
      </Button>
      <Button 
        size="sm"
        onClick={onAccept}
        disabled={isAccepted}
        variant="outline"
        className={isAccepted ? "bg-gray-100 text-gray-600" : "border-green-200 text-green-600 hover:bg-green-50"}
      >
        {isAccepted ? (
          <>
            <CheckCircle className="w-4 h-4 mr-1" />
            {t('confirmed')}
          </>
        ) : (
          <>
            <Check className="w-4 h-4 mr-1" />
            {t('accept')}
          </>
        )}
      </Button>
    </div>
  )
}