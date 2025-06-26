"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

interface AppHeaderProps {
  title?: string
  children?: React.ReactNode
  className?: string
}

export function AppHeader({ title, children, className }: AppHeaderProps) {
  return (
    <header className={cn("flex items-center border-b bg-background px-4 py-3 h-[61px]", className)}>
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        {title && <h1 className="text-lg font-semibold">{title}</h1>}
      </div>
      <div className="flex-1">
        {children}
      </div>
    </header>
  )
} 