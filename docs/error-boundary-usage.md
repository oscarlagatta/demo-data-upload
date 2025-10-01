# Error Boundary Usage Guide

## Overview

The Error Boundary component provides a robust error handling mechanism for React applications. It catches JavaScript errors anywhere in the component tree, logs those errors, and displays a fallback UI instead of crashing the entire application.

## Features

- **Catches Runtime Errors**: Captures errors during rendering, in lifecycle methods, and in constructors
- **User-Friendly Fallback UI**: Displays a polished error screen with recovery options
- **Development Mode Details**: Shows detailed error information in development for debugging
- **Reset Functionality**: Allows users to recover from errors without page reload
- **Customizable**: Supports custom fallback UI and error handlers
- **TypeScript Support**: Full type safety with TypeScript

## Installation

The error boundary is already integrated into the application through the `Providers` component in `src/app/providers/providers.tsx`.

## Basic Usage

### App-Wide Protection (Already Configured)

The error boundary is automatically applied to your entire application:

\`\`\`tsx
// src/app/providers/providers.tsx
import { ErrorBoundaryWrapper } from "@/components/error-boundary-wrapper";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundaryWrapper>
      {/* Your app content */}
    </ErrorBoundaryWrapper>
  );
}
\`\`\`

### Protecting Specific Components

You can wrap specific sections of your app with additional error boundaries:

\`\`\`tsx
import ErrorBoundary from "@/components/error-boundary";

function MyPage() {
  return (
    <div>
      <Header />
      
      {/* Protect only the dashboard section */}
      <ErrorBoundary>
        <Dashboard />
      </ErrorBoundary>
      
      <Footer />
    </div>
  );
}
\`\`\`

### Custom Fallback UI

Provide your own fallback UI:

\`\`\`tsx
import ErrorBoundary from "@/components/error-boundary";

function MyComponent() {
  return (
    <ErrorBoundary
      fallback={
        <div className="p-4 text-center">
          <h2>Something went wrong in this section</h2>
          <button onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      }
    >
      <YourComponent />
    </ErrorBoundary>
  );
}
\`\`\`

### Custom Error Handler

Add custom error logging or reporting:

\`\`\`tsx
import ErrorBoundary from "@/components/error-boundary";

function MyComponent() {
  const handleError = (error: Error, errorInfo: ErrorInfo) => {
    // Send to error tracking service (e.g., Sentry, LogRocket)
    console.error("Error caught:", error);
    console.error("Component stack:", errorInfo.componentStack);
    
    // Example: Send to external service
    // errorTrackingService.logError(error, errorInfo);
  };

  return (
    <ErrorBoundary onError={handleError}>
      <YourComponent />
    </ErrorBoundary>
  );
}
\`\`\`

### Custom Reset Handler

Add custom logic when error is reset:

\`\`\`tsx
import ErrorBoundary from "@/components/error-boundary";

function MyComponent() {
  const handleReset = () => {
    // Clear any corrupted state
    localStorage.removeItem('cached-data');
    
    // Reset application state
    // store.dispatch(resetAction());
    
    console.log("Error boundary reset");
  };

  return (
    <ErrorBoundary onReset={handleReset}>
      <YourComponent />
    </ErrorBoundary>
  );
}
\`\`\`

## API Reference

### ErrorBoundary Props

| Prop | Type | Description |
|------|------|-------------|
| `children` | `ReactNode` | The components to be protected by the error boundary |
| `fallback` | `ReactNode` | Optional custom fallback UI to display when an error occurs |
| `onError` | `(error: Error, errorInfo: ErrorInfo) => void` | Optional callback invoked when an error is caught |
| `onReset` | `() => void` | Optional callback invoked when the error state is reset |

## What Errors Are Caught?

The error boundary catches:
- ✅ Errors during rendering
- ✅ Errors in lifecycle methods
- ✅ Errors in constructors of child components
- ✅ Errors thrown in event handlers (if they propagate to render)

The error boundary does NOT catch:
- ❌ Errors in event handlers (use try-catch)
- ❌ Errors in async code (use try-catch or .catch())
- ❌ Errors in server-side rendering
- ❌ Errors thrown in the error boundary itself

## Testing

A test component is provided to verify error boundary functionality:

\`\`\`tsx
import { ErrorBoundaryTest } from "@/components/error-boundary-test";

function TestPage() {
  return (
    <div className="container mx-auto py-8">
      <ErrorBoundaryTest />
    </div>
  );
}
\`\`\`

## Best Practices

1. **Granular Boundaries**: Use multiple error boundaries for different sections of your app
2. **Meaningful Fallbacks**: Provide context-specific fallback UIs
3. **Error Logging**: Always log errors to a monitoring service in production
4. **User Communication**: Clearly communicate what went wrong and how to recover
5. **State Management**: Consider resetting relevant state when errors occur
6. **Testing**: Regularly test error scenarios in development

## Production Considerations

- Error details are only shown in development mode
- In production, users see a clean, user-friendly error message
- Consider integrating with error tracking services (Sentry, LogRocket, etc.)
- Monitor error rates and patterns to identify systemic issues

## Example: Protecting a Form

\`\`\`tsx
import ErrorBoundary from "@/components/error-boundary";

function ContactPage() {
  return (
    <div>
      <h1>Contact Us</h1>
      
      <ErrorBoundary
        onError={(error) => {
          // Log form errors specifically
          console.error("Form error:", error);
        }}
        onReset={() => {
          // Clear form data on reset
          sessionStorage.removeItem('form-draft');
        }}
      >
        <ContactForm />
      </ErrorBoundary>
    </div>
  );
}
\`\`\`

## Troubleshooting

**Error boundary not catching errors:**
- Ensure the error is thrown during render, not in an async callback
- Check that the error boundary is a parent of the failing component
- Verify you're using a class component or the error boundary wrapper

**Fallback UI not displaying:**
- Check browser console for errors in the error boundary itself
- Verify the error boundary is properly imported and used
- Ensure the component is wrapped correctly

**Reset not working:**
- Verify the reset handler is properly clearing state
- Check if the error persists due to props or external state
- Consider using a key prop to force remount
