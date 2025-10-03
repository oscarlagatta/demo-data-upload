import { useQuery } from "@tanstack/react-query"
import mockWiresFlowData from "./get-wires-flow.json"

interface UseGetSplunkWiresFlowOptions {
  enabled?: boolean
  isMonitored?: boolean
}

export function useGetSplunkWiresFlow(options: UseGetSplunkWiresFlowOptions) {
  const { enabled = false, isMonitored = false } = options

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["splunk-wires-flow", { isMonitored }],
    queryFn: async () => {
      console.log("[v0] useGetSplunkWiresFlow queryFn called with:", { isMonitored })

      // Simulate API delay for realistic behavior
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Filter data based on isMonitored parameter if needed
      if (isMonitored !== undefined) {
        // You can add filtering logic here based on your requirements
        // For now, return all data regardless of isMonitored value
        console.log("[v0] Returning mock data:", {
          nodeCount: mockWiresFlowData?.nodes?.length || 0,
          hasNodes: !!mockWiresFlowData?.nodes,
          firstNode: mockWiresFlowData?.nodes?.[0] || null,
          firstNodeHasAverageThruput: mockWiresFlowData?.nodes?.[0]?.averageThruputTime30 !== undefined,
          firstNodeHasSplunkData: !!mockWiresFlowData?.nodes?.[0]?.splunkDatas,
        })
        return mockWiresFlowData
      }

      console.log("[v0] Returning mock data (no filter):", {
        nodeCount: mockWiresFlowData?.nodes?.length || 0,
      })
      return mockWiresFlowData
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes,
  })

  console.log("[v0] useGetSplunkWiresFlow returning:", {
    hasData: !!data,
    isLoading,
    isError,
    nodeCount: data?.nodes?.length || 0,
  })

  return {
    data,
    isLoading,
    isError,
    error, // Keep error for detailed error information if needed
    refetch, // Now exposing refetch function for manual data refresh
  }
}
