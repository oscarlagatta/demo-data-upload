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
 * - Dynamic section sizing based on style.width and style.height from JSON configuration
 * - Configurable gap between sections (default 10px)
 * - Dynamic mapping from layOutConfig sectionPositions
 * - Configurable first node top offset for precise positioning
 * - Exact section backgrounds and node placements
 * - Connection line visualization between sections
 * - Seamless integration with actual flow diagram structure
 * - Standardized node dimensions (175px x 96px) for consistent layout
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
  data: Record<string, any>
  style: CSSProperties // Contains width and height for dynamic section sizing
  sectionPositions: SectionPositions
}

interface FlowSkeletonLoaderProps {
  layOutConfig?: LayoutSection[]
  canvasWidth?: number
  canvasHeight?: number
  firstNodeTopOffset?: number
  sectionGap?: number // Gap between sections in pixels
}

const DEFAULT_CANVAS_WIDTH = 1650
const DEFAULT_CANVAS_HEIGHT = 960
const DEFAULT_TOP_OFFSET = 50 // Default vertical offset for node alignment
const DEFAULT_SECTION_GAP = 10 // Default gap between sections
const STANDARD_NODE_WIDTH = 175 // Fixed node width for all nodes
const STANDARD_NODE_HEIGHT = 96 // Fixed node height for all nodes

export function FlowSkeletonLoader({
  layOutConfig = [],
  canvasWidth = DEFAULT_CANVAS_WIDTH,
  canvasHeight = DEFAULT_CANVAS_HEIGHT,
  firstNodeTopOffset = DEFAULT_TOP_OFFSET,
  sectionGap = DEFAULT_SECTION_GAP,
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

  console.log("[v0] FlowSkeletonLoader - Received layOutConfig:", layOutConfig.length, "sections")
  if (layOutConfig.length > 0) {
    console.log("[v0] FlowSkeletonLoader - First section structure:", {
      id: layOutConfig[0].id,
      hasSectionPositions: !!layOutConfig[0].sectionPositions,
      hasSectionsProperty: !!layOutConfig[0].sectionPositions?.sections,
      sectionsKeys: layOutConfig[0].sectionPositions?.sections
        ? Object.keys(layOutConfig[0].sectionPositions.sections)
        : [],
      sampleSectionData: layOutConfig[0].sectionPositions?.sections
        ? layOutConfig[0].sectionPositions.sections[Object.keys(layOutConfig[0].sectionPositions.sections)[0]]
        : null,
    })
  }

  const parseDimension = (value: string | number | undefined, defaultValue: number): number => {
    if (typeof value === "number") return value
    if (typeof value === "string") return Number.parseInt(value.replace("px", ""), 10) || defaultValue
    return defaultValue
  }

  // Generate section backgrounds from layout config
  const sectionBackgrounds = layOutConfig.map((section) => {
    const data = section.data as { title?: string; label?: string }
    const width = parseDimension(section.style.width, 350)
    const height = parseDimension(section.style.height, 960)

    console.log("[v0] FlowSkeletonLoader - Section:", section.id, "dimensions:", { width, height })

    return {
      id: section.id,
      x: section.position.x,
      y: section.position.y,
      width,
      height,
      label: data.title || data.label || "Section",
    }
  })

  const skeletonNodes = layOutConfig.flatMap((section) => {
    if (!section.sectionPositions || !section.sectionPositions.sections) {
      console.warn("[v0] FlowSkeletonLoader - Section missing sectionPositions.sections:", section.id)
      return []
    }

    // Get the first section key (should match the section.id)
    const sectionKey = Object.keys(section.sectionPositions.sections)[0]
    if (!sectionKey) {
      console.warn("[v0] FlowSkeletonLoader - No section key found for:", section.id)
      return []
    }

    const sectionData: SectionData = section.sectionPositions.sections[sectionKey]
    if (!sectionData || !sectionData.positions || !Array.isArray(sectionData.positions)) {
      console.warn("[v0] FlowSkeletonLoader - Invalid section data for:", section.id, sectionKey)
      return []
    }

    console.log(
      "[v0] FlowSkeletonLoader - Processing section:",
      section.id,
      "with",
      sectionData.positions.length,
      "nodes",
    )

    return sectionData.positions.map((pos, nodeIndex) => ({
      id: `node-${section.id}-${nodeIndex}`,
      x: pos.x,
      y: pos.y + firstNodeTopOffset,
      width: STANDARD_NODE_WIDTH,
      height: STANDARD_NODE_HEIGHT,
      sectionId: section.id,
    }))
  })

  console.log("[v0] FlowSkeletonLoader - Generated sections:", sectionBackgrounds.length)
  console.log("[v0] FlowSkeletonLoader - Generated nodes:", skeletonNodes.length)
  console.log("[v0] FlowSkeletonLoader - Canvas dimensions:", { canvasWidth, canvasHeight })
  console.log("[v0] FlowSkeletonLoader - First node top offset:", firstNodeTopOffset)
  console.log("[v0] FlowSkeletonLoader - Section gap:", sectionGap, "px")
  console.log("[v0] FlowSkeletonLoader - Standardized node dimensions:", {
    width: STANDARD_NODE_WIDTH,
    height: STANDARD_NODE_HEIGHT,
  })

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
            className="absolute rounded-lg border-2 border-gray-200 bg-white/60 p-4 shadow-sm"
            style={{
              left: `${section.x}px`,
              top: `${section.y}px`,
              width: `${section.width}px`,
              height: `${section.height}px`,
            }}
          >
            <div className="mb-2 flex items-center justify-between border-b border-gray-200 pb-2">
              <Skeleton className="h-5 w-48 animate-pulse" />
              <Skeleton className="h-4 w-16 animate-pulse" />
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
        {sectionBackgrounds.length >= 2 &&
          sectionBackgrounds.slice(0, -1).map((section, index) => {
            const nextSection = sectionBackgrounds[index + 1]
            return (
              <line
                key={`connection-${section.id}-${nextSection.id}`}
                x1={section.x + section.width + sectionGap / 2}
                y1={section.y + section.height / 2}
                x2={nextSection.x - sectionGap / 2}
                y2={nextSection.y + nextSection.height / 2}
                stroke="#d1d5db"
                strokeWidth="2"
                strokeDasharray="4 4"
                className="animate-pulse"
              />
            )
          })}
      </svg>
    </div>
  )
}
