import type { AppNode } from "../../types/app-node"
import { classToParentId } from "@/domains/payment-health/utils/shared-mappings"
import { transformApiData } from "@/domains/payment-health/utils/transform-utils"
import { useGetSystemFlowData } from "@/domains/payment-health/hooks/use-get-system-flow-data/get-system-flow-data"

import apiData from "./us-wires-data.json"

/**
 * Custom hook that provides flow data using backend configuration
 * This hook reads the LayOutConfig from useGetSystemFlowData and constructs
 * backgroundNodes and sectionPositions dynamically
 */
export function useFlowDataBackEnd() {
  const { data: systemFlowData, isLoading, error } = useGetSystemFlowData()

  // Construct backgroundNodes from layOutConfig
  const backgroundNodes: AppNode[] =
    systemFlowData?.layOutConfig?.map((config) => ({
      id: config.id,
      type: config.type as "background",
      position: config.position,
      data: config.data,
      draggable: config.draggable,
      selectable: config.selectable,
      zIndex: config.zIndex,
      style: config.style,
    })) || []

  // Construct sectionPositions from layOutConfig
  const sectionPositions: Record<string, { baseX: number; positions: { x: number; y: number }[] }> =
    systemFlowData?.layOutConfig?.reduce(
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

  // Transform the data using the constructed backgroundNodes and sectionPositions
  const transformedData = systemFlowData
    ? transformApiData(apiData, backgroundNodes, classToParentId, sectionPositions)
    : { nodes: [], edges: [] }

  return {
    nodes: transformedData.nodes,
    edges: transformedData.edges,
    isLoading,
    error,
    backgroundNodes,
    sectionPositions,
  }
}

// Export the initial nodes and edges for backward compatibility
// These will be empty arrays until the hook data is loaded
export const { nodes: initialNodes, edges: initialEdges } = { nodes: [], edges: [] }
