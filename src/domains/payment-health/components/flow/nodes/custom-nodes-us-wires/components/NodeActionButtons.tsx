"use client"

import type React from "react"
import { LoadingButton } from "../../../../loading/loading-button"

type UIMode = "default" | "loading" | "results"

interface ButtonConfig {
  type: string
  label: string
  className?: string
  onClick?: (e: React.MouseEvent) => void
  disabled?: boolean
}

interface NodeActionButtonsProps {
  mode: UIMode
  isAuthorized: boolean
  isMatched: boolean
  isFetching: boolean
  isDetailsLoading: boolean
  buttons: ButtonConfig[]
  onDetailsClick?: (e: React.MouseEvent) => void
}

/**
 * Handles all button state variations for custom nodes
 * Manages three UI modes: default, loading, and results
 * Reduces complexity by centralizing button rendering logic
 */
export function NodeActionButtons({
  mode,
  isAuthorized,
  isMatched,
  isFetching,
  isDetailsLoading,
  buttons,
  onDetailsClick,
}: NodeActionButtonsProps) {
  // Unauthorized users see a simplified button set
  if (!isAuthorized) {
    return (
      <div className="flex space-x-1 transition-all duration-200">
        <LoadingButton
          isLoading={mode === "loading"}
          loadingText="..."
          variant="outline"
          className={`h-6 min-w-0 flex-1 px-2 text-[10px] shadow-sm ${
            mode === "results" && isMatched
              ? "border-blue-600 bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
              : mode === "results" && !isMatched
                ? "cursor-not-allowed border-gray-300 text-gray-500"
                : "border-blue-600 bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
          }`}
          disabled={!isMatched}
        >
          Summary
        </LoadingButton>
        <LoadingButton
          isLoading={true}
          loadingText="..."
          variant="outline"
          className={`h-6 min-w-0 flex-1 px-2 text-[10px] shadow-sm ${
            mode === "results" && isMatched
              ? "border-blue-600 bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
              : mode === "results" && !isMatched
                ? "cursor-not-allowed border-gray-300 text-gray-500"
                : "border-blue-600 bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
          }`}
          onClick={mode === "results" && isMatched ? onDetailsClick : undefined}
          disabled={!isMatched || isDetailsLoading}
        >
          Details
        </LoadingButton>
      </div>
    )
  }

  // Default mode: Show Flow/Trend/Balanced buttons
  if (mode === "default") {
    return (
      <div className="flex space-x-1 transition-all duration-200">
        {buttons.map((button) => (
          <LoadingButton
            key={button.type}
            isLoading={button.type === "Flow" ? isFetching : false}
            loadingText="..."
            variant="outline"
            className={`h-6 min-w-0 flex-1 px-2 text-[10px] shadow-sm ${
              button.disabled
                ? "cursor-not-allowed border-gray-300 text-gray-500"
                : "border-blue-600 bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
            }`}
            onClick={button.onClick}
            disabled={button.disabled}
          >
            {button.label}
          </LoadingButton>
        ))}
      </div>
    )
  }

  // Loading mode: Show loading state for all buttons
  if (mode === "loading") {
    return (
      <div className="flex space-x-1 transition-all duration-200">
        {buttons.map((button) => (
          <LoadingButton
            key={button.type}
            isLoading={true}
            loadingText="..."
            variant="outline"
            className="h-6 min-w-0 flex-1 px-2 text-[10px] shadow-sm border-gray-300 text-gray-500"
            disabled={true}
          >
            {button.label}
          </LoadingButton>
        ))}
      </div>
    )
  }

  // Results mode: Show buttons based on match status
  if (mode === "results") {
    return (
      <div className="flex space-x-1 transition-all duration-200">
        {buttons.map((button) => (
          <LoadingButton
            key={button.type}
            isLoading={false}
            variant="outline"
            className={`h-6 min-w-0 flex-1 px-2 text-[10px] shadow-sm ${
              button.disabled
                ? "cursor-not-allowed border-gray-300 text-gray-500"
                : "border-blue-600 bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
            }`}
            onClick={button.onClick}
            disabled={button.disabled}
          >
            {button.label}
          </LoadingButton>
        ))}
      </div>
    )
  }

  return null
}
