import { useQuery } from "@tanstack/react-query"
import mockWiresFlowData from "./get-wires-flow.json"

interface UseGetSplunkWiresFlowOptions {
  enabled?: boolean
  isMonitored?: boolean
}

export function useGetSplunkWiresFlow(options: UseGetSplunkWiresFlowOptions) {
  const { enabled = false, isMonitored = false } = options

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["splunk-wires-flow", { isMonitored }],
    queryFn: async () => {
      // Simulate API delay for realistic behavior
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Filter data based on isMonitored parameter if needed
      if (isMonitored !== undefined) {
        // You can add filtering logic here based on your requirements
        // For now, return all data regardless of isMonitored value
        return mockWiresFlowData
      }

      return mockWiresFlowData
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes,
  })

  return {
    data,
    isLoading,
    isError,
    error, // Keep error for detailed error information if needed
  }
}
