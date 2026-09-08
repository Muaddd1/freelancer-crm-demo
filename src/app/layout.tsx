import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { TooltipProvider } from "@/components/ui/tooltip"
import { DataProvider } from "@/lib/data-context"
import { ToastProvider } from "@/lib/toast-context"
import { ThemeScript } from "@/components/theme-script"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Freelancer CRM",
  description: "Premium Client Relationship Management for Freelancers",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <TooltipProvider delayDuration={300}>
          <DataProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </DataProvider>
        </TooltipProvider>
      </body>
    </html>
  )
}
