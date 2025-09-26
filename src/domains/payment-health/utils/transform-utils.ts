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
        markerStart: marker,
        markerEnd: marker,
      }))
    } else {
      return [
        {
          ...apiEdge,
          target: target,
          type: "smoothstep",
          style: edgeStyle,
          markerStart: marker,
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

  const transformedEdges = apiData.systemConnections.flatMap((connection: SystemConnection) => {
    const { source, target } = connection
    if (Array.isArray(target)) {
      return target.map((t) => ({
        id: `${source}-${t}`,
        source,
        target: t,
        type: "smoothstep",
        style: edgeStyle,
        markerStart: marker,
        markerEnd: marker,
      }))
    } else {
      return [
        {
          id: `${source}-${target}`,
          source,
          target: target as string,
          type: "smoothstep",
          style: edgeStyle,
          markerStart: marker,
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
