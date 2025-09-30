"use client"
import { createContext, useContext, type ReactNode } from "react"

// Minimal context interface with only the required properties
interface MinimalTransactionSearchContext {
  showAmountSearchResults: boolean
  amountSearchParams: any
  showTableView: boolean
}

// Create context with default values
const MinimalTransactionSearchContext = createContext<MinimalTransactionSearchContext>({
  showAmountSearchResults: false,
  amountSearchParams: null,
  showTableView: false,
})

// Simple provider component with minimal functionality
export function MinimalTransactionUsWiresSearchProvider({ children }: { children: ReactNode }) {
  const contextValue: MinimalTransactionSearchContext = {
    showAmountSearchResults: false,
    amountSearchParams: null,
    showTableView: false,
  }

  return (
    <MinimalTransactionSearchContext.Provider value={contextValue}>{children}</MinimalTransactionSearchContext.Provider>
  )
}

// Hook to use the minimal context
export function useMinimalTransactionSearchUsWiresContext() {
  const context = useContext(MinimalTransactionSearchContext)
  if (!context) {
    throw new Error(
      "useMinimalTransactionSearchUsWiresContext must be used within MinimalTransactionUsWiresSearchProvider",
    )
  }
  return context
}
