"use client"

interface RecommendationDetailsProps {
  title: string
  description: string
  details?: string[]
}

export function RecommendationDetails({
  title,
  description,
  details
}: RecommendationDetailsProps) {
  return (
    <div className="flex-1">
      {/* Title and Description on top */}
      <div className="mb-3">
        <h4 className="font-semibold">{title}</h4>
        <p className="text-base text-muted-foreground">{description}</p>
      </div>
      
      {/* Bullet points on bottom */}
      {details && details.length > 0 && (
        <div className="text-sm text-muted-foreground">
          {details.map((detail, index) => (
            <div key={index}>• {detail}</div>
          ))}
        </div>
      )}
    </div>
  )
}