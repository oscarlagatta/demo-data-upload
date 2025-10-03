"use client"

import { ErrorBoundaryWrapper } from "@/components/error-boundary"
import { ErrorBoundaryTest, ErrorOnMount } from "@/components/error-boundary-test"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function TestErrorBoundaryPage() {
  const [showErrorComponent, setShowErrorComponent] = useState(false)
  const [resetKey, setResetKey] = useState(0)

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Error Boundary Test Page</h1>
        <p className="text-muted-foreground">
          Use this page to test different error scenarios and see how the error boundary handles them
        </p>
      </div>

      {/* Test 1: Button-triggered error */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Test 1: Button-Triggered Error</h2>
        <ErrorBoundaryWrapper
          fallback={({ error, reset }) => (
            <div className="p-6 border border-red-500 rounded-lg bg-red-50">
              <h3 className="text-lg font-semibold text-red-900 mb-2">Error Caught!</h3>
              <p className="text-red-700 mb-4">{error.message}</p>
              <Button onClick={reset} variant="outline">
                Reset Error Boundary
              </Button>
            </div>
          )}
        >
          <ErrorBoundaryTest />
        </ErrorBoundaryWrapper>
      </section>

      {/* Test 2: Error on mount */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Test 2: Error on Component Mount</h2>
        <div className="flex gap-4 mb-4">
          <Button onClick={() => setShowErrorComponent(true)} disabled={showErrorComponent}>
            Show Component That Throws
          </Button>
          <Button
            onClick={() => {
              setShowErrorComponent(false)
              setResetKey((prev) => prev + 1)
            }}
            variant="outline"
          >
            Reset
          </Button>
        </div>

        <ErrorBoundaryWrapper
          key={resetKey}
          fallback={({ error, reset }) => (
            <div className="p-6 border border-orange-500 rounded-lg bg-orange-50">
              <h3 className="text-lg font-semibold text-orange-900 mb-2">Component Failed to Mount</h3>
              <p className="text-orange-700 mb-4">{error.message}</p>
              <Button
                onClick={() => {
                  setShowErrorComponent(false)
                  reset()
                }}
                variant="outline"
              >
                Reset and Hide Component
              </Button>
            </div>
          )}
        >
          {showErrorComponent ? (
            <ErrorOnMount />
          ) : (
            <div className="p-4 border rounded-lg">
              <p className="text-muted-foreground">Click "Show Component That Throws" to trigger an error</p>
            </div>
          )}
        </ErrorBoundaryWrapper>
      </section>

      {/* Test 3: Nested error boundaries */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Test 3: Nested Error Boundaries</h2>
        <ErrorBoundaryWrapper
          fallback={
            <div className="p-6 border border-purple-500 rounded-lg bg-purple-50">
              <p className="text-purple-900">Outer boundary caught the error</p>
            </div>
          }
        >
          <div className="p-4 border rounded-lg space-y-4">
            <p>Outer boundary content</p>
            <ErrorBoundaryWrapper
              fallback={
                <div className="p-4 border border-blue-500 rounded-lg bg-blue-50">
                  <p className="text-blue-900">Inner boundary caught the error</p>
                </div>
              }
            >
              <ErrorBoundaryTest />
            </ErrorBoundaryWrapper>
          </div>
        </ErrorBoundaryWrapper>
      </section>
    </div>
  )
}
