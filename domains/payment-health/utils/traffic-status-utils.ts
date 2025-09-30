// Minimal traffic status utilities
export interface TrafficStatusData {
  aitNum?: string
  status?: string
  count?: number
}

export function computeTrafficStatusColors(data: TrafficStatusData[]): Record<string, string> {
  const statusColors: Record<string, string> = {}

  if (!data || !Array.isArray(data)) {
    return statusColors
  }

  data.forEach((item) => {
    if (item.aitNum) {
      // Simple logic: green for normal, red for errors, gray for unknown
      const count = item.count || 0
      if (count > 100) {
        statusColors[item.aitNum] = "red"
      } else if (count > 0) {
        statusColors[item.aitNum] = "green"
      } else {
        statusColors[item.aitNum] = "gray"
      }
    }
  })

  return statusColors
}

export function getTrafficStatus(data: TrafficStatusData[]): string {
  if (!data || data.length === 0) return "unknown"

  const hasErrors = data.some((item) => (item.count || 0) > 100)
  if (hasErrors) return "error"

  const hasTraffic = data.some((item) => (item.count || 0) > 0)
  if (hasTraffic) return "healthy"

  return "no-traffic"
}
