import { LoadingSpinner } from "./loading-spinner"
import { cn } from "@/lib/utils"

interface LoadingStateProps {
  message?: string
  className?: string
  size?: "sm" | "md" | "lg"
}

export function LoadingState({ 
  message = "Loading...", 
  className,
  size = "md" 
}: LoadingStateProps) {
  return (
    <div className={cn("flex items-center justify-center p-8", className)}>
      <div className="flex flex-col items-center gap-3">
        <LoadingSpinner size={size} />
        <p className="text-muted-foreground text-sm">{message}</p>
      </div>
    </div>
  )
}