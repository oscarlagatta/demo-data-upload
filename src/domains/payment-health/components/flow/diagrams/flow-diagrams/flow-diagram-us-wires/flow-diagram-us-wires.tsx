"use client"
import type React from "react"
import { type ReactNode, useCallback, useEffect, useMemo, useState, useRef } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  type Edge,
  type EdgeChange,
  MarkerType,
  type Node,
  type NodeChange,
  type NodeTypes,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
  ReactFlow,
  ReactFlowProvider,
  useStore,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { AlertCircle, Loader2, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useTransactionSearchUsWiresContext } from "@/domains/payment-health/providers/us-wires/us-wires-transaction-search-provider"
import { computeTrafficStatusColors } from "@/domains/payment-health/utils/traffic-status-utils"
import { updateNodePositions, calculateCanvasHeight } from "@/domains/payment-health/utils/flow-layout-utils"
import { findNodeConnections, getConnectedSystemNames } from "@/domains/payment-health/utils/flow-connection-utils"
import type {
  ActionType,
  TableModeState,
  FlowDiagramProps,
  FlowProps,
} from "@/domains/payment-health/types/flow-diagram-types"
import { InfoSection } from "../../../../indicators/info-section/info-section"
import PaymentSearchBoxUsWires from "@/domains/payment-health/components/search/payment-search-box-us-wires/payment-search-box-us-wires"
import SplunkTableUsWires from "@/domains/payment-health/components/tables/splunk-table-us-wires/splunk-table-us-wires"
import { TransactionDetailsTableAgGrid } from "@/domains/payment-health/components/tables/transaction-details-table-ag-grid/transaction-details-table-ag-grid"
import CustomNodeUsWires from "@/domains/payment-health/components/flow/nodes/custom-nodes-us-wires/custom-node-us-wires"
import SectionBackgroundNode from "@/domains/payment-health/components/flow/nodes/expandable-charts/section-background-node"
import { useFlowDataBackEnd } from "@/domains/payment-health/assets/flow-data-us-wires/flow-data-use-wires-back-end"

const createNodeTypes = (
  isShowHiden: boolean,
  onHideSearch: () => void,
  splunkData: any[],
  sectionTimings: Record<string, { duration: number; trend: string }> | null,
): NodeTypes => ({
  custom: (props) => (
    <CustomNodeUsWires {...props} isShowHiden={isShowHiden} onHideSearch={onHideSearch} splunkData={splunkData} />
  ),
  background: (props: any) => (
    <SectionBackgroundNode
      isHide={isShowHiden}
      {...props}
      duration={sectionTimings?.[props.id]?.duration}
      trend={sectionTimings?.[props.id]?.trend}
    />
  ),
})

// Custom Draggable Component that works with React 19
const DraggablePanel = ({
  children,
  onStart,
  onStop,
}: {
  children: ReactNode
  onStart?: () => void
  onStop?: () => void
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const elementRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      setIsDragging(true)
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      })
      onStart?.()
    },
    [position, onStart],
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return

      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    },
    [isDragging, dragStart],
  )

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false)
      onStop?.()
    }
  }, [isDragging, onStop])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)

      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  return (
    <div
      ref={elementRef}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        cursor: isDragging ? "grabbing" : "grab",
      }}
      onMouseDown={handleMouseDown}
    >
      {children}
    </div>
  )
}

const Flow = ({
  nodeTypes,
  onShowSearchBox,
  splunkData,
  sectionTimings,
  totalProcessingTime,
  isLoading,
  isError,
  onRefetch,
}: FlowProps) => {
  const { showTableView } = useTransactionSearchUsWiresContext()
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [connectedNodeIds, setConnectedNodeIds] = useState<Set<string>>(new Set())
  const [connectedEdgeIds, setConnectedEdgeIds] = useState<Set<string>>(new Set())
  const [lastRefetch, setLastRefetch] = useState<Date | null>(null)
  const [canvasHeight, setCanvasHeight] = useState<number>(500)
  const [tableMode, setTableMode] = useState<TableModeState>({
    show: false,
    aitNum: null,
    action: null,
  })
  const width = useStore((state) => state.width)
  const isAuthorized = true

  const { nodes: flowNodes, edges: flowEdges } = useFlowDataBackEnd()

  const isFetching = isLoading
  const isSuccess = !isLoading && !isError && splunkData

  const handleRefetch = async () => {
    try {
      onRefetch()
      setLastRefetch(new Date())
      toast.success("Data successfully refreshed!", {
        description: "The latest data has been loaded",
        icon: <RefreshCw className="h-4 w-4 text-green-500" />,
      })
    } catch (error) {
      console.error("Refetch failed:", error)
      toast.error("Failed to refresh data.", {
        description: "Please check your connection and try again.",
      })
    }
  }

  const findConnections = useCallback((nodeId: string) => findNodeConnections(nodeId, edges), [edges])

  const handleNodeClick = useCallback(
    (nodeId: string) => {
      if (isLoading || isFetching) return
      if (selectedNodeId === nodeId) {
        setSelectedNodeId(null)
        setConnectedNodeIds(new Set())
        setConnectedEdgeIds(new Set())
      } else {
        const { connectedNodes, connectedEdges } = findConnections(nodeId)
        setSelectedNodeId(nodeId)
        setConnectedNodeIds(connectedNodes)
        setConnectedEdgeIds(connectedEdges)
      }
    },
    [selectedNodeId, findConnections, isLoading, isFetching],
  )

  const handleActionClick = useCallback((aitNum: string, action: ActionType) => {
    setTableMode({
      show: true,
      aitNum,
      action,
    })
  }, [])

  const getConnectedSystemNamesCallback = useCallback(() => {
    if (!selectedNodeId) {
      return []
    }
    return getConnectedSystemNames(connectedNodeIds, nodes)
  }, [selectedNodeId, connectedNodeIds, nodes])

  useEffect(() => {
    if (flowNodes.length > 0) {
      const nodesWithTiming = flowNodes.map((node) => {
        if (node.type === "background" && sectionTimings?.[node.id]) {
          return {
            ...node,
            data: {
              ...node.data,
              duration: sectionTimings[node.id].duration,
              trend: sectionTimings[node.id].trend,
            },
          }
        }
        return node
      })
      setNodes(nodesWithTiming)
    }
  }, [flowNodes, sectionTimings])

  useEffect(() => {
    if (flowEdges.length > 0) {
      setEdges(flowEdges)
    }
  }, [flowEdges])

  useEffect(() => {
    if (width > 0 && flowNodes.length > 0) {
      setNodes((currentNodes) => updateNodePositions(currentNodes, flowNodes, width))
    }
  }, [width, flowNodes])

  useEffect(() => {
    const newHeight = calculateCanvasHeight(nodes)
    setCanvasHeight(newHeight)
  }, [nodes])

  const onNodesChange: OnNodesChange = useCallback(
    (changes: NodeChange<Node>[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes],
  )

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes: EdgeChange<Edge>[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges],
  )

  const onConnect: OnConnect = useCallback(
    (connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            type: "smoothstep",
            markerStart: { type: MarkerType.ArrowClosed, color: "#6b7280" },
            markerEnd: { type: MarkerType.ArrowClosed, color: "#6b7280" },
            style: { strokeWidth: 2, stroke: "#6b7280" },
          },
          eds,
        ),
      ),
    [setEdges],
  )

  const nodesForFlow = useMemo(() => {
    return nodes.map((node) => {
      const isSelected = selectedNodeId === node.id
      const isConnected = connectedNodeIds.has(node.id)
      const isDimmed = selectedNodeId && !isSelected && !isConnected
      const nodeData = {
        ...node.data,
        isSelected,
        isConnected,
        isDimmed,
        onClick: handleNodeClick,
        onActionClick: handleActionClick,
      }
      if (node.parentId) {
        const { parentId, ...rest } = node
        return {
          ...rest,
          parentNode: parentId,
          data: nodeData,
        }
      }
      return {
        ...(node as Node),
        data: nodeData,
      }
    })
  }, [nodes, selectedNodeId, connectedNodeIds, handleNodeClick, handleActionClick])

  const edgesForFlow = useMemo(() => {
    return edges.map((edge) => {
      const isConnected = connectedEdgeIds.has(edge.id)
      const isDimmed = selectedNodeId && !isConnected
      return {
        ...edge,
        style: {
          ...edge.style,
          strokeWidth: isConnected ? 3 : 2,
          stroke: isConnected ? "#1d4ed8" : isDimmed ? "#d1d5db" : "#6b7280",
          opacity: isDimmed ? 0.3 : 1,
        },
        animated: isConnected,
      }
    })
  }, [edges, connectedEdgeIds, selectedNodeId])

  const renderDataPanel = () => {
    if (isLoading) {
      return (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
            <span className="text-sm font-medium text-blue-600">Loading flow data...</span>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      )
    }
    if (isError) {
      return (
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Error loading data</span>
          </div>
          <Button
            onClick={handleRefetch}
            size="sm"
            variant="outline"
            disabled={isFetching}
            className="w-full border-red-200 bg-transparent hover:border-red-300 hover:bg-red-50"
          >
            {isFetching ? (
              <>
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                Retrying...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-3 w-3" />
                Retry Connection
              </>
            )}
          </Button>
        </div>
      )
    }
    if (isSuccess && splunkData) {
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="mb-1 text-xs font-medium">Traffic Status Summary:</h4>
            <div className="flex items-center gap-1">
              {isFetching && <Loader2 className="h-3 w-3 animate-spin text-blue-500" />}
              <Button
                onClick={handleRefetch}
                size="sm"
                variant="ghost"
                disabled={isFetching}
                className="h-5 w-5 p-0 hover:bg-blue-50"
                title="Refresh data"
              >
                <RefreshCw className={`h-3 w-3 ${isFetching ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>
          <div className="rounded bg-gray-50 p-2 text-xs">
            {Object.entries(computeTrafficStatusColors(splunkData.flatMap((node) => node.splunkDatas || []))).map(
              ([aitNum, color]) => (
                <div key={aitNum} className="flex justify-between">
                  <span>AIT {aitNum}:</span>
                  <span
                    className={`rounded px-1 text-white ${
                      color === "green" ? "bg-green-500" : color === "red" ? "bg-red-500" : "bg-gray-400"
                    }`}
                  >
                    {color}
                  </span>
                </div>
              ),
            )}
          </div>
          <div>
            <h4 className="mb-1 text-xs font-medium">Raw Data (first 5 entries):</h4>
            <pre className="max-h-32 overflow-auto rounded bg-gray-50 p-2 text-xs">
              {JSON.stringify(splunkData.slice(0, 5), null, 2)}
            </pre>
          </div>
        </div>
      )
    }
    return null
  }

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="space-y-3 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-500" />
          <span className="text-sm font-medium text-blue-600">Loading flow diagram...</span>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="space-y-3 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-red-500" />
          <span className="text-sm font-medium text-red-600">Error loading flow diagram</span>
          <p className="text-xs text-gray-500">Please check your connection and try again.</p>
        </div>
      </div>
    )
  }

  if (showTableView) {
    return <TransactionDetailsTableAgGrid />
  }

  return (
    <div className="relative h-full w-full" style={{ height: `${canvasHeight}px` }}>
      {tableMode.show ? (
        <SplunkTableUsWires
          aitNum={tableMode.aitNum!}
          action={tableMode.action!}
          onBack={() => {
            setTableMode({
              show: false,
              aitNum: null,
              action: null,
            })
            onShowSearchBox()
          }}
        />
      ) : (
        <>
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
            {lastRefetch && !isFetching && (
              <span className="text-muted-foreground text-xs">Last updated: {lastRefetch.toLocaleTimeString()}</span>
            )}
            <Button
              onClick={handleRefetch}
              disabled={isFetching}
              variant="outline"
              size="sm"
              className="h-8 w-8 border-blue-200 bg-white p-0 shadow-sm hover:border-blue-300 hover:bg-blue-50"
              title="Refresh Splunk data"
              aria-label="Refresh Splunk data"
            >
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            </Button>
          </div>
          <ReactFlow
            nodes={nodesForFlow}
            edges={edgesForFlow}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            proOptions={{ hideAttribution: true }}
            className="bg-white"
            style={{ background: "#eeeff3ff" }}
            panOnDrag={false}
            elementsSelectable={false}
            minZoom={1}
            maxZoom={1}
          >
            <Controls />
            <Background gap={16} size={1} />
          </ReactFlow>
          {selectedNodeId && (
            <DraggablePanel onStart={() => {}} onStop={() => {}}>
              <div className="absolute top-4 left-4 z-10 max-w-sm rounded-lg border bg-white p-4 shadow-lg">
                <h3 className="mb-2 text-sm font-semibold text-gray-800">
                  Selected System:{" "}
                  {(nodes.find((n) => n.id === selectedNodeId)?.data?.["title"] as ReactNode) || "Unknown"}
                </h3>
                <div className="space-y-2">
                  <div>
                    <h4 className="mb-1 text-xs font-medium text-gray-600">
                      Connected Systems ({connectedNodeIds.size}):
                    </h4>
                    <div className="max-h-32 overflow-y-auto">
                      {getConnectedSystemNamesCallback().map((systemName, index) => (
                        <div key={index} className="mb-1 rounded bg-blue-50 px-2 py-1 text-xs text-gray-700">
                          {typeof systemName === "string" ? systemName : JSON.stringify(systemName)}
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => handleNodeClick(selectedNodeId)}
                    className="text-xs text-blue-600 underline hover:text-blue-800 disabled:opacity-50"
                    disabled={isLoading || isFetching}
                  >
                    Clear Selection
                  </button>
                </div>
              </div>
            </DraggablePanel>
          )}
        </>
      )}
    </div>
  )
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 3,
    },
  },
})

export function FlowDiagramUsWires({ isMonitoringMode = false }: FlowDiagramProps) {
  const { showAmountSearchResults, amountSearchParams } = useTransactionSearchUsWiresContext()
  const [showSearchBox, setShowSearchBox] = useState(true)

  const { sectionTimings, totalProcessingTime, splunkData, isLoading, error, refetch } = useFlowDataBackEnd()

  const [isShowHiden, setIsShowHiden] = useState(isMonitoringMode)

  useEffect(() => {
    setIsShowHiden(isMonitoringMode)
  }, [isMonitoringMode])

  const nodeTypes = useMemo(
    () => createNodeTypes(isShowHiden, () => setShowSearchBox((prev) => !prev), splunkData || [], sectionTimings),
    [isShowHiden, splunkData, sectionTimings],
  )

  const handleRefetch = useCallback(() => {
    if (refetch) {
      refetch()
    }
  }, [refetch])

  return (
    <QueryClientProvider client={queryClient}>
      <ReactFlowProvider>
        {showSearchBox && <PaymentSearchBoxUsWires />}
        <InfoSection time={totalProcessingTime || 0} />
        {showAmountSearchResults && amountSearchParams ? (
          <>
            <div>TransactionSearchResultsGrid Shows</div>
          </>
        ) : (
          <Flow
            nodeTypes={nodeTypes}
            onShowSearchBox={() => setShowSearchBox(true)}
            splunkData={splunkData}
            sectionTimings={sectionTimings}
            totalProcessingTime={totalProcessingTime}
            isLoading={isLoading}
            isError={!!error}
            onRefetch={handleRefetch}
          />
        )}
      </ReactFlowProvider>
    </QueryClientProvider>
  )
}
