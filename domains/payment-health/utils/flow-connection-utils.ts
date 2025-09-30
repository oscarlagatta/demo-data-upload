// Minimal flow connection utilities
export interface FlowEdge {
  id: string
  source: string
  target: string
}

export interface FlowNode {
  id: string
  data?: {
    title?: string
    label?: string
  }
}

export function findNodeConnections(nodeId: string, edges: FlowEdge[]) {
  const connectedNodes = new Set<string>()
  const connectedEdges = new Set<string>()

  if (!edges || !nodeId) {
    return { connectedNodes, connectedEdges }
  }

  edges.forEach((edge) => {
    if (edge.source === nodeId || edge.target === nodeId) {
      connectedEdges.add(edge.id)

      // Add the connected node (not the current node)
      if (edge.source === nodeId) {
        connectedNodes.add(edge.target)
      } else {
        connectedNodes.add(edge.source)
      }
    }
  })

  return { connectedNodes, connectedEdges }
}

export function getConnectedSystemNames(connectedNodeIds: Set<string>, nodes: FlowNode[]): string[] {
  if (!nodes || connectedNodeIds.size === 0) {
    return []
  }

  return Array.from(connectedNodeIds)
    .map((nodeId) => {
      const node = nodes.find((n) => n.id === nodeId)
      return node?.data?.title || node?.data?.label || `System ${nodeId}`
    })
    .filter(Boolean)
}
