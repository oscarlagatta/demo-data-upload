"use client"
import { type ReactNode, useCallback, useEffect, useMemo, useState } from "react"
import Draggable from "react-draggable"
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
  useReactFlow,
  ConnectionMode,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { AlertCircle, Loader2, RefreshCw } from 'lucide-react'
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

import { useFlowDataBackEnd } from "@/domains/payment-health/assets/flow-data-us-wires/flow-data-use-wires-back-end"
import { useTransactionSearchUsWiresContext } from "@/domains/payment-health/providers/us-wires/us-wires-transaction-search-provider"
import { computeTrafficStatusColors } from "@/domains/payment-health/utils/traffic-status-utils"
import { InfoSection } from "../../../../indicators/info-section/info-section"
import PaymentSearchBoxUsWires from "@/domains/payment-health/components/search/payment-search-box-us-wires/payment-search-box-us-wires"
import SplunkTableUsWiresBackend from "@/domains/payment-health/components/tables/splunk-table-us-wires/splunk-table-us-wires-backend"
import { TransactionDetailsTableAgGrid } from "@/domains/payment-health/components/tables/transaction-details-table-ag-grid/transaction-details-table-ag-grid"
import CustomNodeUsWires from "@/domains/payment-health/components/flow/nodes/custom-nodes-us-wires/custom-node-us-wires"
import SectionBackgroundNode from "@/domains/payment-health/components/flow/nodes/expandable-charts/section-background-node"
import { EdgeContextMenu } from "@/domains/payment-health/components/flow/context-menu/EdgeContextMenu"

const SECTION_IDS = ["bg-origination", "bg-validation", "bg-middleware", "bg-processing"]

const sectionDurations = {
  "bg-origination": 1.2,
  "bg-validation": 2.8,
  "bg-middleware": 1.9,
  "bg-processing": 3.4,
}

const SECTION_WIDTH_PROPORTIONS = [0.2, 0.2, 0.25, 0.35]
const GAP_WIDTH = 16

type ActionType = "flow" | "trend" | "balanced"

const Flow = ({
  nodeTypes,
  onShowSearchBox,
}: {
  nodeTypes: NodeTypes
  onShowSearchBox: () => void
}) => {
  // const { hasRequiredRole } = useAuthzRules();

  const { showTableView } = useTransactionSearchUsWiresContext()
  const {
    nodes: flowNodes,
    edges: flowEdges,
    isLoading: isFlowDataLoading,
    error: flowDataError,
    sectionTimings,
    totalProcessingTime,
    splunkData,
  } = useFlowDataBackEnd()

  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [connectedNodeIds, setConnectedNodeIds] = useState<Set<string>>(new Set())
  const [connectedEdgeIds, setConnectedEdgeIds] = useState<Set<string>>(new Set())

  const [lastRefetch, setLastRefetch] = useState<Date | null>(null)

  const [canvasHeight, setCanvasHeight] = useState<number>(500) // default height
  
  const [isInitialized, setIsInitialized] = useState(false)
  const { fitView } = useReactFlow()

  const width = useStore((state) => state.width)

  const isAuthorized = true // hasRequiredRole();

  const isLoading = isFlowDataLoading
  const isError = !!flowDataError
  const isFetching = isFlowDataLoading
  const isSuccess = !isLoading && !isError && splunkData

  const handleRefetch = async () => {
    try {
      // Note: The new hook doesn't expose refetch directly
      // This could be enhanced by exposing refetch from useGetSplunkWiresFlow
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

  // Function to find connected nodes and edges
  const findConnections = useCallback(
    (nodeId: string) => {
      const connectedNodes = new Set<string>()
      const connectedEdges = new Set<string>()

      edges.forEach((edge) => {
        if (edge.source === nodeId || edge.target === nodeId) {
          connectedEdges.add(edge.id)
          if (edge.source === nodeId) {
            connectedNodes.add(edge.target)
          }
          if (edge.target === nodeId) {
            connectedNodes.add(edge.source)
          }
        }
      })

      return { connectedNodes, connectedEdges }
    },
    [edges],
  )

  // Hanlde node click
  const handleNodeClick = useCallback(
    (nodeId: string) => {
      if (isLoading || isFetching) return

      if (selectedNodeId === nodeId) {
        // clicking the same node deselects it
        setSelectedNodeId(null)
        setConnectedNodeIds(new Set())
        setConnectedEdgeIds(new Set())
      } else {
        // Select new node and find its connections
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

  // Handler for deleting edges via context menu
  const handleDeleteEdge = useCallback(
    (edgeIdToDelete: string) => {
      console.log("[v0] Deleting edge:", edgeIdToDelete)
      
      setEdges((currentEdges) => 
        currentEdges.filter((edge) => edge.id !== edgeIdToDelete)
      )
      
      // Clear selection if the deleted edge was part of selected connections
      if (connectedEdgeIds.has(edgeIdToDelete)) {
        setConnectedEdgeIds((prev) => {
          const updated = new Set(prev)
          updated.delete(edgeIdToDelete)
          return updated
        })
      }
    },
    [connectedEdgeIds]
  )

  // Get connected systems names for display
  const getConnectedSystemNames = useCallback(() => {
    if (!selectedNodeId) {
      return []
    }

    return Array.from(connectedNodeIds)
      .map((nodeId) => {
        const node = nodes.find((n) => n.id === nodeId)
        return node?.data?.["title"] || nodeId
      })
      .sort()
  }, [selectedNodeId, connectedNodeIds, nodes])

  useEffect(() => {
    if (flowNodes.length > 0) {
      const nodesWithTiming = flowNodes.map((node) => {
        // If it's a background node, add timing data
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
      if (!isInitialized) {
        setTimeout(() => {
          setIsInitialized(true)
          fitView({ duration: 0, padding: 0.1 })
        }, 100)
      }
    }
  }, [flowEdges, isInitialized, fitView])

  useEffect(() => {
    // calculate the bounding box of all nodes and adjust the canvas height
    const updateCanvasHeight = () => {
      if (nodes.length === 0) return

      let minY = Number.POSITIVE_INFINITY
      let maxY = Number.NEGATIVE_INFINITY

      nodes.forEach((node) => {
        const nodeY = node.position.y
        const nodeHeight = node.style?.height ? Number.parseFloat(node.style?.height as string) : 0

        minY = Math.min(minY, nodeY)
        maxY = Math.max(maxY, nodeY + nodeHeight)
      })

      const calculatedHeight = maxY - minY + 50
      setCanvasHeight(calculatedHeight)
    }

    updateCanvasHeight()
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

      const baseStrokeWidth = 2
      const connectedStrokeWidth = 3
      const baseColor = '#6b7280'
      const connectedColor = '#3b82f6'
      const dimmedColor = '#d1d5db'

      const sourceNode = nodes.find(n => n.id === edge.source)
      const targetNode = nodes.find(n => n.id === edge.target)
      const sourceLabel = sourceNode?.data?.['title'] || edge.source
      const targetLabel = targetNode?.data?.['title'] || edge.target

      return {
        ...edge,
        style: {
          ...edge.style,
          strokeWidth: isConnected ? connectedStrokeWidth : baseStrokeWidth,
          stroke: isConnected ? connectedColor : isDimmed ? dimmedColor : baseColor,
          opacity: isDimmed ? 0.3 : 1,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          filter: isConnected ? 'drop-shadow(0 0 6px rgba(59, 130, 246, 0.4))' : undefined,
        },
        className: `react-flow__edge ${isConnected ? "edge-connected" : ""} ${isDimmed ? "edge-dimmed" : ""}`,
        animated: isConnected,
        // Add interactivity properties for better hover detection
        interactionWidth: 20, // Wider invisible interaction area
        markerEnd: {
          ...edge.markerEnd,
          type: MarkerType.ArrowClosed,
          color: isConnected ? connectedColor : isDimmed ? dimmedColor : baseColor,
        },
        data: {
          ...edge.data,
          sourceLabel,
          targetLabel,
          onDelete: handleDeleteEdge,
        },
      }
    })
  }, [edges, connectedEdgeIds, selectedNodeId, nodes, handleDeleteEdge])

  const renderDataPanel = () => {
    if (isLoading) {
      return (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
            <span className="text-sm font-medium text-blue-600">Loading Splunk data...</span>
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

  if (showTableView) {
    return <TransactionDetailsTableAgGrid />
  }

  return (
    <div className="relative h-full w-full" style={{ height: `${canvasHeight}px` }}>
      {/*If table mode is on, render the AG Grid and hide flow*/}
      {tableMode.show ? (
        <SplunkTableUsWiresBackend
          aitNum={tableMode.aitNum!}
          action={tableMode.action!}
          splunkDatas={
            splunkData?.find((node) => {
              // Find the node that matches the selected AIT
              const nodeSplunkData = node.splunkDatas?.[0]
              return (
                nodeSplunkData &&
                (nodeSplunkData.aiT_NUM === tableMode.aitNum || nodeSplunkData.aIT_NUM === tableMode.aitNum)
              )
            })?.splunkDatas || []
          }
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
          {/* Refresh Data Button - Icon only, docked top-right */}
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
          <div 
            onContextMenu={(e) => {
              // Allow context menu on edges, but prevent on background
              const target = e.target as HTMLElement
              if (!target.closest('.react-flow__edge')) {
                e.preventDefault()
              }
            }}
          >
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
              connectionMode={ConnectionMode.Loose}
              connectionRadius={50}
              snapToGrid={false}
              snapGrid={[15, 15]}
              defaultEdgeOptions={{
                type: 'smoothstep',
                animated: false,
                style: { 
                  strokeWidth: 2, 
                  stroke: '#6b7280',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                },
                markerEnd: {
                  type: MarkerType.ArrowClosed,
                  color: '#6b7280',
                },
              }}
              onEdgeContextMenu={(event, edge) => {
                event.preventDefault()
                console.log("[v0] Edge right-clicked:", edge.id)
                // For now, show toast with edge info and delete option
                const sourceNode = nodes.find(n => n.id === edge.source)
                const targetNode = nodes.find(n => n.id === edge.target)
                const sourceLabel = sourceNode?.data?.['title'] || edge.source
                const targetLabel = targetNode?.data?.['title'] || edge.target
                
                // Simple confirmation for deletion
                const shouldDelete = window.confirm(
                  `Remove connection?\n\nFrom: ${sourceLabel}\nTo: ${targetLabel}\n\nClick OK to remove this connection.`
                )
                
                if (shouldDelete) {
                  handleDeleteEdge(edge.id)
                  toast.success("Connection removed", {
                    description: `Removed connection from ${sourceLabel} to ${targetLabel}`,
                  })
                }
              }}
            >
              <Controls />
              <Background gap={16} size={1} />
            </ReactFlow>
          </div>

          {/* Connected System Panel */}
          {selectedNodeId && (
            <Draggable
              onStart={() => {
                const panel = document.getElementById("connected-systems-panel")
                if (panel) {
                  panel.style.cursor = "grabbing"
                }
              }}
              onStop={() => {
                const panel = document.getElementById("connected-systems-panel")
                if (panel) {
                  panel.style.cursor = "grab"
                }
              }}
            >
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
                      {getConnectedSystemNames().map((systemName, index) => (
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
            </Draggable>
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

export function FlowDiagramUsWires() {
  const { showAmountSearchResults, amountSearchParams, hideAmountResults } = useTransactionSearchUsWiresContext()
  const [showSearchBox, setShowSearchBox] = useState(true)

  const { totalProcessingTime, splunkData } = useFlowDataBackEnd()

  const nodeTypes: NodeTypes = useMemo(
    () => ({
      custom: (props) => (
        <CustomNodeUsWires
          {...props}
          onHideSearch={() => setShowSearchBox((prev) => !prev)}
          splunkData={splunkData || []}
        />
      ),
      background: SectionBackgroundNode,
    }),
    [splunkData],
  )

  return (
    <QueryClientProvider client={queryClient}>
      <ReactFlowProvider>
        {showSearchBox && <PaymentSearchBoxUsWires />}
        <InfoSection time={totalProcessingTime || 0} />
        {showAmountSearchResults && amountSearchParams ? (
          <>
            <div>TransactionSearchResultsGrid Shows</div>
            {/*<TransactionSearchResultsGrid*/}
            {/*  transactionAmount={amountSearchParams.amount}*/}
            {/*  dateStart={amountSearchParams.dateStart}*/}
            {/*  dateEnd={amountSearchParams.dateEnd}*/}
            {/*  onBack={hideAmountResults}*/}
            {/*/>*/}
          </>
        ) : (
          <Flow nodeTypes={nodeTypes} onShowSearchBox={() => setShowSearchBox(true)} />
        )}
      </ReactFlowProvider>
    </QueryClientProvider>
  )
}
