"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  onReset?: () => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    }
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("[v0] Error caught by ErrorBoundary:", error)
    console.error("[v0] Error info:", errorInfo)

    this.setState({
      errorInfo,
    })

    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })

    if (this.props.onReset) {
      this.props.onReset()
    }
  }

  handleGoHome = (): void => {
    this.handleReset()
    window.location.href = "/"
  }

  override render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-2xl w-full">
            <div className="bg-card border border-border rounded-lg shadow-lg p-8">
              <div className="flex justify-center mb-6">
                <div className="rounded-full bg-destructive/10 p-4">
                  <AlertTriangle className="h-12 w-12 text-destructive" />
                </div>
              </div>

              <h1 className="text-3xl font-bold text-center text-foreground mb-4">Oops! Something went wrong</h1>

              <p className="text-center text-muted-foreground mb-8">
                We encountered an unexpected error. Don't worry, your data is safe. You can try refreshing the page or
                return to the home page.
              </p>

              {process.env.NODE_ENV === "development" && this.state.error && (
                <div className="mb-8 bg-muted rounded-lg p-4 border border-border">
                  <h2 className="text-sm font-semibold text-foreground mb-2">Error Details (Development Only):</h2>
                  <div className="text-xs font-mono text-muted-foreground overflow-auto max-h-48">
                    <p className="text-destructive font-semibold mb-2">
                      {this.state.error.name}: {this.state.error.message}
                    </p>
                    {this.state.error.stack && (
                      <pre className="whitespace-pre-wrap break-words">{this.state.error.stack}</pre>
                    )}
                    {this.state.errorInfo && (
                      <div className="mt-4">
                        <p className="font-semibold mb-1">Component Stack:</p>
                        <pre className="whitespace-pre-wrap break-words">{this.state.errorInfo.componentStack}</pre>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={this.handleReset}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </button>
                <button
                  onClick={this.handleGoHome}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <Home className="h-4 w-4" />
                  Go to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

interface ErrorBoundaryWrapperProps {
  children: ReactNode
}

function ErrorBoundaryWrapper({ children }: ErrorBoundaryWrapperProps) {
  const handleError = (error: Error) => {
    console.error("[v0] Application error:", error)
  }

  const handleReset = () => {
    console.log("[v0] Error boundary reset")
  }

  return (
    <ErrorBoundary onError={handleError} onReset={handleReset}>
      {children}
    </ErrorBoundary>
  )
}

export default ErrorBoundary
export { ErrorBoundary, ErrorBoundaryWrapper }
