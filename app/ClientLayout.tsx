"use client"
import type React from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import AppSidebar from "@/components/app-sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/contexts/language-context"
import { usePathname } from "next/navigation"

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const isReservationPage = pathname === "/ventas/front-desk-upsell"

  return (
    <LanguageProvider>
      <ThemeProvider 
        attribute="class" 
        defaultTheme="light" 
        enableSystem
        disableTransitionOnChange
        suppressHydrationWarning
      >
        <SidebarProvider defaultOpen={!isReservationPage}>
          <div className="flex h-screen w-full overflow-hidden">
            <AppSidebar />
            <main className="flex-1 overflow-auto">
              {children}
            </main>
          </div>
        </SidebarProvider>
      </ThemeProvider>
    </LanguageProvider>
  )
}
