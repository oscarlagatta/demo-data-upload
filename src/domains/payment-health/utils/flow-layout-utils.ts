import type { Node } from "@xyflow/react"

export const SECTION_IDS = ["bg-origination", "bg-validation", "bg-middleware", "bg-processing"]
export const SECTION_WIDTH_PROPORTIONS = [0.2, 0.2, 0.25, 0.35]
export const GAP_WIDTH = 16

export const sectionDurations = {
  "bg-origination": 1.2,
  "bg-validation": 2.8,
  "bg-middleware": 1.9,
  "bg-processing": 3.4,
}

export interface SectionDimensions {
  x: number
  width: number
}

/**
 * Calculates section dimensions based on available width and proportions
 */
export const calculateSectionDimensions = (availableWidth: number): Record<string, SectionDimensions> => {
  const totalGapWidth = GAP_WIDTH * (SECTION_IDS.length - 1)
  const usableWidth = availableWidth - totalGapWidth
  let currentX = 0
  const dimensions: Record<string, SectionDimensions> = {}

  for (let i = 0; i < SECTION_IDS.length; i++) {
    const sectionId = SECTION_IDS[i]
    const sectionWidth = usableWidth * SECTION_WIDTH_PROPORTIONS[i]
    dimensions[sectionId] = { x: currentX, width: sectionWidth }
    currentX += sectionWidth + GAP_WIDTH
  }

  return dimensions
}

/**
 * Updates node positions based on canvas width and section proportions
 */
export const updateNodePositions = (currentNodes: Node[], flowNodes: Node[], width: number): Node[] => {
  if (width <= 0 || flowNodes.length === 0) return currentNodes

  const sectionDimensions = calculateSectionDimensions(width)
  const newNodes = [...currentNodes]

  // Update section background nodes
  for (let i = 0; i < SECTION_IDS.length; i++) {
    const sectionId = SECTION_IDS[i]
    const nodeIndex = newNodes.findIndex((n) => n.id === sectionId)

    if (nodeIndex !== -1 && sectionDimensions[sectionId]) {
      const { x, width: sectionWidth } = sectionDimensions[sectionId]
      newNodes[nodeIndex] = {
        ...newNodes[nodeIndex],
        position: { x, y: 0 },
        style: {
          ...newNodes[nodeIndex].style,
          width: `${sectionWidth}px`,
        },
      }
    }
  }

  // Update child nodes relative to their parents
  for (let i = 0; i < newNodes.length; i++) {
    const node = newNodes[i]
    if (node.parentId && sectionDimensions[node.parentId]) {
      const parentDimensions = sectionDimensions[node.parentId]
      const originalNode = flowNodes.find((n) => n.id === node.id)
      const originalParent = flowNodes.find((n) => n.id === node.parentId)

      if (originalNode && originalParent && originalParent.style?.width) {
        const originalParentWidth = Number.parseFloat(originalParent.style.width as string)
        const originalRelativeXOffset = originalNode.position.x - originalParent.position.x
        const newAbsoluteX =
          parentDimensions.x + (originalRelativeXOffset / originalParentWidth) * parentDimensions.width

        newNodes[i] = {
          ...node,
          position: {
            x: newAbsoluteX,
            y: node.position.y,
          },
        }
      }
    }
  }

  return newNodes
}

/**
 * Calculates the required canvas height based on node positions
 */
export const calculateCanvasHeight = (nodes: Node[]): number => {
  if (nodes.length === 0) return 500 // default height

  let minY = Number.POSITIVE_INFINITY
  let maxY = Number.NEGATIVE_INFINITY

  nodes.forEach((node) => {
    const nodeY = node.position.y
    const nodeHeight = node.style?.height ? Number.parseFloat(node.style?.height as string) : 0
    minY = Math.min(minY, nodeY)
    maxY = Math.max(maxY, nodeY + nodeHeight)
  })

  return maxY - minY + 50 // Add padding
}
