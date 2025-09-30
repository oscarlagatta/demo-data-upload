import type { SplunkDataItem } from "../types/splunk-data-item"

export type TrafficStatusColor = "green" | "yellow" | "red" | "grey"

export interface TrafficStatusMapping {
  [aitNum: string]: TrafficStatusColor
}

/**
 * Computes traffic status colors for all AITs based on Splunk data
 *
 * New Logic:
 * - Default: Green (normal state)
 * - Yellow: If EITHER Traffic Flow is "No" OR Trend is "Off-Trend"
 * - Red: If ALL three conditions are met:
 *   1. Traffic Flow is "No" AND
 *   2. Trend is "Off-Trend" AND
 *   3. Standard Deviation > |9| (absolute value of 9)
 * - Grey: If no data available OR "No Historical Traffic" is indicated
 */
export function computeTrafficStatusColors(splunkData: SplunkDataItem[]): TrafficStatusMapping {
  const aitGroupedData: { [aitNum: string]: SplunkDataItem[] } = {}

  // Group data by aiT_NUM
  splunkData.forEach((item) => {
    const aitNum = item.aiT_NUM
    if (!aitGroupedData[aitNum]) {
      aitGroupedData[aitNum] = []
    }
    aitGroupedData[aitNum].push(item)
  })

  // Determine color for each AIT based on new aggregation logic
  const trafficStatusMapping: TrafficStatusMapping = {}

  Object.keys(aitGroupedData).forEach((aitNum) => {
    const items = aitGroupedData[aitNum]

    // Check for "No Historical Traffic" or no data
    const hasNoHistoricalTraffic = items.some((item) => item.iS_TRAFFIC_ON_TREND === "No Historical Traffic")
    const allDataMissing = items.every(
      (item) =>
        item.iS_TRAFFIC_FLOWING === null && (item.iS_TRAFFIC_ON_TREND === null || item.iS_TRAFFIC_ON_TREND === ""),
    )

    if (hasNoHistoricalTraffic || allDataMissing || items.length === 0) {
      trafficStatusMapping[aitNum] = "grey"
      return
    }

    // Check conditions across all items for this AIT
    let hasTrafficNo = false
    let hasOffTrend = false
    let hasRedCondition = false

    items.forEach((item) => {
      const trafficFlowing = item.iS_TRAFFIC_FLOWING
      const trendValue = item.iS_TRAFFIC_ON_TREND
      const stdVariation = Number.parseFloat(item.currenT_STD_VARIATION)

      // Check if traffic is not flowing
      if (trafficFlowing === "No") {
        hasTrafficNo = true
      }

      // Check if trend is off-trend (case-insensitive check for "Off-Trend")
      if (trendValue && /off-trend/i.test(trendValue)) {
        hasOffTrend = true
      }

      // Check for RED condition: Traffic No + Off-Trend + |STD| > 9
      if (
        trafficFlowing === "No" &&
        trendValue &&
        /off-trend/i.test(trendValue) &&
        !isNaN(stdVariation) &&
        Math.abs(stdVariation) > 9
      ) {
        hasRedCondition = true
      }
    })

    // Apply priority logic
    if (hasRedCondition) {
      // RED: Traffic No + Off-Trend + |STD| > 9
      trafficStatusMapping[aitNum] = "red"
    } else if (hasTrafficNo || hasOffTrend) {
      // YELLOW: Either Traffic No OR Off-Trend (but not meeting red conditions)
      trafficStatusMapping[aitNum] = "yellow"
    } else {
      // GREEN: Default state (normal operation)
      trafficStatusMapping[aitNum] = "green"
    }
  })

  return trafficStatusMapping
}

/**
 * Gets the Tailwind CSS class for a traffic status color
 */
export function getTrafficStatusColorClass(statusColor: TrafficStatusColor): string {
  switch (statusColor) {
    case "green":
      return "bg-green-500"
    case "yellow":
      return "bg-yellow-500"
    case "red":
      return "bg-red-500"
    case "grey":
    default:
      return "bg-gray-400"
  }
}
