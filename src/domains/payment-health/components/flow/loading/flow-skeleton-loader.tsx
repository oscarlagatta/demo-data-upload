import { Skeleton } from "@/components/ui/skeleton"
import { CardLoadingSkeleton } from "../../loading/loading-skeleton"
import type { CSSProperties } from "react"

/**
 * FlowSkeletonLoader Component
 *
 * Dynamically generates a loading skeleton that precisely matches the flow diagram layout
 * by utilizing the layOutConfig structure passed from the parent component.
 *
 * Features:
 * - Dynamic mapping from layOutConfig sectionPositions
 * - Percentage-based positioning for responsive layouts
 * - Top offset adjustment for proper vertical alignment
 * - Exact section backgrounds and node placements
 * - Seamless integration with actual flow diagram structure
 */

interface SectionPosition {
  x: number
  y: number
}

interface SectionData {
  baseX: number
  positions: SectionPosition[]
}

interface SectionPositions {
  sections: Record<string, SectionData>
}

interface LayoutSection {
  id: string
  position: { x: number; y: number }
  data: Record<string, any> // Changed from { title: string } to accept any data structure
  style: CSSProperties // Changed from { width: string; height: string } to CSSProperties
  sectionPositions: SectionPositions
}

interface FlowSkeletonLoaderProps {
  layOutConfig?: LayoutSection[]
  canvasWidth?: number
  canvasHeight?: number
}

const DEFAULT_CANVAS_WIDTH = 1650
const DEFAULT_CANVAS_HEIGHT = 960
const TOP_OFFSET = 50 // Vertical offset for node alignment
const NODE_WIDTH = 250 // Default node width
const NODE_HEIGHT = 140 // Default node height

export function FlowSkeletonLoader({
  layOutConfig = [],
  canvasWidth = DEFAULT_CANVAS_WIDTH,
  canvasHeight = DEFAULT_CANVAS_HEIGHT,
}: FlowSkeletonLoaderProps) {
  // If no layout config provided, show a simple loading state
  if (!layOutConfig || layOutConfig.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#eeeff3ff]">
        <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-white px-4 py-2 shadow-sm">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          <span className="text-sm font-medium text-blue-600">Loading flow diagram...</span>
        </div>
      </div>
    )
  }

  // Generate section backgrounds from layout config
  const sectionBackgrounds = layOutConfig.map((section) => ({
    id: section.id,
    x: section.position.x,
    y: section.position.y,
    width:
      typeof section.style.width === "number" ? section.style.width : Number.parseInt(String(section.style.width || 0)),
    height:
      typeof section.style.height === "number"
        ? section.style.height
        : Number.parseInt(String(section.style.height || 0)),
    label: section.data?.title || section.data?.label || "Section",
  }))

  // Generate skeleton nodes from layout config
  const skeletonNodes = layOutConfig.flatMap((section) => {
    const sectionKey = Object.keys(section.sectionPositions.sections)[0]
    const sectionData = section.sectionPositions.sections[sectionKey]

    return sectionData.positions.map((pos, nodeIndex) => {
      // Determine node dimensions based on section
      let nodeWidth = NODE_WIDTH
      let nodeHeight = NODE_HEIGHT

      // Adjust node dimensions for different sections
      if (section.id === "bg-middleware") {
        nodeWidth = 350
        nodeHeight = 180
      } else if (section.id === "bg-processing") {
        nodeWidth = 400
        nodeHeight = 140
      } else if (section.id === "bg-origination") {
        nodeHeight = 160
      }

      return {
        id: `node-${section.id}-${nodeIndex}`,
        x: pos.x,
        y: pos.y + TOP_OFFSET,
        width: nodeWidth,
        height: nodeHeight,
        sectionId: section.id,
      }
    })
  })

  console.log("[v0] FlowSkeletonLoader - Generated sections:", sectionBackgrounds.length)
  console.log("[v0] FlowSkeletonLoader - Generated nodes:", skeletonNodes.length)

  return (
    <div
      className="absolute inset-0 h-full w-full overflow-hidden"
      style={{
        background: "#eeeff3ff",
        minWidth: `${canvasWidth}px`,
        minHeight: `${canvasHeight}px`,
      }}
    >
      {/* Background grid matching ReactFlow */}
      <div className="absolute inset-0">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="16" height="16" patternUnits="userSpaceOnUse">
              <circle cx="0.5" cy="0.5" r="0.5" fill="#d1d5db" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Loading indicator overlay */}
      <div className="absolute left-1/2 top-4 z-20 -translate-x-1/2">
        <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-white px-4 py-2 shadow-sm">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          <span className="text-sm font-medium text-blue-600">Loading flow diagram...</span>
        </div>
      </div>

      {/* Section backgrounds */}
      <div className="absolute inset-0">
        {sectionBackgrounds.map((section) => (
          <div
            key={section.id}
            className="absolute rounded-lg border-2 border-gray-200 bg-white/60 p-4"
            style={{
              left: `${section.x}px`,
              top: `${section.y}px`,
              width: `${section.width}px`,
              height: `${section.height}px`,
            }}
          >
            <div className="mb-2 flex items-center justify-between border-b border-gray-200 pb-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        ))}
      </div>

      {/* Skeleton nodes */}
      <div className="absolute inset-0">
        {skeletonNodes.map((node) => (
          <div
            key={node.id}
            className="absolute"
            style={{
              left: `${node.x}px`,
              top: `${node.y}px`,
              width: `${node.width}px`,
              height: `${node.height}px`,
            }}
          >
            <CardLoadingSkeleton className="h-full w-full" />
          </div>
        ))}
      </div>

      {/* Connection line skeletons between sections */}
      <svg className="pointer-events-none absolute inset-0" style={{ zIndex: 1 }}>
        {/* Origination to Validation connections */}
        <line
          x1="300"
          y1="130"
          x2="425"
          y2="120"
          stroke="#d1d5db"
          strokeWidth="2"
          strokeDasharray="4 4"
          className="animate-pulse"
        />
        <line
          x1="300"
          y1="322"
          x2="425"
          y2="280"
          stroke="#d1d5db"
          strokeWidth="2"
          strokeDasharray="4 4"
          className="animate-pulse"
        />
        <line
          x1="300"
          y1="514"
          x2="425"
          y2="440"
          stroke="#d1d5db"
          strokeWidth="2"
          strokeDasharray="4 4"
          className="animate-pulse"
        />

        {/* Validation to Middleware connections */}
        <line
          x1="675"
          y1="120"
          x2="750"
          y2="150"
          stroke="#d1d5db"
          strokeWidth="2"
          strokeDasharray="4 4"
          className="animate-pulse"
        />
        <line
          x1="675"
          y1="280"
          x2="750"
          y2="150"
          stroke="#d1d5db"
          strokeWidth="2"
          strokeDasharray="4 4"
          className="animate-pulse"
        />
        <line
          x1="675"
          y1="440"
          x2="750"
          y2="390"
          stroke="#d1d5db"
          strokeWidth="2"
          strokeDasharray="4 4"
          className="animate-pulse"
        />

        {/* Middleware to Processing connections */}
        <line
          x1="1100"
          y1="150"
          x2="1200"
          y2="120"
          stroke="#d1d5db"
          strokeWidth="2"
          strokeDasharray="4 4"
          className="animate-pulse"
        />
        <line
          x1="1100"
          y1="150"
          x2="1200"
          y2="280"
          stroke="#d1d5db"
          strokeWidth="2"
          strokeDasharray="4 4"
          className="animate-pulse"
        />
        <line
          x1="1100"
          y1="390"
          x2="1200"
          y2="440"
          stroke="#d1d5db"
          strokeWidth="2"
          strokeDasharray="4 4"
          className="animate-pulse"
        />
      </svg>
    </div>
  )
}
