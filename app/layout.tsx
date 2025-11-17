import type React from "react"
import type { Metadata } from "next"
// Temporarily disabled due to network issues - will use system fonts
// import { Inter } from "next/font/google"
import ClientLayout from "./ClientLayout"
import './globals.css'

// const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Hotel Management System",
  description: "Manage hotel equipment and translations",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
