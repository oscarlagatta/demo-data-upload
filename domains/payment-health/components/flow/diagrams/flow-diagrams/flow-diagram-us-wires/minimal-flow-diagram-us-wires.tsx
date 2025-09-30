"use client"
import { useCallback, useEffect, useMemo, useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { type NodeTypes, ReactFlowProvider } from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { useMinimalTransactionSearchUsWiresContext } from "../../../../../providers/us-wires/minimal-us-wires-provider"
import { useGetWiresFlow, type RealFlowNode } from "../../../../../hooks/use-get-splunk-us-wires/get-wires-flow"

const createNodeTypes = (
  isShowHiden: boolean,
  onHideSearch: () => void,
  nodes: RealFlowNode[],
  isLoading: boolean,
  isError: boolean,
): NodeTypes => ({
  custom: (props) => {
    const nodeData = nodes.find((n) => n.id === props.id)
    return (
      <div
        className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => onHideSearch()}
      >
        <div className="text-sm font-medium text-gray-900">{nodeData?.label || "Flow Node"}</div>
        <div className="text-xs text-gray-500 mt-1">
          {isLoading ? "Loading..." : isError ? "Error" : `${nodeData?.splunkDatas?.length || 0} data points`}
        </div>
        <div className="text-xs text-blue-600 mt-1">{nodeData?.systemHealth || "Unknown"}</div>
      </div>
    )
  },
  background: (props: any) => (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 opacity-80">
      <div className="text-xs text-gray-600">{props.data?.label || "Background"}</div>
    </div>
  ),
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 3,
    },
  },
})

function SimpleFlowVisualization({
  nodeTypes,
  nodes,
  processingSections,
  isLoading,
  isError,
}: {
  nodeTypes: NodeTypes
  nodes: RealFlowNode[]
  processingSections: any[]
  isLoading: boolean
  isError: boolean
}) {
  console.log("[v0] Flow data received:", { nodes: nodes.length })
  console.log("[v0] Total nodes:", nodes.length)
  console.log(
    "[v0] Node types:",
    nodes.map((n) => ({ id: n.id, label: n.label, category: n.category })),
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading flow diagram...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">⚠️</div>
          <p className="text-gray-600">Error loading flow diagram</p>
        </div>
      </div>
    )
  }

  const nodesByCategory = nodes.reduce(
    (acc, node) => {
      if (!acc[node.category]) {
        acc[node.category] = []
      }
      acc[node.category].push(node)
      return acc
    },
    {} as Record<string, RealFlowNode[]>,
  )

  const getHealthColor = (health: string) => {
    switch (health.toLowerCase()) {
      case "healthy":
        return "bg-green-100 border-green-300 text-green-800"
      case "unknown":
        return "bg-yellow-100 border-yellow-300 text-yellow-800"
      default:
        return "bg-gray-100 border-gray-300 text-gray-800"
    }
  }

  const getTrafficColor = (isFlowing: boolean) => {
    return isFlowing ? "text-green-600" : "text-red-600"
  }

  return (
    <div className="h-auto bg-gray-50 rounded-lg border border-gray-200 p-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">US Wires Payment Flow - Complete System</h3>
        <p className="text-sm text-gray-600">All {nodes.length} system nodes organized by processing category</p>
      </div>

      {processingSections.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Processing Sections Overview</h4>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {processingSections.map((section) => (
              <div key={section.id} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="text-sm font-medium text-blue-800">{section.title}</div>
                <div className="text-xs text-blue-600 mt-1">{section.aitNumber.length} systems</div>
                <div className="text-xs text-blue-600">Avg: {section.averageThroughputTime}ms</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-6">
        {Object.entries(nodesByCategory).map(([category, categoryNodes]) => (
          <div key={category} className="border border-gray-200 rounded-lg p-4">
            <h4 className="text-md font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
              {category} ({categoryNodes.length} systems)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryNodes.map((node) => (
                <div key={node.id} className={`p-3 rounded-lg border-2 ${getHealthColor(node.systemHealth)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-semibold">{node.label}</div>
                    <div className="text-xs bg-gray-200 px-2 py-1 rounded">Step {node.step}</div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Health:</span>
                      <span className="font-medium">{node.systemHealth || "Unknown"}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Traffic:</span>
                      <span className={`font-medium ${getTrafficColor(node.isTrafficFlowing)}`}>
                        {node.isTrafficFlowing ? "Flowing" : "Not Flowing"}
                      </span>
                    </div>

                    {node.currentThruputTime30 !== undefined && (
                      <div className="flex justify-between">
                        <span>Throughput:</span>
                        <span className="font-medium">{node.currentThruputTime30}ms</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>Data Points:</span>
                      <span className="font-medium">{node.splunkDatas.length}</span>
                    </div>
                  </div>

                  {node.splunkDatas.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-300">
                      <div className="text-xs text-gray-600">
                        Latest: {node.splunkDatas[0].iS_TRAFFIC_FLOWING === "Yes" ? "✅" : "❌"}
                        {node.splunkDatas[0].iS_TRAFFIC_ON_TREND && (
                          <span className="ml-1">({node.splunkDatas[0].iS_TRAFFIC_ON_TREND})</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-gray-900">{nodes.length}</div>
            <div className="text-xs text-gray-600">Total Systems</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-green-600">
              {nodes.filter((n) => n.systemHealth === "Healthy").length}
            </div>
            <div className="text-xs text-gray-600">Healthy Systems</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-blue-600">
              {nodes.reduce((sum, n) => sum + n.splunkDatas.length, 0)}
            </div>
            <div className="text-xs text-gray-600">Total Data Points</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-purple-600">{Object.keys(nodesByCategory).length}</div>
            <div className="text-xs text-gray-600">Categories</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function MinimalFlowDiagramUsWires({ isMonitoringMode = false }: { isMonitoringMode?: boolean }) {
  const { showAmountSearchResults, amountSearchParams } = useMinimalTransactionSearchUsWiresContext()
  const [showSearchBox, setShowSearchBox] = useState(false)

  const { flowData, nodes, processingSections, isLoading, error, refetch } = useGetWiresFlow()

  const [isShowHiden, setIsShowHiden] = useState(isMonitoringMode)

  useEffect(() => {
    setIsShowHiden(isMonitoringMode)
  }, [isMonitoringMode])

  const nodeTypes = useMemo(
    () => createNodeTypes(isShowHiden, () => setShowSearchBox((prev) => !prev), nodes, isLoading, !!error),
    [isShowHiden, nodes, isLoading, error],
  )

  const handleRefetch = useCallback(() => {
    if (refetch) {
      refetch()
    }
  }, [refetch])

  return (
    <QueryClientProvider client={queryClient}>
      <ReactFlowProvider>
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="text-sm text-blue-800">
              Average Processing Time: {flowData?.averageThruputTime30 || 0}ms
            </div>
            <button
              onClick={handleRefetch}
              className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
            >
              Refresh
            </button>
          </div>
        </div>

        {showAmountSearchResults && amountSearchParams ? (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">Transaction search results would be displayed here</p>
          </div>
        ) : (
          <SimpleFlowVisualization
            nodeTypes={nodeTypes}
            nodes={nodes}
            processingSections={processingSections}
            isLoading={isLoading}
            isError={!!error}
          />
        )}
      </ReactFlowProvider>
    </QueryClientProvider>
  )
}
