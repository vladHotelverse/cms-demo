"use client"
import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebar from "@/components/app-sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/contexts/language-context"
import { usePathname } from "next/navigation"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const isReservationPage = pathname === "/ventas/front-desk-upsell"

  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
          <ThemeProvider attribute="class" defaultTheme="light">
            <SidebarProvider defaultOpen={!isReservationPage}>
              <div className="flex h-screen w-full overflow-hidden">
                <AppSidebar />
                <main className="flex-1 overflow-auto">
                  {/* Add sidebar trigger for reservation pages */}
                  {isReservationPage && (
                    <div className="fixed top-20 left-4 z-50">
                      <SidebarTrigger className="bg-white shadow-lg border hover:bg-gray-50 rounded-md" />
                    </div>
                  )}
                  {children}
                </main>
              </div>
            </SidebarProvider>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
