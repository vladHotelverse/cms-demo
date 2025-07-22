import { Package, Plus } from "lucide-react"
import { Button } from "./button"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  title?: string
  message?: string
  actionLabel?: string
  onAction?: () => void
  className?: string
  icon?: React.ComponentType<{ className?: string }>
}

export function EmptyState({
  title = "No data found",
  message = "There's nothing to show here yet.",
  actionLabel,
  onAction,
  className,
  icon: Icon = Package
}: EmptyStateProps) {
  return (
    <div className={cn("flex items-center justify-center p-8", className)}>
      <div className="flex flex-col items-center gap-4 text-center max-w-md">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100">
          <Icon className="h-6 w-6 text-gray-600" />
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-muted-foreground text-sm">{message}</p>
        </div>
        {actionLabel && onAction && (
          <Button onClick={onAction} className="gap-2">
            <Plus className="h-4 w-4" />
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  )
}