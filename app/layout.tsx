import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import "./globals.css"
import { Suspense } from "react"
import { AgGridProvider } from "@/components/providers/ag-grid-provider"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 3,
    },
  },
})

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <QueryClientProvider client={queryClient}>
          <AgGridProvider>
            <Suspense>{children}</Suspense>
          </AgGridProvider>
        </QueryClientProvider>
        <Analytics />
      </body>
    </html>
  )
}
