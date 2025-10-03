"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

/**
 * Test component to simulate errors for testing error boundaries
 * Use this in development to verify your error boundary UI works correctly
 */
export function ErrorBoundaryTest() {
  const [shouldThrow, setShouldThrow] = useState(false)

  if (shouldThrow) {
    throw new Error("This is a test error from ErrorBoundaryTest component")
  }

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg">
      <h3 className="font-semibold">Error Boundary Test</h3>
      <p className="text-sm text-muted-foreground">
        Click the button below to trigger an error and see the error boundary in action
      </p>
      <Button onClick={() => setShouldThrow(true)} variant="destructive">
        Trigger Error
      </Button>
    </div>
  )
}

/**
 * Component that throws an error immediately on mount
 */
export function ErrorOnMount() {
  throw new Error("This component throws an error on mount")
}

/**
 * Component that throws an error in useEffect
 */
export function ErrorInEffect() {
  useState(() => {
    throw new Error("This component throws an error in useState initializer")
  })

  return <div>This will never render</div>
}

/**
 * Component that simulates an async error
 */
export function AsyncErrorTest() {
  const [data, setData] = useState<string | null>(null)

  const triggerAsyncError = async () => {
    // Simulate API call that fails
    await new Promise((resolve) => setTimeout(resolve, 500))
    throw new Error("Async operation failed")
  }

  const handleClick = () => {
    triggerAsyncError().catch((error) => {
      // Re-throw to be caught by error boundary
      throw error
    })
  }

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg">
      <h3 className="font-semibold">Async Error Test</h3>
      <Button onClick={handleClick} variant="destructive">
        Trigger Async Error
      </Button>
    </div>
  )
}
