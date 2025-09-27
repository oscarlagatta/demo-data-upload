import type { Edge } from "@xyflow/react"

export interface ConnectionResult {
  connectedNodes: Set<string>
  connectedEdges: Set<string>
}

/**
 * Finds all nodes and edges connected to a given node
 */
export const findNodeConnections = (nodeId: string, edges: Edge[]): ConnectionResult => {
  const connectedNodes = new Set<string>()
  const connectedEdges = new Set<string>()

  edges.forEach((edge) => {
    if (edge.source === nodeId || edge.target === nodeId) {
      connectedEdges.add(edge.id)
      if (edge.source === nodeId) {
        connectedNodes.add(edge.target)
      }
      if (edge.target === nodeId) {
        connectedNodes.add(edge.source)
      }
    }
  })

  return { connectedNodes, connectedEdges }
}

/**
 * Gets the display names of connected systems
 */
export const getConnectedSystemNames = (connectedNodeIds: Set<string>, nodes: any[]): string[] => {
  return Array.from(connectedNodeIds)
    .map((nodeId) => {
      const node = nodes.find((n) => n.id === nodeId)
      return node?.data?.["title"] || nodeId
    })
    .sort()
}
