"use client"

import { useMemo, useState } from "react"
import {
  computeTrafficStatusColors,
  getTrafficStatusColorClass,
  type TrafficStatusColor,
} from "../../../../utils/traffic-status-utils"
import { computeTrendColors, getTrendColorClass, type TrendColor } from "../../../../utils/trend-color-utils"

interface NodeStateProps {
  subtext: string
  splunkData?: any[]
  isLoading?: boolean
  isError?: boolean
  isFetching?: boolean
  isSelected?: boolean
  isConnected?: boolean
  isDimmed?: boolean
  txActive: boolean
  txFetching: boolean
  matchedAitIds: Set<string>
}

interface NodeState {
  // Extracted data
  aitNum: string | null

  // Color mappings
  trendColor: TrendColor
  trafficStatusColor: TrafficStatusColor
  trendColorClass: string
  trafficStatusColorClass: string

  // Loading states
  isDataLoading: boolean
  isDetailsLoading: boolean
  setIsDetailsLoading: (loading: boolean) => void

  // UI modes
  inDefaultMode: boolean
  inLoadingMode: boolean
  inResultsMode: boolean
  isMatched: boolean

  // Card styling
  cardClassName: string

  // Incident sheet state
  isIncidentSheetOpen: boolean
  setIsIncidentSheetOpen: (open: boolean) => void
}

/**
 * Custom hook to manage all stateful logic and derived state for CustomNodeUsWires
 * Extracts business logic from the component for better testability and reusability
 */
export function useNodeState({
  subtext,
  splunkData,
  isLoading = false,
  isError = false,
  isFetching = false,
  isSelected = false,
  isConnected = false,
  isDimmed = false,
  txActive,
  txFetching,
  matchedAitIds,
}: NodeStateProps): NodeState {
  // Local state management
  const [isDetailsLoading, setIsDetailsLoading] = useState(false)
  const [isIncidentSheetOpen, setIsIncidentSheetOpen] = useState(false)

  /**
   * Extract AIT number from the node data subtext (format: "AIT {number}")
   * This AIT number is used to match traffic status and trend data
   */
  const aitNum = useMemo(() => {
    const match = subtext.match(/AIT (\d+)/)
    return match ? match[1] : null
  }, [subtext])

  /**
   * Compute trend color mapping from Splunk data
   * Updated to handle prop-based data with proper null checking
   */
  const trendColorMapping = useMemo(() => {
    if (!splunkData || splunkData.length === 0) return {}
    // Flatten splunk data from all nodes to create comprehensive trend mapping
    const flatSplunkData = splunkData.flatMap((node) => node.splunkDatas || [])
    return computeTrendColors(flatSplunkData)
  }, [splunkData])

  /**
   * Compute traffic status color mapping from Splunk data
   * Updated to handle prop-based data with proper null checking
   */
  const trafficStatusMapping = useMemo(() => {
    if (!splunkData || splunkData.length === 0) return {}
    // Flatten splunk data from all nodes to create comprehensive traffic status mapping
    const flatSplunkData = splunkData.flatMap((node) => node.splunkDatas || [])
    return computeTrafficStatusColors(flatSplunkData)
  }, [splunkData])

  /**
   * Get the trend color for this specific node based on its AIT number
   * Defaults to grey if no data is available or AIT number is not found
   */
  const trendColor: TrendColor = aitNum && trendColorMapping[aitNum] ? trendColorMapping[aitNum] : "grey"

  /**
   * Get the traffic status color for this specific node based on its AIT number
   * Defaults to grey if no data is available or AIT number is not found
   */
  const trafficStatusColor: TrafficStatusColor =
    aitNum && trafficStatusMapping[aitNum] ? trafficStatusMapping[aitNum] : "grey"

  // Convert colors to CSS classes for styling
  const trendColorClass = getTrendColorClass(trendColor)
  const trafficStatusColorClass = getTrafficStatusColorClass(trafficStatusColor)

  // Loading state now depends on props passed from parent component
  const isDataLoading = isLoading || !splunkData

  /**
   * Three-phase UI logic for action buttons:
   * 1) Default mode (no txActive): show Flow/Trend/Balanced buttons
   * 2) Loading mode (txActive && txFetching): show Summary/Details buttons in loading state
   * 3) Results mode (txActive && !txFetching): show Summary/Details buttons only for matched AITs
   */
  const inDefaultMode = !txActive
  const inLoadingMode = txActive && txFetching
  const inResultsMode = txActive && !txFetching
  const isMatched = !!aitNum && matchedAitIds.has(aitNum)

  /**
   * Determine card styling based on selection state and loading conditions
   * Updated to use prop-based loading states for consistent styling
   */
  const cardClassName = useMemo(() => {
    let baseClass = "border-2 border-[rgb(10, 49,97)] shadow-md cursor-pointer transition-all duration-200"

    // Apply different background colors based on data state
    if (isDataLoading || isFetching) {
      baseClass += " bg-gray-50" // Light gray during loading
    } else if (isError) {
      baseClass += " bg-red-50 border-red-200" // Light red for errors
    } else {
      baseClass += " bg-white" // White for normal state
    }

    // Apply selection and connection highlighting
    if (isSelected && !isDataLoading) {
      baseClass += " ring-2 ring-blue-700 shadow-lg scale-105"
    } else if (isConnected && !isDataLoading) {
      baseClass += " ring-2 ring-blue-300 shadow-lg"
    } else if (isDimmed) {
      baseClass += " opacity-40"
    }

    return baseClass
  }, [isDataLoading, isFetching, isError, isSelected, isConnected, isDimmed])

  return {
    aitNum,
    trendColor,
    trafficStatusColor,
    trendColorClass,
    trafficStatusColorClass,
    isDataLoading,
    isDetailsLoading,
    setIsDetailsLoading,
    inDefaultMode,
    inLoadingMode,
    inResultsMode,
    isMatched,
    cardClassName,
    isIncidentSheetOpen,
    setIsIncidentSheetOpen,
  }
}
