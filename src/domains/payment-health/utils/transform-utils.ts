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
  nodeId?: number
  systemHealth?: string
  isTrafficFlowing?: boolean
  currentThroughputTime?: number
  currentThruputTime30?: number
  averageThroughputTime30?: number
  averageThruputTime30?: number
  flowClass?: string
  trendClass?: string
  balancedClass?: string | null
  descriptions?: string
  height?: number
  width?: number
  xPosition?: number
  yPosition?: number
  splunkDatas?: any[]
  step?: number
}

interface SystemConnection {
  source: string
  target: string | string[]
  systemId?: number
  label?: string | null
  sourceHandle?: string
  targetHandle?: string
}

/**
 * Transforms enhanced API data into React Flow compatible format
 * Handles comprehensive node properties including styling, positioning, and performance metrics
 * Now includes nodeId for nodes and systemId for connections
 *
 * @param apiData - Raw API data containing nodes and system connections
 * @param backgroundNodes - Pre-created background section nodes
 * @param classToParentId - Mapping of node categories to parent section IDs
 * @param sectionPositions - Position configuration for nodes within sections
 * @returns Object containing transformed nodes and edges for React Flow
 */
export function transformEnhancedApiData(
  apiData: ApiData,
  backgroundNodes: AppNode[],
  classToParentId: Record<string, string>,
  sectionPositions: Record<string, { baseX: number; positions: { x: number; y: number }[] }>,
) {
  const sectionCounters: Record<string, number> = Object.keys(sectionPositions).reduce(
    (acc, key: string) => ({ ...acc, [key]: 0 }),
    {},
  )

  const transformedNodes: AppNode[] = apiData.nodes
    .map((apiNode: ApiNode): AppNode | null => {
      let parentId: string | null = null

      if (apiNode.category) {
        // First try the direct mapping with lowercase category
        const categoryKey = apiNode.category.toLowerCase()
        parentId = classToParentId[categoryKey] || getCategoryParentId(apiNode.category)
      }

      if (!parentId) {
        console.warn(`No parent ID found for node ${apiNode.id} with category: ${apiNode.category || "undefined"}`)
        return null
      }

      const sectionConfig = sectionPositions[parentId]
      if (!sectionConfig) return null

      const positionIndex = sectionCounters[parentId]++

      const position =
        apiNode.xPosition !== undefined && apiNode.yPosition !== undefined
          ? { x: apiNode.xPosition, y: apiNode.yPosition }
          : sectionConfig.positions[positionIndex] || {
              x: sectionConfig.baseX,
              y: 100 + positionIndex * 120,
            }

      const currentThroughputTime = apiNode.currentThroughputTime ?? apiNode.currentThruputTime30
      const averageThroughputTime = apiNode.averageThroughputTime30 ?? apiNode.averageThruputTime30

      return {
        id: apiNode.id,
        type: "custom" as const,
        position,
        data: {
          title: apiNode.label,
          subtext: `AIT ${apiNode.id}`,
          nodeId: apiNode.nodeId,
          flowClass: apiNode.flowClass,
          trendClass: apiNode.trendClass,
          balancedClass: apiNode.balancedClass,
          systemHealth: apiNode.systemHealth,
          isTrafficFlowing: apiNode.isTrafficFlowing,
          currentThroughputTime,
          averageThroughputTime,
          currentThruputTime30: currentThroughputTime,
          averageThruputTime30: averageThroughputTime,
          descriptions: apiNode.descriptions,
          height: apiNode.height,
          width: apiNode.width,
          splunkDatas: apiNode.splunkDatas,
          step: apiNode.step,
        },
        parentId: parentId,
        extent: "parent" as const,
        style:
          apiNode.width || apiNode.height
            ? {
                width: apiNode.width,
                height: apiNode.height,
              }
            : undefined,
      }
    })
    .filter((n): n is AppNode => n !== null)

  const detailedConnections: DetailedConnection[] = []

  apiData.systemConnections.forEach((connection: SystemConnection) => {
    const { source, target, systemId, label, sourceHandle, targetHandle } = connection

    // Normalize handles to lowercase for consistent matching
    const normalizedSourceHandle = normalizeHandle(sourceHandle)
    const normalizedTargetHandle = normalizeHandle(targetHandle)

    if (Array.isArray(target)) {
      // Handle multiple targets from a single source
      target.forEach((t) => {
        detailedConnections.push({
          id: `${source}-${t}`,
          sourceNodeId: source,
          targetNodeId: t,
          sourceHandle: normalizedSourceHandle,
          targetHandle: normalizedTargetHandle,
          systemId,
          label,
        })
      })
    } else {
      // Single target connection
      detailedConnections.push({
        id: `${source}-${target}`,
        sourceNodeId: source,
        targetNodeId: target,
        sourceHandle: normalizedSourceHandle,
        targetHandle: normalizedTargetHandle,
        systemId,
        label,
      })
    }
  })

  const edgeSet = new Set<string>()
  const transformedEdges = detailedConnections
    .map((connection) => {
      const { id, sourceNodeId, targetNodeId, sourceHandle, targetHandle, systemId, label } = connection

      // Check for duplicate or reverse edges
      const reverseEdgeId = `${targetNodeId}-${sourceNodeId}`

      if (edgeSet.has(reverseEdgeId)) {
        console.log(`[v0] Skipping duplicate edge: ${id} (reverse exists: ${reverseEdgeId})`)
        return null
      }

      edgeSet.add(id)

      console.log(`[v0] Creating edge: ${id} with handles ${sourceHandle} -> ${targetHandle}`)

      return {
        id,
        source: sourceNodeId,
        target: targetNodeId,
        sourceHandle, // Normalized to lowercase
        targetHandle, // Normalized to lowercase
        type: "smoothstep",
        style: edgeStyle,
        markerEnd: marker,
        data: {
          systemId,
          label,
          sourceNodeId,
          targetNodeId,
          sourceHandle, // Include in data for reference
          targetHandle, // Include in data for reference
        },
      }
    })
    .filter((edge): edge is NonNullable<typeof edge> => edge !== null)

  return {
    nodes: [...backgroundNodes, ...transformedNodes],
    edges: transformedEdges,
  }
}

// Normalizes handle position strings to lowercase for consistent matching
// Handles variations like "Right" -> "right", "Left" -> "left", etc.
function normalizeHandle(handle: string | undefined): string {
  if (!handle) return "right" // Default to right if not specified
  return handle.toLowerCase()
}

/**
 * Creates a detailed connection object with normalized handles and node references
 */
interface DetailedConnection {
  id: string
  sourceNodeId: string
  targetNodeId: string
  sourceHandle: string
  targetHandle: string
  systemId?: number
  label?: string | null
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
