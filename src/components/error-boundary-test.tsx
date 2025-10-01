"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

/**
 * Test component to demonstrate error boundary functionality.
 * This component intentionally throws errors to test the error boundary.
 *
 * Usage: Import and render this component in any page to test error handling.
 */
export function ErrorBoundaryTest() {
  const [shouldThrowError, setShouldThrowError] = useState(false)
  const [count, setCount] = useState(0)

  // Simulate a rendering error
  if (shouldThrowError) {
    throw new Error("This is a test error thrown during rendering!")
  }

  // Simulate an async error
  const handleAsyncError = async () => {
    try {
      await new Promise((_, reject) => setTimeout(() => reject(new Error("Async operation failed!")), 100))
    } catch (error) {
      // This will be caught by the error boundary
      throw error
    }
  }

  // Simulate a lifecycle error
  const handleLifecycleError = () => {
    setShouldThrowError(true)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Error Boundary Test Component</CardTitle>
        <CardDescription>
          Use these buttons to test different error scenarios and verify the error boundary works correctly.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-3">
          <Button onClick={handleLifecycleError} variant="destructive" className="w-full">
            Trigger Rendering Error
          </Button>

          <Button onClick={handleAsyncError} variant="destructive" className="w-full">
            Trigger Async Error
          </Button>

          <Button
            onClick={() => {
              // Simulate undefined access error
              const obj: any = null
              console.log(obj.property)
            }}
            variant="destructive"
            className="w-full"
          >
            Trigger Undefined Access Error
          </Button>

          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-2">
              Normal functionality (should work after error recovery):
            </p>
            <div className="flex items-center gap-3">
              <Button onClick={() => setCount(count - 1)} variant="outline">
                Decrement
              </Button>
              <span className="text-lg font-semibold min-w-[3rem] text-center">{count}</span>
              <Button onClick={() => setCount(count + 1)} variant="outline">
                Increment
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h3 className="text-sm font-semibold mb-2">Testing Instructions:</h3>
          <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
            <li>Click any error button to trigger an error</li>
            <li>Observe the error boundary fallback UI</li>
            <li>Click "Try Again" to reset the error state</li>
            <li>Verify the counter still works after recovery</li>
            <li>Check browser console for error logs (development mode)</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}
