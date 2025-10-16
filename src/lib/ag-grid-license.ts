"use client"

import { LicenseManager } from "@ag-grid-enterprise/core"

let isLicenseInitialized = false

/**
 * Initialize ag-Grid Enterprise license key
 * This should be called once at application startup
 */
export function initializeAgGridLicense() {
  // Prevent multiple initializations
  if (isLicenseInitialized) {
    console.log("[ag-Grid] License already initialized")
    return
  }

  // Get license key from environment variable
  const licenseKey = process.env.NEXT_PUBLIC_AG_GRID_LICENSE_KEY

  if (!licenseKey) {
    console.warn("[ag-Grid] No license key found. Set NEXT_PUBLIC_AG_GRID_LICENSE_KEY environment variable.")
    return
  }

  try {
    LicenseManager.setLicenseKey(licenseKey)
    isLicenseInitialized = true
    console.log("[ag-Grid] License initialized successfully")
  } catch (error) {
    console.error("[ag-Grid] Failed to initialize license:", error)
  }
}

/**
 * Check if ag-Grid license has been initialized
 */
export function isAgGridLicenseInitialized(): boolean {
  return isLicenseInitialized
}
