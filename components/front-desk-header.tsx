"use client"

import React from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface OpenTab {
  id: string
  reservation: {
    name: string
  }
}

interface FrontDeskHeaderProps {
  activeTab: string
  onTabChange: (value: string) => void
  openTabs: OpenTab[]
  onCloseTab: (tabId: string) => void
  isInReservationMode: boolean
  t: (key: string) => string
  className?: string
}

export function FrontDeskHeader({
  activeTab,
  onTabChange,
  openTabs,
  onCloseTab,
  isInReservationMode,
  t,
  className
}: FrontDeskHeaderProps) {
  return (
    <div className={cn("flex items-center border-b bg-background h-[61px] px-4", className)}>
      <SidebarTrigger className="mr-4" />
      <Tabs value={activeTab} onValueChange={onTabChange}>
        <TabsList className="h-10">
          <TabsTrigger
            value="front-desk-upsell"
            disabled={isInReservationMode}
          >
            {t("frontDeskUpsell")}
          </TabsTrigger>
          <TabsTrigger
            value="dashboard"
            disabled
          >
            {t("dashboard")}
          </TabsTrigger>
          <TabsTrigger
            value="gestion-solicitudes"
            disabled
          >
            {t("gestionSolicitudes")}
          </TabsTrigger>

          {/* Dynamic reservation tabs */}
          {openTabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="group relative"
            >
              <div className="flex items-center gap-2">
                <span className="truncate max-w-32">{tab.reservation.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onCloseTab(tab.id)
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-200 rounded-full p-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  )
} 