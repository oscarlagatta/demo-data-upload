"use client"
import type React from "react"
import { type ReactNode, useCallback, useEffect, useMemo, useState, useRef } from "react"
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
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
  ReactFlow,
  useStore,
} from "@xyflow/react"
import { AlertCircle, Loader2, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useTransactionSearchUsWiresContext } from "@/domains/payment-health/providers/us-wires/us-wires-transaction-search-provider"
import { computeTrafficStatusColors } from "@/domains/payment-health/utils/traffic-status-utils"
import { updateNodePositions, calculateCanvasHeight } from "@/domains/payment-health/utils/flow-layout-utils"
import { findNodeConnections, getConnectedSystemNames } from "@/domains/payment-health/utils/flow-connection-utils"
import type { ActionType, TableModeState, FlowProps } from "@/domains/payment-health/types/flow-diagram-types"
import SplunkTableUsWiresBackend from "@/domains/payment-health/components/tables/splunk-table-us-wires/splunk-table-us-wires-backend"
import { TransactionDetailsTableAgGrid } from "@/domains/payment-health/components/tables/transaction-details-table-ag-grid/transaction-details-table-ag-grid"
import { FlowLegend } from "@/domains/payment-health/components/flow/legend/flow-legend"
import { FlowSkeletonLoader } from "@/domains/payment-health/components/flow/loading/flow-skeleton-loader"
import staticLayoutConfigRaw from "@/domains/payment-health/config/flow-layout-config.json"
const staticLayoutConfig = staticLayoutConfigRaw as StaticLayoutConfig

interface SectionPosition {
  x: number
  y: number
}

interface SectionData {
  baseX: number
  positions: SectionPosition[]
}

interface SectionPositions {
  sections: Record<string, SectionData>
}

interface LayoutSection {
  id: string
  type: string
  position: { x: number; y: number }
  data: Record<string, any>
  draggable: boolean
  selectable: boolean
  zIndex: number
  style: {
    width: string | number
    height: string | number
  }
  sectionPositions: SectionPositions
}

interface StaticLayoutConfig {
  layOutConfig: LayoutSection[]
}

/**
 * Custom Draggable Panel Component
 *
 * A React 19 compatible draggable panel that allows users to move UI elements around the screen.
 * This component handles mouse events to enable drag functionality without external dependencies.
 *
 * Features:
 * - Mouse-based drag and drop functionality
 * - Position tracking and state management
 * - Event cleanup to prevent memory leaks
 * - Cursor state changes during drag operations
 *
 * @param children - The content to be rendered inside the draggable panel
 * @param onStart - Optional callback fired when dragging starts
 * @param onStop - Optional callback fired when dragging stops
 */
const DraggablePanel = ({
  children,
  onStart,
  onStop,
}: {
  children: ReactNode
  onStart?: () => void
  onStop?: () => void
}) => {
  // State management for drag functionality
  const [isDragging, setIsDragging] = useState(false) // Tracks if the panel is currently being dragged
  const [position, setPosition] = useState({ x: 0, y: 0 }) // Current position of the panel
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 }) // Initial mouse position when drag starts
  const elementRef = useRef<HTMLDivElement>(null) // Reference to the draggable element

  /**
   * Handles the start of a drag operation
   * Calculates the offset between mouse position and panel position
   */
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      setIsDragging(true)
      // Calculate offset to maintain relative position during drag
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      })
      onStart?.() // Notify parent component that dragging started
    },
    [position, onStart],
  )

  /**
   * Handles mouse movement during drag operation
   * Updates panel position based on mouse movement
   */
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return

      // Update position based on current mouse position and initial offset
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    },
    [isDragging, dragStart],
  )

  /**
   * Handles the end of a drag operation
   * Cleans up drag state and notifies parent component
   */
  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false)
      onStop?.() // Notify parent component that dragging stopped
    }
  }, [isDragging, onStop])

  /**
   * Effect to manage global mouse event listeners during drag operations
   * Adds listeners when dragging starts and removes them when dragging stops
   */
  useEffect(() => {
    if (isDragging) {
      // Add global event listeners to track mouse movement outside the component
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)

      // Cleanup function to remove event listeners
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
        transform: `translate(${position.x}px, ${position.y}px)`, // Apply current position
        cursor: isDragging ? "grabbing" : "grab", // Change cursor based on drag state
      }}
      onMouseDown={handleMouseDown}
    >
      {children}
    </div>
  )
}

/**
 * FlowUsWires Component
 *
 * Main flow diagram component for US Wires payment processing visualization.
 * This component renders an interactive flow diagram showing the payment processing pipeline,
 * including nodes representing different systems and edges showing data flow connections.
 *
 * Key Features:
 * - Interactive node selection and highlighting
 * - Real-time data integration from Splunk
 * - Dynamic layout calculation based on screen width
 * - Connection visualization between systems
 * - Error handling and loading states
 * - Data refresh functionality
 * - Table view integration for detailed transaction data
 *
 * @param nodeTypes - Custom node type definitions for rendering different node types
 * @param onShowSearchBox - Callback to show the search box interface
 * @param flowNodes - Array of nodes for the flow diagram from props
 * @param flowEdges - Array of edges for the flow diagram from props
 * @param splunkData - Real-time data from Splunk for traffic status and metrics
 * @param sectionTimings - Performance timing data for each section/node
 * @param totalProcessingTime - Total time for the entire processing pipeline
 * @param isLoading - Loading state indicator
 * @param isError - Error state indicator
 * @param onRefetch - Callback to refresh data from external sources
 * @param layOutConfig - Layout configuration from the backend data (optional, falls back to static config)
 */
export const FlowUsWires = ({
  nodeTypes,
  onShowSearchBox,
  flowNodes,
  flowEdges,
  splunkData,
  sectionTimings,
  totalProcessingTime,
  isLoading,
  isError,
  onRefetch,
  layOutConfig: layOutConfigFromBackend,
}: FlowProps & { layOutConfig?: LayoutSection[] }) => {
  // Context hook for transaction search functionality
  const { showTableView } = useTransactionSearchUsWiresContext()

  // Core flow diagram state management
  const [nodes, setNodes] = useState<Node[]>([]) // All nodes in the flow diagram
  const [edges, setEdges] = useState<Edge[]>([]) // All edges connecting nodes
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null) // Currently selected node
  const [connectedNodeIds, setConnectedNodeIds] = useState<Set<string>>(new Set()) // Nodes connected to selected node
  const [connectedEdgeIds, setConnectedEdgeIds] = useState<Set<string>>(new Set()) // Edges connected to selected node

  // UI state management
  const [lastRefetch, setLastRefetch] = useState<Date | null>(null) // Timestamp of last data refresh
  const [canvasHeight, setCanvasHeight] = useState<number>(500) // Dynamic canvas height based on content
  const [tableMode, setTableMode] = useState<TableModeState>({
    // Table view state for detailed data
    show: false,
    aitNum: null,
    action: null,
  })

  // ReactFlow store hook for canvas width
  const width = useStore((state) => state.width)
  const isAuthorized = true // Authorization state (currently hardcoded)

  // Derived state for loading and success conditions
  const isFetching = isLoading
  const isSuccess = !isLoading && !isError && splunkData

  /**
   * Handles data refresh functionality
   * Triggers data refetch and shows user feedback via toast notifications
   */
  const handleRefetch = async () => {
    try {
      onRefetch() // Trigger data refresh
      setLastRefetch(new Date()) // Update last refresh timestamp
      // Show success notification
      toast.success("Data successfully refreshed!", {
        description: "The latest data has been loaded",
        icon: <RefreshCw className="h-4 w-4 text-green-500" />,
      })
    } catch (error) {
      console.error("Refetch failed:", error)
      // Show error notification
      toast.error("Failed to refresh data.", {
        description: "Please check your connection and try again.",
      })
    }
  }

  /**
   * Utility function to find connections for a given node
   * Uses the flow connection utilities to determine related nodes and edges
   */
  const findConnections = useCallback((nodeId: string) => findNodeConnections(nodeId, edges), [edges])

  /**
   * Handles node click interactions
   * Manages selection state and highlights connected nodes/edges
   * Prevents interaction during loading states
   */
  const handleNodeClick = useCallback(
    (nodeId: string) => {
      // Prevent interaction during loading
      if (isLoading || isFetching) return

      if (selectedNodeId === nodeId) {
        // Deselect if clicking the same node
        setSelectedNodeId(null)
        setConnectedNodeIds(new Set())
        setConnectedEdgeIds(new Set())
      } else {
        // Select new node and highlight connections
        const { connectedNodes, connectedEdges } = findConnections(nodeId)
        setSelectedNodeId(nodeId)
        setConnectedNodeIds(connectedNodes)
        setConnectedEdgeIds(connectedEdges)
      }
    },
    [selectedNodeId, findConnections, isLoading, isFetching],
  )

  /**
   * Handles action clicks from nodes (e.g., viewing detailed data)
   * Switches to table mode to show specific transaction data
   */
  const handleActionClick = useCallback((aitNum: string, action: ActionType) => {
    setTableMode({
      show: true,
      aitNum,
      action,
    })
  }, [])

  /**
   * Gets the names of systems connected to the currently selected node
   * Used for displaying connection information in the selection panel
   */
  const getConnectedSystemNamesCallback = useCallback(() => {
    if (!selectedNodeId) {
      return []
    }
    return getConnectedSystemNames(connectedNodeIds, nodes)
  }, [selectedNodeId, connectedNodeIds, nodes])

  /**
   * Effect: Update nodes with timing data when flow nodes or section timings change
   * Merges backend flow structure with real-time performance data
   */
  useEffect(() => {
    console.log(
      "[v0] useEffect triggered - flowNodes length:",
      flowNodes?.length || 0,
      "sectionTimings:",
      !!sectionTimings,
    )

    if (flowNodes && Array.isArray(flowNodes) && flowNodes.length > 0) {
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

      setNodes((prevNodes) => {
        if (prevNodes.length !== nodesWithTiming.length) {
          console.log("[v0] Updating nodes with", nodesWithTiming.length, "nodes")
          return nodesWithTiming
        }

        // Deep comparison for node data changes
        const hasChanges = nodesWithTiming.some((newNode, index) => {
          const prevNode = prevNodes[index]
          return (
            !prevNode || prevNode.id !== newNode.id || JSON.stringify(prevNode.data) !== JSON.stringify(newNode.data)
          )
        })

        if (hasChanges) {
          console.log("[v0] Updating nodes with", nodesWithTiming.length, "nodes")
          return nodesWithTiming
        }

        return prevNodes
      })
    } else if (!flowNodes || flowNodes.length === 0) {
      console.log("[v0] No flowNodes available, clearing nodes")
      setNodes((prevNodes) => (prevNodes.length > 0 ? [] : prevNodes))
    }
  }, [flowNodes, sectionTimings])

  /**
   * Effect: Update edges when flow edges change
   * Sets up the connection structure for the flow diagram
   */
  useEffect(() => {
    console.log("[v0] useEffect for edges triggered - flowEdges length:", flowEdges?.length || 0)

    if (flowEdges && Array.isArray(flowEdges) && flowEdges.length > 0) {
      setEdges((prevEdges) => {
        if (prevEdges.length !== flowEdges.length) {
          console.log("[v0] Updating edges with", flowEdges.length, "edges")
          return flowEdges
        }

        // Deep comparison for edge changes
        const hasChanges = flowEdges.some((newEdge, index) => {
          const prevEdge = prevEdges[index]
          return (
            !prevEdge ||
            prevEdge.id !== newEdge.id ||
            prevEdge.source !== newEdge.source ||
            prevEdge.target !== newEdge.target
          )
        })

        if (hasChanges) {
          console.log("[v0] Updating edges with", flowEdges.length, "edges")
          return flowEdges
        }

        return prevEdges
      })
    } else if (!flowEdges || flowEdges.length === 0) {
      console.log("[v0] No flowEdges available, clearing edges")
      setEdges((prevEdges) => (prevEdges.length > 0 ? [] : prevEdges))
    }
  }, [flowEdges])

  /**
   * Effect: Update node positions when canvas width changes
   * Ensures responsive layout that adapts to different screen sizes
   */
  useEffect(() => {
    if (width > 0 && flowNodes && flowNodes.length > 0) {
      setNodes((currentNodes) => updateNodePositions(currentNodes, flowNodes, width))
    }
  }, [width, flowNodes])

  /**
   * Effect: Calculate and update canvas height based on node positions
   * Ensures the canvas is tall enough to contain all nodes
   */
  useEffect(() => {
    const newHeight = calculateCanvasHeight(nodes)
    setCanvasHeight(newHeight)
  }, [nodes])

  /**
   * ReactFlow event handlers for node and edge changes
   * These handle user interactions like dragging nodes or modifying connections
   */
  const onNodesChange: OnNodesChange = useCallback(
    (changes: NodeChange<Node>[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes],
  )

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes: EdgeChange<Edge>[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges],
  )

  /**
   * Handles new connections between nodes
   * Applies styling and markers to new connections
   */
  const onConnect: OnConnect = useCallback(
    (connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            type: "smoothstep", // Smooth curved connections
            markerStart: { type: MarkerType.ArrowClosed, color: "#6b7280" },
            markerEnd: { type: MarkerType.ArrowClosed, color: "#6b7280" },
            style: { strokeWidth: 2, stroke: "#6b7280" },
          },
          eds,
        ),
      ),
    [setEdges],
  )

  /**
   * Memoized nodes for ReactFlow with interaction handlers and visual states
   * Applies selection, connection, and dimming effects based on current state
   */
  const nodesForFlow = useMemo(() => {
    return nodes.map((node) => {
      const isSelected = selectedNodeId === node.id
      const isConnected = connectedNodeIds.has(node.id)
      const isDimmed = selectedNodeId && !isSelected && !isConnected

      // Enhanced node data with interaction handlers and visual state
      const nodeData = {
        ...node.data,
        isSelected,
        isConnected,
        isDimmed,
        onClick: handleNodeClick,
        onActionClick: handleActionClick,
      }

      // Handle parent-child node relationships
      if (node.parentId) {
        const { parentId, ...rest } = node
        return {
          ...rest,
          parentNode: parentId, // ReactFlow expects 'parentNode' instead of 'parentId'
          data: nodeData,
        }
      }

      return {
        ...(node as Node),
        data: nodeData,
      }
    })
  }, [nodes, selectedNodeId, connectedNodeIds, handleNodeClick, handleActionClick])

  /**
   * Memoized edges for ReactFlow with visual highlighting based on selection
   * Applies different styles for connected, selected, and dimmed states
   */
  const edgesForFlow = useMemo(() => {
    return edges.map((edge) => {
      const isConnected = connectedEdgeIds.has(edge.id)
      const isDimmed = selectedNodeId && !isConnected

      return {
        ...edge,
        style: {
          ...edge.style,
          strokeWidth: isConnected ? 3 : 2, // Thicker lines for connected edges
          stroke: isConnected ? "#1d4ed8" : isDimmed ? "#d1d5db" : "#6b7280", // Blue for connected, gray for others
          opacity: isDimmed ? 0.3 : 1, // Dim unrelated edges when something is selected
        },
        animated: isConnected, // Animate connected edges
      }
    })
  }, [edges, connectedEdgeIds, selectedNodeId])

  /**
   * Renders the data panel showing traffic status and raw data
   * Handles different states: loading, error, and success with data
   */
  const renderDataPanel = () => {
    // Loading state with skeleton placeholders
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

    // Error state with retry functionality
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

    // Success state with traffic status and raw data display
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
          {/* Traffic status color indicators */}
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
          {/* Raw data preview */}
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

  console.log("[v0] Rendering - isLoading:", isLoading, "layOutConfig length:", layOutConfigFromBackend?.length || 0)

  // Early returns for loading and error states
  if (isLoading) {
    const layoutConfigForSkeleton: LayoutSection[] =
      layOutConfigFromBackend && layOutConfigFromBackend.length > 0
        ? layOutConfigFromBackend
        : staticLayoutConfig.layOutConfig

    console.log("[v0] Showing skeleton loader with layout config:", layoutConfigForSkeleton.length, "sections")
    console.log(
      "[v0] Using",
      layOutConfigFromBackend && layOutConfigFromBackend.length > 0 ? "backend" : "static",
      "layout config",
    )

    return <FlowSkeletonLoader layOutConfig={layoutConfigForSkeleton} />
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

  // Show table view if requested
  if (showTableView) {
    return <TransactionDetailsTableAgGrid />
  }

  // Main flow diagram render
  return (
    <div className="relative h-full w-full" style={{ height: `${canvasHeight}px` }}>
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
            onShowSearchBox() // Return to search box view
          }}
        />
      ) : (
        <>
          {/* Refresh button and last update timestamp */}
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

          {/* Main ReactFlow canvas */}
          <ReactFlow
            nodes={nodesForFlow}
            edges={edgesForFlow}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            proOptions={{ hideAttribution: true }} // Hide ReactFlow attribution
            className="bg-white"
            style={{ background: "#eeeff3ff" }} // Light gray background
            panOnDrag={false} // Disable panning to prevent accidental movement
            elementsSelectable={false} // Disable default selection to use custom selection
            minZoom={1} // Fixed zoom level
            maxZoom={1}
          >
            <Controls /> {/* Zoom and pan controls */}
            <Background gap={16} size={1} /> {/* Grid background */}
          </ReactFlow>

          {/* Selection panel showing connected systems */}
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
                    {/* List of connected systems */}
                    <div className="max-h-32 overflow-y-auto">
                      {getConnectedSystemNamesCallback().map((systemName, index) => (
                        <div key={index} className="mb-1 rounded bg-blue-50 px-2 py-1 text-xs text-gray-700">
                          {typeof systemName === "string" ? systemName : JSON.stringify(systemName)}
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Clear selection button */}
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

          {/* FlowLegend component in bottom-right corner */}
          <FlowLegend />
        </>
      )}
    </div>
  )
}
