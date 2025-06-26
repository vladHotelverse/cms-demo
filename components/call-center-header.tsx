"use client"

import React from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface CallCenterHeaderProps {
  activeTab: string
  onTabChange: (value: string) => void
  t: (key: string) => string
  className?: string
}

export function CallCenterHeader({
  activeTab,
  onTabChange,
  t,
  className
}: CallCenterHeaderProps) {
  return (
    <div className={cn("flex items-center border-b bg-background h-[61px] px-4", className)}>
      <SidebarTrigger className="mr-4" />
      <TabsList className="h-10">
        <TabsTrigger value="call-center">
          {t("callCenter")}
        </TabsTrigger>
        <TabsTrigger value="dashboard" disabled>
          {t("dashboard")}
        </TabsTrigger>
      </TabsList>
    </div>
  )
} 