// checked
import { MarkerType } from "@xyflow/react"

import type { AppNode } from "../types/app-node"

export const edgeStyle = { stroke: "#6b7280", strokeWidth: 2 }
export const marker = { type: MarkerType.ArrowClosed, color: "#6b7280" }

export function transformApiData(
  apiData: { nodes: any[]; edges: any[] },
  backgroundNodes: AppNode[],
  classToParentId: Record<string, string>,
  sectionPositions: Record<string, { baseX: number; positions: { x: number; y: number }[] }>,
) {
  const sectionCounters: Record<string, number> = Object.keys(sectionPositions).reduce(
    (acc, key: string) => ({ ...acc, [key]: 0 }),
    {},
  )

  const transformedNodes: AppNode[] = apiData.nodes
    .map((apiNode): AppNode | null => {
      const parentId = classToParentId[apiNode.class]
      if (!parentId) return null

      const sectionConfig = sectionPositions[parentId]
      const positionIndex = sectionCounters[parentId]++
      const position = sectionConfig.positions[positionIndex] || {
        x: sectionConfig.baseX,
        y: 100 + positionIndex * 120,
      }

      return {
        id: apiNode.id,
        type: "custom" as const,
        position,
        data: {
          title: apiNode.data.label,
          subtext: `AIT ${apiNode.id}`,
        },
        parentId: parentId,
        extent: "parent" as const,
      }
    })
    .filter((n): n is AppNode => n !== null)

  const transformedEdges = apiData.edges.flatMap((apiEdge) => {
    const { source, target } = apiEdge
    if (Array.isArray(target)) {
      return target.map((t) => ({
        id: `${source}-${t}`,
        source,
        target: t,
        type: "smoothstep",
        style: edgeStyle,
        markerEnd: marker,
      }))
    } else {
      return [
        {
          ...apiEdge,
          target: target,
          type: "smoothstep",
          style: edgeStyle,
          markerEnd: marker,
        },
      ]
    }
  })

  return {
    nodes: [...backgroundNodes, ...transformedNodes],
    edges: transformedEdges,
  }
}

interface ApiData {
  nodes: ApiNode[]
  systemConnections: SystemConnection[]
}

interface ApiNode {
  id: string
  label: string
  category?: string
  systemHealth?: string
  isTrafficFlowing?: boolean
  currentThruputTime30?: number
  averageThruputTime30?: number
  splunkDatas?: any[]
  step?: number
}

interface SystemConnection {
  source: string
  target: string | string[]
}

export function transformEnhancedApiData(
  apiData: ApiData,
  backgroundNodes: AppNode[],
  classToParentId: Record<string, string>,
  sectionPositions: Record<string, { baseX: number; positions: { x: number; y: number }[] }>,
) {
  console.log("[v0] transformEnhancedApiData called with:", {
    nodeCount: apiData.nodes?.length || 0,
    connectionCount: apiData.systemConnections?.length || 0,
    backgroundNodeCount: backgroundNodes.length,
    classToParentIdKeys: Object.keys(classToParentId),
    sectionPositionKeys: Object.keys(sectionPositions),
  })

  const sectionCounters: Record<string, number> = Object.keys(sectionPositions).reduce(
    (acc, key: string) => ({ ...acc, [key]: 0 }),
    {},
  )

  const transformedNodes: AppNode[] = apiData.nodes
    .map((apiNode: ApiNode, index: number): AppNode | null => {
      console.log(`[v0] Processing node ${index + 1}/${apiData.nodes.length}:`, {
        id: apiNode.id,
        label: apiNode.label,
        category: apiNode.category,
        hasAverageThruputTime30: apiNode.averageThruputTime30 !== undefined,
        averageThruputTime30Value: apiNode.averageThruputTime30,
        hasSplunkData: !!apiNode.splunkDatas,
        splunkDataCount: apiNode.splunkDatas?.length || 0,
      })

      let parentId: string | null = null

      if (apiNode.category) {
        // First try the direct mapping with lowercase category
        const categoryKey = apiNode.category.toLowerCase()
        parentId = classToParentId[categoryKey] || getCategoryParentId(apiNode.category)
      }

      if (!parentId) {
        console.warn(
          `[v0] ❌ No parent ID found for node ${apiNode.id} with category: ${apiNode.category || "undefined"}`,
        )
        return null
      }

      const sectionConfig = sectionPositions[parentId]
      if (!sectionConfig) {
        console.warn(`[v0] ❌ No section config found for parentId: ${parentId}`)
        return null
      }

      const positionIndex = sectionCounters[parentId]++
      const position = sectionConfig.positions[positionIndex] || {
        x: sectionConfig.baseX,
        y: 100 + positionIndex * 120,
      }

      const flowClass = computeFlowClass(apiNode.splunkDatas)
      const trendClass = computeTrendClass(apiNode.splunkDatas)
      const balancedClass = computeBalancedClass(apiNode.splunkDatas)

      console.log(`[v0] ✅ Node ${apiNode.id} computed classes:`, {
        flowClass,
        trendClass,
        balancedClass,
        averageThruputTime30: apiNode.averageThruputTime30,
      })

      return {
        id: apiNode.id,
        type: "custom" as const,
        position,
        data: {
          title: apiNode.label,
          subtext: `AIT ${apiNode.id}`,
          systemHealth: apiNode.systemHealth,
          isTrafficFlowing: apiNode.isTrafficFlowing,
          currentThruputTime30: apiNode.currentThruputTime30,
          averageThruputTime30: apiNode.averageThruputTime30,
          splunkDatas: apiNode.splunkDatas,
          step: apiNode.step,
          flowClass,
          trendClass,
          balancedClass,
        },
        parentId: parentId,
        extent: "parent" as const,
      }
    })
    .filter((n): n is AppNode => n !== null)

  console.log("[v0] Transformation complete:", {
    totalNodesTransformed: transformedNodes.length,
    totalNodesWithBackground: transformedNodes.length + backgroundNodes.length,
    sampleNodeData: transformedNodes[0]?.data || null,
  })

  const edgeSet = new Set<string>()
  const transformedEdges = apiData.systemConnections.flatMap((connection: SystemConnection) => {
    const { source, target } = connection
    if (Array.isArray(target)) {
      return target
        .map((t) => {
          const edgeId = `${source}-${t}`
          const reverseEdgeId = `${t}-${source}`

          // Skip if reverse edge already exists
          if (edgeSet.has(reverseEdgeId)) {
            return null
          }

          edgeSet.add(edgeId)
          return {
            id: edgeId,
            source,
            target: t,
            type: "smoothstep",
            style: edgeStyle,
            markerEnd: marker,
          }
        })
        .filter((edge): edge is NonNullable<typeof edge> => edge !== null)
    } else {
      const edgeId = `${source}-${target}`
      const reverseEdgeId = `${target}-${source}`

      // Skip if reverse edge already exists
      if (edgeSet.has(reverseEdgeId)) {
        return []
      }

      edgeSet.add(edgeId)
      return [
        {
          id: edgeId,
          source,
          target: target as string,
          type: "smoothstep",
          style: edgeStyle,
          markerEnd: marker,
        },
      ]
    }
  })

  return {
    nodes: [...backgroundNodes, ...transformedNodes],
    edges: transformedEdges,
  }
}

export function getCategoryParentId(category: string | undefined): string | null {
  if (!category || typeof category !== "string") {
    return null
  }

  const categoryMap: Record<string, string> = {
    origination: "bg-origination",
    "payment validation and routing": "bg-validation",
    middleware: "bg-middleware",
    "payment processing, sanctions & investigation": "bg-processing",
  }

  return categoryMap[category.toLowerCase()] || null
}

function computeFlowClass(splunkDatas?: any[]): string {
  console.log("[v0] computeFlowClass called with:", {
    hasSplunkData: !!splunkDatas,
    splunkDataCount: splunkDatas?.length || 0,
  })

  if (!splunkDatas || splunkDatas.length === 0) {
    console.log("[v0] computeFlowClass result: bg-gray-400 (no data)")
    return "bg-gray-400"
  }

  // Check for "No Historical Traffic" or no data
  const hasNoHistoricalTraffic = splunkDatas.some((item) => item.iS_TRAFFIC_ON_TREND === "No Historical Traffic")
  const allDataMissing = splunkDatas.every(
    (item) =>
      item.iS_TRAFFIC_FLOWING === null && (item.iS_TRAFFIC_ON_TREND === null || item.iS_TRAFFIC_ON_TREND === ""),
  )

  if (hasNoHistoricalTraffic || allDataMissing) {
    console.log("[v0] computeFlowClass result: bg-gray-400 (no historical traffic or all data missing)")
    return "bg-gray-400"
  }

  // Check conditions for traffic status
  let hasTrafficNo = false
  let hasOffTrend = false
  let hasRedCondition = false

  splunkDatas.forEach((item) => {
    const trafficFlowing = item.iS_TRAFFIC_FLOWING
    const trendValue = item.iS_TRAFFIC_ON_TREND
    const stdVariation = Number.parseFloat(item.currenT_STD_VARIATION)

    if (trafficFlowing === "No") {
      hasTrafficNo = true
    }

    if (trendValue && /off-trend/i.test(trendValue)) {
      hasOffTrend = true
    }

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

  if (hasRedCondition) {
    console.log("[v0] computeFlowClass result: bg-red-500 (red condition)")
    return "bg-red-500"
  } else if (hasTrafficNo || hasOffTrend) {
    console.log("[v0] computeFlowClass result: bg-yellow-500 (warning)")
    return "bg-yellow-500"
  } else {
    console.log("[v0] computeFlowClass result: bg-green-500 (healthy)")
    return "bg-green-500"
  }
}

function computeTrendClass(splunkDatas?: any[]): string {
  console.log("[v0] computeTrendClass called with:", {
    hasSplunkData: !!splunkDatas,
    splunkDataCount: splunkDatas?.length || 0,
  })

  if (!splunkDatas || splunkDatas.length === 0) {
    console.log("[v0] computeTrendClass result: bg-gray-400 (no data)")
    return "bg-gray-400"
  }

  const classifications: ("green" | "yellow" | "red")[] = []

  splunkDatas.forEach((item) => {
    const stdVariation = Number.parseFloat(item.currenT_STD_VARIATION)

    if (!isNaN(stdVariation)) {
      if (stdVariation >= -20 && stdVariation <= -6) {
        classifications.push("green")
      } else if (stdVariation > 30 || (stdVariation >= -10 && stdVariation <= -6)) {
        classifications.push("yellow")
      } else if (stdVariation < -10) {
        classifications.push("red")
      }
    }
  })

  if (classifications.length === 0) {
    console.log("[v0] computeTrendClass result: bg-gray-400 (default)")
    return "bg-gray-400"
  }

  const hasRed = classifications.includes("red")
  const hasYellow = classifications.includes("yellow")
  const allGreen = classifications.every((c) => c === "green")

  if (hasRed) {
    console.log("[v0] computeTrendClass result: bg-red-500")
    return "bg-red-500"
  } else if (hasYellow) {
    console.log("[v0] computeTrendClass result: bg-yellow-500")
    return "bg-yellow-500"
  } else if (allGreen) {
    console.log("[v0] computeTrendClass result: bg-green-500")
    return "bg-green-500"
  }

  console.log("[v0] computeTrendClass result: bg-gray-400 (default)")
  return "bg-gray-400"
}

// This combines both traffic status and trend to show overall health
function computeBalancedClass(splunkDatas?: any[]): string {
  console.log("[v0] computeBalancedClass called")

  if (!splunkDatas || splunkDatas.length === 0) {
    console.log("[v0] computeBalancedClass result: bg-gray-400 (no data)")
    return "bg-gray-400"
  }

  const flowClass = computeFlowClass(splunkDatas)
  const trendClass = computeTrendClass(splunkDatas)

  console.log("[v0] computeBalancedClass combining:", { flowClass, trendClass })

  // If either is red, balanced is red
  if (flowClass === "bg-red-500" || trendClass === "bg-red-500") {
    console.log("[v0] computeBalancedClass result: bg-red-500")
    return "bg-red-500"
  }

  // If either is yellow, balanced is yellow
  if (flowClass === "bg-yellow-500" || trendClass === "bg-yellow-500") {
    console.log("[v0] computeBalancedClass result: bg-yellow-500")
    return "bg-yellow-500"
  }

  // If both are green, balanced is green
  if (flowClass === "bg-green-500" && trendClass === "bg-green-500") {
    console.log("[v0] computeBalancedClass result: bg-green-500")
    return "bg-green-500"
  }

  console.log("[v0] computeBalancedClass result: bg-gray-400 (default)")
  return "bg-gray-400"
}
