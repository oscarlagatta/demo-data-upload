// Minimal flow layout utilities
export interface FlowNode {
  id: string
  position: { x: number; y: number }
  data?: any
  type?: string
}

export function updateNodePositions(currentNodes: FlowNode[], flowNodes: FlowNode[], canvasWidth: number): FlowNode[] {
  if (!currentNodes || !flowNodes || canvasWidth <= 0) {
    return currentNodes
  }

  // Simple layout: distribute nodes evenly across the width
  const nodeSpacing = Math.max(200, canvasWidth / Math.max(flowNodes.length, 1))

  return currentNodes.map((node, index) => {
    const baseX = index * nodeSpacing + 100
    const baseY = 100 + (index % 2) * 150 // Stagger vertically

    return {
      ...node,
      position: {
        x: Math.min(baseX, canvasWidth - 200), // Keep within bounds
        y: baseY,
      },
    }
  })
}

export function calculateCanvasHeight(nodes: FlowNode[]): number {
  if (!nodes || nodes.length === 0) {
    return 500 // Default height
  }

  // Find the maximum Y position and add padding
  const maxY = Math.max(...nodes.map((node) => node.position?.y || 0))
  return Math.max(500, maxY + 300) // Minimum 500px, or maxY + padding
}
