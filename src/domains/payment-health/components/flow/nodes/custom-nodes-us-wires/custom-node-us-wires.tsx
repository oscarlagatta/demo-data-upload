"use client"

import type React from "react"
import { memo } from "react"
import { Handle, Position, type NodeProps, type Node } from "@xyflow/react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTransactionSearchUsWiresContext } from "@/domains/payment-health/providers/us-wires/us-wires-transaction-search-provider"
import { LoadingButton } from "../../../loading/loading-button"
import { CardLoadingSkeleton } from "../../../loading/loading-skeleton"
import { MoreVertical } from "lucide-react"
import { IncidentSheet } from "../../../sheets/incident-sheet"
import { Button } from "@/components/ui/button"
import { useNodeState } from "./useNodeState"

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

interface CustomNodeUsWiresProps extends NodeProps<CustomNodeType> {
  onHideSearch: () => void
  isShowHiden?: boolean
  splunkData?: any[]
  isLoading?: boolean
  isError?: boolean
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
  const isAuthorized = true

  const { active: txActive, isFetching: txFetching, matchedAitIds, showTable } = useTransactionSearchUsWiresContext()

  const {
    aitNum,
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
  } = useNodeState({
    subtext: data.subtext,
    splunkData,
    isLoading,
    isError,
    isFetching,
    isSelected: data.isSelected,
    isConnected: data.isConnected,
    isDimmed: data.isDimmed,
    txActive,
    txFetching,
    matchedAitIds,
  })

  const averageThroughputTime = data.averageThruputTime30

  const handleClick = () => {
    if (data.onClick && id && !isDataLoading) {
      data.onClick(id)
    }
  }

  const triggerAction = (action: ActionType) => {
    if (!isDataLoading && !isFetching && aitNum && data.onActionClick) {
      data.onActionClick(aitNum, action)
    }
    onHideSearch()
  }

  const handleDetailsClick = async (e: React.MouseEvent) => {
    e.stopPropagation()

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

  const handleCreateIncident = () => {
    setIsIncidentSheetOpen(true)
  }

  if (isDataLoading) {
    return <CardLoadingSkeleton className="w-full" />
  }

  if (isError) {
    return <div className="text-red-500">Failed to load data. Please try again later.</div>
  }

  return (
    <>
      <Card className={`${cardClassName} h-[100px]`} onClick={handleClick} data-testid={`custom-node-${id}`}>
        <Handle type="target" position={Position.Left} className="h-2 w-2 !bg-gray-400" />
        <Handle type="source" position={Position.Right} className="h-2 w-2 !bg-gray-400" />
        <Handle type="source" position={Position.Top} className="h-2 w-2 !bg-gray-400" />
        <Handle type="source" position={Position.Bottom} className="h-2 w-2 !bg-gray-400" />

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

        <CardHeader className="p-2">
          <CardTitle className="text-center text-xs font-bold whitespace-nowrap">{data.title}</CardTitle>
          <p className="text-muted-foreground text-center text-[10px]">{data.subtext}</p>
          {averageThroughputTime !== undefined && averageThroughputTime > 0 && (
            <p className="text-center text-[9px] text-blue-600 font-medium mt-0.5">
              Avg: {averageThroughputTime.toFixed(2)}ms
            </p>
          )}
        </CardHeader>

        <CardContent className="p-2 pt-0">
          <div className="flex space-x-1 transition-all duration-200">
            {!isAuthorized ? (
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
              <>
                {inDefaultMode && (
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
