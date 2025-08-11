import { AlertTriangle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

interface ErrorMessageProps {
  message: string
  onClose?: () => void
  className?: string
  variant?: "default" | "destructive"
}

export function ErrorMessage({ 
  message, 
  onClose, 
  className,
  variant = "destructive" 
}: ErrorMessageProps) {
  return (
    <Alert variant={variant} className={cn("relative", className)}>
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="pr-8">
        {message}
      </AlertDescription>
      {onClose && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 h-6 w-6 p-0"
          onClick={onClose}
        >
          <X className="h-3 w-3" />
          <span className="sr-only">Close</span>
        </Button>
      )}
    </Alert>
  )
}