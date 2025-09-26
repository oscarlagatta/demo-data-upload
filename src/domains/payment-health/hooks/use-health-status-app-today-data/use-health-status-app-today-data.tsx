import { useQuery } from "@tanstack/react-query"

/**
 * Interface for health status timing data
 */
interface HealthStatusData {
  totalAverageProcessingTime: number
  sectionTimings: {
    [sectionId: string]: {
      duration: number
      trend: "up" | "down" | "stable"
    }
  }
}

/**
 * Hook to fetch current health status and timing data
 * This replaces the hardcoded timing values in the main component
 */
export function useHealthStatusAppTodayData() {
  return useQuery({
    queryKey: ["health-status-app-today"],
    queryFn: async (): Promise<HealthStatusData> => {
      // Simulate API call - replace with actual endpoint
      await new Promise((resolve) => setTimeout(resolve, 100))

      // Return timing data that matches the system's needs
      return {
        totalAverageProcessingTime: 9.3, // Total time across all sections
        sectionTimings: {
          "bg-origination": {
            duration: 1.2,
            trend: "stable",
          },
          "bg-validation": {
            duration: 2.8,
            trend: "up",
          },
          "bg-middleware": {
            duration: 1.9,
            trend: "stable",
          },
          "bg-processing": {
            duration: 3.4,
            trend: "down",
          },
        },
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 30 * 1000, // Refresh every 30 seconds
  })
}
