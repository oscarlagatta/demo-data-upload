"use client"

import type { ReactNode } from "react"
import ErrorBoundary from "./error-boundary"

interface ErrorBoundaryWrapperProps {
  children: ReactNode
}

/**
 * A convenient wrapper component that can be used to wrap sections of your app
 * with error boundary protection. This is a client component that can be easily
 * imported and used throughout your application.
 */
export function ErrorBoundaryWrapper({ children }: ErrorBoundaryWrapperProps) {
  const handleError = (error: Error) => {
    // You can add custom error logging here
    // For example, send to an error tracking service like Sentry
    console.error("[v0] Application error:", error)
  }

  const handleReset = () => {
    // You can add custom reset logic here
    // For example, clear certain state or cache
    console.log("[v0] Error boundary reset")
  }

  return (
    <ErrorBoundary onError={handleError} onReset={handleReset}>
      {children}
    </ErrorBoundary>
  )
}
