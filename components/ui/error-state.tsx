import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "./button"
import { cn } from "@/lib/utils"

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  className?: string
  showRetry?: boolean
}

export function ErrorState({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  onRetry,
  className,
  showRetry = true
}: ErrorStateProps) {
  return (
    <div className={cn("flex items-center justify-center p-8", className)}>
      <div className="flex flex-col items-center gap-4 text-center max-w-md">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-muted-foreground text-sm">{message}</p>
        </div>
        {showRetry && onRetry && (
          <Button onClick={onRetry} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        )}
      </div>
    </div>
  )
}