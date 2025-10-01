"use client"

import type React from "react"
import { memo, useMemo, useState } from "react"
import { Handle, Position, type NodeProps, type Node } from "@xyflow/react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTransactionSearchUsWiresContext } from "@/domains/payment-health/providers/us-wires/us-wires-transaction-search-provider"
import {
  computeTrafficStatusColors,
  getTrafficStatusColorClass,
  type TrafficStatusColor,
} from "../../../../utils/traffic-status-utils"
import { computeTrendColors, getTrendColorClass, type TrendColor } from "../../../../utils/trend-color-utils"
import { LoadingButton } from "../../../loading/loading-button"
import { CardLoadingSkeleton } from "../../../loading/loading-skeleton"

import { MoreVertical } from "lucide-react"

import { IncidentSheet } from "../../../sheets/incident-sheet"
import { Button } from "@/components/ui/button"

type ActionType = "flow" | "trend" | "balanced"

type CustomNodeData = {
  title: string
  subtext: string
  isSelected?: boolean
  isConnected?: boolean
  isDimmed?: boolean
  onClick?: (nodeId: string) => void
  onActionClick?: (aitNum: string, action: ActionType) => void
  currentThruputTime30?: number
  averageThruputTime30?: number
}

type CustomNodeType = Node<CustomNodeData>

/**
 * Enhanced props interface for CustomNodeUsWires component
 * Now accepts Splunk data and loading states as props from parent component
 */
interface CustomNodeUsWiresProps extends NodeProps<CustomNodeType> {
  /** Callback to hide search interface */
  onHideSearch: () => void
  /** Flag to show/hide certain UI elements */
  isShowHiden?: boolean
  /** Splunk data passed from parent component containing traffic and trend information */
  splunkData?: any[]
  /** Loading state for Splunk data, managed by parent component */
  isLoading?: boolean
  /** Error state for Splunk data, managed by parent component */
  isError?: boolean
  /** Fetching state for real-time updates, managed by parent component */
  isFetching?: boolean
}

const CustomNodeUsWires = ({
  data,
  id,
  onHideSearch,
  isShowHiden,
  splunkData,
  isLoading = false,
  isError = false,
  isFetching = false,
}: CustomNodeUsWiresProps) => {
  // Authorization check (currently hardcoded to true)
  const isAuthorized = true

  // Loading state now depends on props passed from parent component
  const isDataLoading = isLoading || !splunkData

  // Transaction search context for handling search-related functionality
  const { active: txActive, isFetching: txFetching, matchedAitIds, showTable } = useTransactionSearchUsWiresContext()

  /**
   * Extract AIT number from the node data subtext (format: "AIT {number}")
   * This AIT number is used to match traffic status and trend data
   */
  const aitNum = useMemo(() => {
    const match = data.subtext.match(/AIT (\d+)/)
    return match ? match[1] : null
  }, [data.subtext])

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

  const averageThroughputTime = data.averageThruputTime30

  /**
   * Handle node click interactions
   * Prevents interaction during loading states to avoid inconsistent behavior
   */
  const handleClick = () => {
    if (data.onClick && id && !isDataLoading) {
      data.onClick(id)
    }
  }

  /**
   * Trigger action buttons (Flow, Trend, Balanced)
   * Updated loading check to use prop-based loading states
   */
  const triggerAction = (action: ActionType) => {
    if (!isDataLoading && !isFetching && aitNum && data.onActionClick) {
      data.onActionClick(aitNum, action)
    }
    onHideSearch() // Hide search when an action is triggered
  }

  // Local state for incident sheet and details loading
  const [isDetailsLoading, setIsDetailsLoading] = useState(false)
  const [isIncidentSheetOpen, setIsIncidentSheetOpen] = useState(false)

  /**
   * Handle details button click
   * Shows transaction details table for the specific AIT
   */
  const handleDetailsClick = async (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent node selection

    if (aitNum && !isDetailsLoading) {
      setIsDetailsLoading(true)
      try {
        await showTable(aitNum)
      } finally {
        setTimeout(() => {
          setIsDetailsLoading(false)
        }, 500)
      }
    }
  }

  /**
   * Handle incident creation
   * Opens the incident sheet for creating support tickets
   */
  const handleCreateIncident = () => {
    setIsIncidentSheetOpen(true)
  }

  /**
   * Determine card styling based on selection state and loading conditions
   * Updated to use prop-based loading states for consistent styling
   */
  const getCardClassName = () => {
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
    if (data.isSelected && !isDataLoading) {
      baseClass += " ring-2 ring-blue-700 shadow-lg scale-105"
    } else if (data.isConnected && !isDataLoading) {
      baseClass += " ring-2 ring-blue-300 shadow-lg"
    } else if (data.isDimmed) {
      baseClass += " opacity-40"
    }

    return baseClass
  }

  // Show loading skeleton during initial load of Splunk data
  if (isDataLoading) {
    return <CardLoadingSkeleton className="w-full" />
  }

  // Show error message when data loading fails
  if (isError) {
    return <div className="text-red-500">Failed to load data. Please try again later.</div>
  }

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

  return (
    <>
      <Card
        className={`${getCardClassName()} h-[100px]`} // Fixed height for consistent layout
        onClick={handleClick}
        data-testid={`custom-node-${id}`}
      >
        {/* ReactFlow connection handles for different directions */}
        <Handle type="target" position={Position.Left} className="h-2 w-2 !bg-gray-400" />
        <Handle type="source" position={Position.Right} className="h-2 w-2 !bg-gray-400" />
        <Handle type="source" position={Position.Top} className="h-2 w-2 !bg-gray-400" />
        <Handle type="source" position={Position.Bottom} className="h-2 w-2 !bg-gray-400" />

        {/* Dropdown menu for additional actions */}
        <div className="absolute top-1 right-1 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 rounded-full p-0 hover:bg-gray-200/80"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-3 w-3 text-gray-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleCreateIncident}>Create Incident Ticket</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Card header with title and subtext */}
        <CardHeader className="p-2">
          <CardTitle className="text-center text-xs font-bold whitespace-nowrap">{data.title}</CardTitle>
          <p className="text-muted-foreground text-center text-[10px]">{data.subtext}</p>
          {averageThroughputTime !== undefined && averageThroughputTime > 0 && (
            <p className="text-center text-[9px] text-blue-600 font-medium mt-0.5">
              Avg: {averageThroughputTime.toFixed(2)}ms
            </p>
          )}
        </CardHeader>

        {/* Card content with action buttons */}
        <CardContent className="p-2 pt-0">
          <div className="flex space-x-1 transition-all duration-200">
            {!isAuthorized ? (
              // Non-authorized user view: simplified Summary/Details buttons
              <>
                <LoadingButton
                  isLoading={inLoadingMode}
                  loadingText="..."
                  variant="outline"
                  className={`h-6 min-w-0 flex-1 px-2 text-[10px] shadow-sm ${
                    inResultsMode && isMatched
                      ? "border-blue-600 bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
                      : inResultsMode && !isMatched
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
                    inResultsMode && isMatched
                      ? "border-blue-600 bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
                      : inResultsMode && !isMatched
                        ? "cursor-not-allowed border-gray-300 text-gray-500"
                        : "border-blue-600 bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
                  }`}
                  onClick={inResultsMode && isMatched ? handleDetailsClick : undefined}
                  disabled={!isMatched || isDetailsLoading}
                >
                  Details
                </LoadingButton>
              </>
            ) : (
              // Authorized user view: full functionality with different button modes
              <>
                {inDefaultMode && (
                  // Default mode: Flow, Trend, Balanced buttons with traffic status colors
                  <>
                    <LoadingButton
                      isLoading={isFetching}
                      loadingText="..."
                      variant="outline"
                      className={`h-6 min-w-0 flex-1 px-2 text-[10px] text-white shadow-sm ${
                        isError ? "bg-gray-400" : trafficStatusColorClass
                      }`}
                      onClick={(e) => {
                        e.stopPropagation()
                        triggerAction("flow")
                      }}
                      disabled={trafficStatusColorClass === "bg-gray-400"}
                    >
                      Flow
                    </LoadingButton>
                    <LoadingButton
                      isLoading={isFetching}
                      loadingText="..."
                      variant="outline"
                      className={`h-6 min-w-0 flex-1 px-2 text-[10px] text-white shadow-sm ${isError ? "bg-gray-400" : trendColorClass}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        triggerAction("trend")
                      }}
                      disabled={trendColorClass === "bg-gray-400"}
                    >
                      Trend
                    </LoadingButton>
                    <LoadingButton
                      isLoading={isFetching}
                      loadingText="..."
                      variant="outline"
                      className="h-6 min-w-0 flex-1 px-2 text-[10px] shadow-sm"
                      disabled={trendColorClass === "bg-gray-400"}
                    >
                      Balanced
                    </LoadingButton>
                  </>
                )}

                {inLoadingMode && (
                  // Loading mode: Summary/Details buttons in loading state
                  <>
                    <LoadingButton
                      isLoading={true}
                      loadingText="..."
                      variant="outline"
                      aria-label="Trigger Summary Action"
                      className="flex h-6 flex-1 items-center justify-center border-blue-600 bg-blue-600 px-2 text-[10px] text-white shadow-sm hover:bg-blue-700 hover:text-white"
                    >
                      Summary
                    </LoadingButton>
                    <LoadingButton
                      isLoading={true}
                      loadingText="..."
                      variant="outline"
                      aria-label="Trigger Details Action"
                      className="flex h-6 flex-1 items-center justify-center border-blue-600 bg-blue-600 px-2 text-[10px] text-white shadow-sm hover:bg-blue-700 hover:text-white"
                    >
                      Details
                    </LoadingButton>
                  </>
                )}

                {inResultsMode && (
                  // Results mode: Summary/Details buttons enabled only for matched AITs
                  <>
                    <LoadingButton
                      isLoading={false}
                      loadingText="..."
                      variant="outline"
                      aria-label="Trigger Summary Action"
                      className={`h-6 min-w-0 flex-1 px-2 text-[10px] shadow-sm ${
                        isMatched
                          ? "border-blue-600 bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
                          : "cursor-not-allowed border-gray-300 bg-gray-300 text-gray-500"
                      }`}
                      disabled={!isMatched}
                    >
                      Summary
                    </LoadingButton>
                    <LoadingButton
                      isLoading={false}
                      loadingText="..."
                      variant="outline"
                      aria-label="Trigger Details Action"
                      className={`h-6 min-w-0 flex-1 px-2 text-[10px] shadow-sm ${
                        isMatched
                          ? "border-blue-600 bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
                          : "cursor-not-allowed border-gray-300 bg-gray-300 text-gray-500"
                      }`}
                      onClick={isMatched ? handleDetailsClick : undefined}
                      disabled={!isMatched || isDetailsLoading}
                    >
                      Details
                    </LoadingButton>
                  </>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Incident creation sheet */}
      <IncidentSheet
        isOpen={isIncidentSheetOpen}
        onClose={() => setIsIncidentSheetOpen(false)}
        nodeTitle={data.title}
        aitId={data.subtext}
      />
    </>
  )
}

export default memo(CustomNodeUsWires)
