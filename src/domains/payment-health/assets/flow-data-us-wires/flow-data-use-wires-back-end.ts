import type { AppNode } from "../../types/app-node"
import type { SectionTiming, SectionPositions } from "../../types/api-flow-data"
import { classToParentId } from "@/domains/payment-health/utils/shared-mappings"
import { transformEnhancedApiData } from "@/domains/payment-health/utils/transform-utils"
import { useGetSplunkWiresFlow } from "@/domains/payment-health/hooks/use-get-splunk-us-wires/get-wires-flow"

/**
 * Enhanced hook that provides flow data using backend configuration
 * Now uses the unified flow data source with comprehensive timing integration
 */
export function useFlowDataBackEnd() {
  const {
    data: flowData,
    isLoading,
    isError,
  } = useGetSplunkWiresFlow({
    enabled: true,
    isMonitored: false,
  })

  const sectionTimings: Record<string, SectionTiming> = Object.fromEntries(
    flowData?.processingSections?.map((section) => [
      section.id,
      {
        duration: section.averageThroughputTime || 0,
        trend: "stable" as const,
      },
    ]) || [],
  )

  const totalProcessingTime =
    flowData?.averageThruputTime30 || Object.values(sectionTimings).reduce((sum, section) => sum + section.duration, 0)

  const backgroundNodes: AppNode[] =
    flowData?.layOutConfig?.map((config) => ({
      id: config.id,
      type: "background" as const,
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

  const sectionPositions: Record<string, SectionPositions> = Object.fromEntries(
    flowData?.layOutConfig?.map((config) => [config.id, config.sectionPositions.sections[config.id]]) || [],
  )

  const transformedData = flowData
    ? transformEnhancedApiData(flowData, backgroundNodes, classToParentId, sectionPositions)
    : { nodes: [], edges: [] }

  return {
    nodes: transformedData.nodes,
    edges: transformedData.edges,
    isLoading,
    isError,
    backgroundNodes,
    sectionPositions,
    sectionTimings,
    totalProcessingTime,
    splunkData: flowData?.nodes || [],
  }
}

// Export the initial nodes and edges for backward compatibility
export const { nodes: initialNodes, edges: initialEdges } = { nodes: [], edges: [] }
