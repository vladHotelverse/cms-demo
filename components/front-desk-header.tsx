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
  agent?: {
    name: string
    role: string
    commission: number
  }
}

export function FrontDeskHeader({
  activeTab,
  onTabChange,
  openTabs,
  onCloseTab,
  isInReservationMode,
  t,
  className,
  agent
}: FrontDeskHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between border-b bg-background h-[61px] px-4", className)}>
      <div className="flex items-center">
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
                  <span
                    onClick={(e) => {
                      e.stopPropagation()
                      onCloseTab(tab.id)
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        e.stopPropagation()
                        onCloseTab(tab.id)
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-200 rounded-full p-1 cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </span>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      
      {agent && (
        <div className="flex items-center gap-2 text-sm">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-semibold text-xs">
              {agent.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </span>
          </div>
          <div className="text-right">
            <div className="font-medium">{agent.name}</div>
            <div className="text-xs text-muted-foreground">{agent.role}</div>
          </div>
          <div className="ml-2 text-right">
            <div className="text-xs text-muted-foreground">Commission:</div>
            <div className="font-semibold text-green-600">€{agent.commission.toFixed(2)}</div>
          </div>
        </div>
      )}
    </div>
  )
}
