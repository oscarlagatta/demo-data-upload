"use client"

import type React from "react"

import { useEffect } from "react"
import { initializeAgGridLicense } from "@/lib/ag-grid-license"

/**
 * AgGridProvider - Initializes ag-Grid Enterprise license once at app startup
 * This component should be included in the root layout to ensure the license
 * is set before any ag-Grid components are rendered
 */
export function AgGridProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize ag-Grid license on client-side mount
    initializeAgGridLicense()
  }, []) // Empty dependency array ensures this runs only once

  return <>{children}</>
}
