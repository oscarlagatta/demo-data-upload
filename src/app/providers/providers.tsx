"use client"

import type React from "react"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { useState } from "react"
import { ErrorBoundaryWrapper } from "@/components/error-boundary"

export default function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient())
  return (
    <ErrorBoundaryWrapper>
      <QueryClientProvider client={client}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundaryWrapper>
  )
}
