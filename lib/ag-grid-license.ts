"use client"

import { LicenseManager } from "@ag-grid-enterprise/core"

let isLicenseInitialized = false

/**
 * Initialize ag-Grid Enterprise license key
 * This should be called once at application startup
 *
 * SECURITY NOTE: The ag-Grid license key is intentionally exposed to the client.
 * This is the correct and expected behavior according to ag-Grid documentation:
 * - The license key is NOT a secret (it's domain-locked, not an API key)
 * - It must be set on the client side using LicenseManager.setLicenseKey()
 * - It's validated against your registered domains by ag-Grid
 * - NEXT_PUBLIC_ prefix is required for client-side access in Next.js
 *
 * See: https://www.ag-grid.com/javascript-data-grid/licensing/
 */
export function initializeAgGridLicense() {
  // Prevent multiple initializations
  if (isLicenseInitialized) {
    console.log("[ag-Grid] License already initialized")
    return
  }

  // Get license key from environment variable
  // Note: NEXT_PUBLIC_ prefix is required for client-side access
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
