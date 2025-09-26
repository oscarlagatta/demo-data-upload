import type { AppNode } from "../../types/app-node"
import { classToParentId } from "@/domains/payment-health/utils/shared-mappings"
import { useGetSplunkWiresFlow } from "@/domains/payment-health/hooks/use-get-splunk-us-wires/get-wires-flow"

/**
 * Enhanced hook that provides flow data using backend configuration
 * Now uses the unified flow data source with comprehensive timing integration
 */
export function useFlowDataBackEnd() {
  const {
    data: flowData,
    isLoading,
    isError, // Use isError instead of error for consistency
  } = useGetSplunkWiresFlow({
    enabled: true,
    isMonitored: false,
  })

  const sectionTimings =
    flowData?.processingSections?.reduce(
      (acc, section) => ({
        ...acc,
        [section.id]: {
          duration: section.averageThroughputTime || 0,
          trend: "stable" as const, // Could be enhanced with trend calculation
        },
      }),
      {} as Record<string, { duration: number; trend: "up" | "down" | "stable" }>,
    ) || {}

  const totalProcessingTime =
    flowData?.averageThruputTime30 || Object.values(sectionTimings).reduce((sum, section) => sum + section.duration, 0)

  const backgroundNodes: AppNode[] =
    flowData?.layOutConfig?.map((config) => ({
      id: config.id,
      type: config.type as "background",
      position: config.position,
      data: {
        title: config.data.title,
        duration: sectionTimings[config.id]?.duration || 0,
        trend: sectionTimings[config.id]?.trend || "stable",
      },
      draggable: config.draggable,
      selectable: config.selectable,
      zIndex: config.zIndex,
      style: config.style,
    })) || []

  const sectionPositions: Record<string, { baseX: number; positions: { x: number; y: number }[] }> =
    flowData?.layOutConfig?.reduce(
      (acc, config) => {
        // Extract section positions from the config
        const sections = config.sectionPositions?.sections || {}

        // Merge all sections into the accumulator
        Object.entries(sections).forEach(([sectionId, sectionData]) => {
          acc[sectionId] = {
            baseX: sectionData.baseX,
            positions: sectionData.positions,
          }
        })

        return acc
      },
      {} as Record<string, { baseX: number; positions: { x: number; y: number }[] }>,
    ) || {}

  const transformedData = flowData
    ? transformEnhancedApiData(flowData, backgroundNodes, classToParentId, sectionPositions)
    : { nodes: [], edges: [] }

  return {
    nodes: transformedData.nodes,
    edges: transformedData.edges,
    isLoading,
    isError, // Return isError instead of error
    backgroundNodes,
    sectionPositions,
    sectionTimings,
    totalProcessingTime,
    splunkData: flowData?.nodes || [],
  }
}

function transformEnhancedApiData(
  apiData: any, // New flow data structure
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
      // Map category to parent ID
      const parentId = classToParentId[apiNode.category?.toLowerCase()] || getCategoryParentId(apiNode.category)

      if (!parentId) return null

      const sectionConfig = sectionPositions[parentId]
      if (!sectionConfig) return null

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
          title: apiNode.label,
          subtext: `AIT ${apiNode.id}`,
          systemHealth: apiNode.systemHealth,
          isTrafficFlowing: apiNode.isTrafficFlowing,
          currentThruputTime30: apiNode.currentThruputTime30,
          averageThruputTime30: apiNode.averageThruputTime30,
          splunkDatas: apiNode.splunkDatas,
          step: apiNode.step,
        },
        parentId: parentId,
        extent: "parent" as const,
      }
    })
    .filter((n): n is AppNode => n !== null)

  const transformedEdges = apiData.systemConnections.flatMap((connection) => {
    const { source, target } = connection
    if (Array.isArray(target)) {
      return target.map((t) => ({
        id: `${source}-${t}`,
        source,
        target: t,
        type: "smoothstep",
        style: { stroke: "#6b7280", strokeWidth: 2 },
        markerStart: { type: "ArrowClosed", color: "#6b7280" },
        markerEnd: { type: "ArrowClosed", color: "#6b7280" },
      }))
    } else {
      return [
        {
          id: `${source}-${target}`,
          source,
          target: target as string,
          type: "smoothstep",
          style: { stroke: "#6b7280", strokeWidth: 2 },
          markerStart: { type: "ArrowClosed", color: "#6b7280" },
          markerEnd: { type: "ArrowClosed", color: "#6b7280" },
        },
      ]
    }
  })

  return {
    nodes: [...backgroundNodes, ...transformedNodes],
    edges: transformedEdges,
  }
}

function getCategoryParentId(category: string): string | null {
  const categoryMap: Record<string, string> = {
    origination: "bg-origination",
    "payment validation and routing": "bg-validation",
    middleware: "bg-middleware",
    "payment processing, sanctions & investigation": "bg-processing",
  }

  return categoryMap[category?.toLowerCase()] || null
}

// Export the initial nodes and edges for backward compatibility
// These will be empty arrays until the hook data is loaded
export const { nodes: initialNodes, edges: initialEdges } = { nodes: [], edges: [] }
