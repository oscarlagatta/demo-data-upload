"use client"

import type React from "react"
import { memo, useMemo, useState } from "react"
import { Handle, Position, type NodeProps, type Node } from "@xyflow/react"
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

import { MoreVertical, TrendingUp, TrendingDown, Minus, Activity } from "lucide-react"

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
  flowClass?: string
  trendClass?: string
  balancedClass?: string
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

  // This provides better performance and consistency
  const flowButtonClass = data.flowClass || trafficStatusColorClass
  const trendButtonClass = data.trendClass || trendColorClass
  const balancedButtonClass = data.balancedClass || "bg-gray-400"

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
    let baseClass =
      "relative bg-[var(--color-node-bg)] border border-[var(--color-node-border)] rounded-lg shadow-lg transition-all duration-200 hover:border-[var(--color-node-border-hover)] hover:bg-[var(--color-card-hover)]"

    if (isDataLoading || isFetching) {
      baseClass += " opacity-60"
    } else if (isError) {
      baseClass += " border-[var(--color-status-error)]/50"
    }

    if (data.isSelected && !isDataLoading) {
      baseClass += " ring-2 ring-[var(--color-node-selected)] border-[var(--color-node-selected)] shadow-xl scale-105"
    } else if (data.isConnected && !isDataLoading) {
      baseClass += " ring-1 ring-[var(--color-accent-blue)]/50"
    } else if (data.isDimmed) {
      baseClass += " opacity-30"
    }

    return baseClass
  }

  // Show loading skeleton during initial load of Splunk data
  if (isDataLoading) {
    return <CardLoadingSkeleton className="w-full" />
  }

  // Show error message when data loading fails
  if (isError) {
    return <div className="text-[var(--color-status-error)] text-xs">Failed to load data</div>
  }

  /**
   * Determine trend icon based on trend color
   */
  const getTrendIcon = () => {
    if (trendColor === "green") return <TrendingUp className="h-3 w-3" />
    if (trendColor === "red") return <TrendingDown className="h-3 w-3" />
    return <Minus className="h-3 w-3" />
  }

  const getStatusColor = () => {
    if (trafficStatusColor === "green") return "bg-[var(--color-status-success)]"
    if (trafficStatusColor === "red") return "bg-[var(--color-status-error)]"
    if (trafficStatusColor === "yellow") return "bg-[var(--color-status-warning)]"
    return "bg-[var(--color-status-neutral)]"
  }

  // Three-phase UI logic for action buttons:
  // 1) Default mode (no txActive): show Flow/Trend/Balanced buttons
  // 2) Loading mode (txActive && txFetching): show Summary/Details buttons in loading state
  // 3) Results mode (txActive && !txFetching): show Summary/Details buttons only for matched AITs
  const inDefaultMode = !txActive
  const inLoadingMode = txActive && txFetching
  const inResultsMode = txActive && !txFetching
  const isMatched = !!aitNum && matchedAitIds.has(aitNum)

  return (
    <>
      <div
        className={`${getCardClassName()} min-w-[240px] max-w-[280px]`}
        onClick={handleClick}
        data-testid={`custom-node-${id}`}
      >
        {/* ReactFlow connection handles */}
        <Handle type="target" position={Position.Left} className="h-2 w-2 !bg-[var(--color-accent-blue)]" />
        <Handle type="source" position={Position.Right} className="h-2 w-2 !bg-[var(--color-accent-blue)]" />
        <Handle type="source" position={Position.Top} className="h-2 w-2 !bg-[var(--color-accent-blue)]" />
        <Handle type="source" position={Position.Bottom} className="h-2 w-2 !bg-[var(--color-accent-blue)]" />

        <div className="flex items-start justify-between gap-2 p-3 pb-2">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            {/* Status indicator dot */}
            <div className={`${getStatusColor()} h-2 w-2 rounded-full mt-1.5 flex-shrink-0`} />

            <div className="flex-1 min-w-0">
              <h3 className="text-[var(--color-metric-value)] text-sm font-semibold leading-tight truncate">
                {data.title}
              </h3>
              <p className="text-[var(--color-metric-label)] text-xs mt-0.5">{data.subtext}</p>
            </div>
          </div>

          {/* Dropdown menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 rounded p-0 hover:bg-[var(--color-node-border-hover)] text-[var(--color-metric-label)] hover:text-[var(--color-metric-value)]"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 bg-[var(--color-node-bg)] border-[var(--color-node-border)]"
            >
              <DropdownMenuItem
                onClick={handleCreateIncident}
                className="text-[var(--color-metric-value)] hover:bg-[var(--color-card-hover)]"
              >
                Create Incident Ticket
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="px-3 pb-3 space-y-2">
          {/* Throughput metric card */}
          <div className="bg-[var(--color-card-hover)] rounded-md p-2.5 border border-[var(--color-node-border)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-[var(--color-accent-blue)]" />
                <span className="text-[var(--color-metric-label)] text-[10px] font-medium uppercase tracking-wide">
                  Avg Throughput
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span
                  className={`text-${trendColor === "green" ? "[var(--color-status-success)]" : trendColor === "red" ? "[var(--color-status-error)]" : "[var(--color-metric-label)]"}`}
                >
                  {getTrendIcon()}
                </span>
              </div>
            </div>
            {averageThroughputTime !== undefined && averageThroughputTime > 0 ? (
              <div className="mt-1">
                <span className="text-[var(--color-metric-value)] text-lg font-bold">
                  {averageThroughputTime.toFixed(2)}
                </span>
                <span className="text-[var(--color-metric-label)] text-xs ml-1">ms</span>
              </div>
            ) : (
              <div className="mt-1">
                <span className="text-[var(--color-metric-label)] text-xs">No data available</span>
              </div>
            )}
          </div>

          <div className="flex gap-1.5">
            {!isAuthorized ? (
              <>
                <LoadingButton
                  isLoading={inLoadingMode}
                  loadingText="..."
                  variant="outline"
                  className={`h-8 flex-1 text-xs font-medium transition-all ${
                    inResultsMode && isMatched
                      ? "bg-[var(--color-accent-blue)] text-white border-[var(--color-accent-blue)] hover:bg-[var(--color-accent-blue-hover)]"
                      : inResultsMode && !isMatched
                        ? "cursor-not-allowed border-[var(--color-node-border)] text-[var(--color-metric-label)] bg-transparent"
                        : "bg-[var(--color-accent-blue)] text-white border-[var(--color-accent-blue)] hover:bg-[var(--color-accent-blue-hover)]"
                  }`}
                  disabled={!isMatched}
                >
                  Summary
                </LoadingButton>
                <LoadingButton
                  isLoading={isDetailsLoading}
                  loadingText="..."
                  variant="outline"
                  className={`h-8 flex-1 text-xs font-medium transition-all ${
                    inResultsMode && isMatched
                      ? "bg-[var(--color-accent-blue)] text-white border-[var(--color-accent-blue)] hover:bg-[var(--color-accent-blue-hover)]"
                      : inResultsMode && !isMatched
                        ? "cursor-not-allowed border-[var(--color-node-border)] text-[var(--color-metric-label)] bg-transparent"
                        : "bg-[var(--color-accent-blue)] text-white border-[var(--color-accent-blue)] hover:bg-[var(--color-accent-blue-hover)]"
                  }`}
                  onClick={inResultsMode && isMatched ? handleDetailsClick : undefined}
                  disabled={!isMatched || isDetailsLoading}
                >
                  Details
                </LoadingButton>
              </>
            ) : (
              <>
                {inDefaultMode && (
                  <>
                    <LoadingButton
                      isLoading={isFetching}
                      loadingText="..."
                      variant="outline"
                      className={`h-8 flex-1 text-xs font-medium transition-all ${
                        isError
                          ? "bg-[var(--color-status-neutral)] border-[var(--color-status-neutral)]"
                          : flowButtonClass
                      } text-white hover:opacity-90`}
                      onClick={(e) => {
                        e.stopPropagation()
                        triggerAction("flow")
                      }}
                      disabled={flowButtonClass === "bg-gray-400"}
                    >
                      Flow
                    </LoadingButton>
                    <LoadingButton
                      isLoading={isFetching}
                      loadingText="..."
                      variant="outline"
                      className={`h-8 flex-1 text-xs font-medium transition-all ${
                        isError
                          ? "bg-[var(--color-status-neutral)] border-[var(--color-status-neutral)]"
                          : trendButtonClass
                      } text-white hover:opacity-90`}
                      onClick={(e) => {
                        e.stopPropagation()
                        triggerAction("trend")
                      }}
                      disabled={trendButtonClass === "bg-gray-400"}
                    >
                      Trend
                    </LoadingButton>
                    <LoadingButton
                      isLoading={isFetching}
                      loadingText="..."
                      variant="outline"
                      className={`h-8 flex-1 text-xs font-medium transition-all ${
                        isError
                          ? "bg-[var(--color-status-neutral)] border-[var(--color-status-neutral)]"
                          : balancedButtonClass
                      } text-white hover:opacity-90`}
                      onClick={(e) => {
                        e.stopPropagation()
                        triggerAction("balanced")
                      }}
                      disabled={balancedButtonClass === "bg-gray-400"}
                    >
                      Balanced
                    </LoadingButton>
                  </>
                )}

                {inLoadingMode && (
                  <>
                    <LoadingButton
                      isLoading={true}
                      loadingText="..."
                      variant="outline"
                      className="h-8 flex-1 text-xs font-medium bg-[var(--color-accent-blue)] text-white border-[var(--color-accent-blue)]"
                    >
                      Summary
                    </LoadingButton>
                    <LoadingButton
                      isLoading={true}
                      loadingText="..."
                      variant="outline"
                      className="h-8 flex-1 text-xs font-medium bg-[var(--color-accent-blue)] text-white border-[var(--color-accent-blue)]"
                    >
                      Details
                    </LoadingButton>
                  </>
                )}

                {inResultsMode && (
                  <>
                    <LoadingButton
                      isLoading={false}
                      loadingText="..."
                      variant="outline"
                      className={`h-8 flex-1 text-xs font-medium transition-all ${
                        isMatched
                          ? "bg-[var(--color-accent-blue)] text-white border-[var(--color-accent-blue)] hover:bg-[var(--color-accent-blue-hover)]"
                          : "cursor-not-allowed border-[var(--color-node-border)] text-[var(--color-metric-label)] bg-transparent"
                      }`}
                      disabled={!isMatched}
                    >
                      Summary
                    </LoadingButton>
                    <LoadingButton
                      isLoading={false}
                      loadingText="..."
                      variant="outline"
                      className={`h-8 flex-1 text-xs font-medium transition-all ${
                        isMatched
                          ? "bg-[var(--color-accent-blue)] text-white border-[var(--color-accent-blue)] hover:bg-[var(--color-accent-blue-hover)]"
                          : "cursor-not-allowed border-[var(--color-node-border)] text-[var(--color-metric-label)] bg-transparent"
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
        </div>
      </div>

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
