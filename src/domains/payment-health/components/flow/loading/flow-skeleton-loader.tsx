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
  style: {
    width: string | number
    height: string | number
  } & CSSProperties
  sectionPositions: SectionPositions
}

interface FlowSkeletonLoaderProps {
  layOutConfig?: LayoutSection[]
  canvasWidth?: number
  canvasHeight?: number
  firstNodeTopOffset?: number
  sectionGap?: number // Gap between sections in pixels
}

const DEFAULT_CANVAS_WIDTH = 2200 // Increased to accommodate all sections with proper spacing
const DEFAULT_CANVAS_HEIGHT = 1200
const DEFAULT_TOP_OFFSET = 150 // Default vertical offset for node alignment
const DEFAULT_SECTION_GAP = 10 // Default gap between sections
const STANDARD_NODE_WIDTH = 175 // Fixed node width for all nodes
const STANDARD_NODE_HEIGHT = 100 // Fixed node height for all nodes

export function FlowSkeletonLoader({
  layOutConfig = [],
  canvasWidth = DEFAULT_CANVAS_WIDTH,
  canvasHeight = DEFAULT_CANVAS_HEIGHT,
  firstNodeTopOffset = DEFAULT_TOP_OFFSET,
  sectionGap = DEFAULT_SECTION_GAP,
}: FlowSkeletonLoaderProps) {
  if (!layOutConfig || layOutConfig.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#eeeff3ff]">
        <div className="flex flex-col items-center gap-4 rounded-xl border border-blue-200 bg-white px-8 py-6 shadow-lg">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <span className="text-lg font-semibold text-gray-800">Loading flow diagram...</span>
          <span className="text-sm text-gray-500">Preparing your data visualization</span>
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

  const parseDimension = (value: string | number): number => {
    if (typeof value === "number") return value
    if (typeof value === "string") {
      const parsed = Number.parseInt(value.replace("px", ""), 10)
      if (isNaN(parsed)) {
        console.warn("[v0] FlowSkeletonLoader - Failed to parse dimension:", value)
        return 0
      }
      return parsed
    }
    return 0
  }

  // Generate section backgrounds from layout config
  const sectionBackgrounds = layOutConfig.map((section) => {
    const data = section.data as { title?: string; label?: string }
    const width = parseDimension(section.style.width)
    const height = parseDimension(section.style.height)

    if (width === 0 || height === 0) {
      console.warn("[v0] FlowSkeletonLoader - Section has invalid dimensions:", section.id, { width, height })
    }

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

  const calculatedWidth = Math.max(...sectionBackgrounds.map((s) => s.x + s.width), DEFAULT_CANVAS_WIDTH)
  const calculatedHeight = Math.max(...sectionBackgrounds.map((s) => s.y + s.height), DEFAULT_CANVAS_HEIGHT)

  return (
    <div
      className="h-full w-full overflow-auto bg-[#eeeff3ff]" // Added explicit background color
      style={{
        background: "#eeeff3ff",
      }}
    >
      <div className="sticky left-0 right-0 top-4 z-30 flex justify-center">
        <div className="flex items-center gap-3 rounded-xl border-2 border-blue-300 bg-white px-6 py-3 shadow-xl">
          <div className="h-6 w-6 animate-spin rounded-full border-3 border-blue-600 border-t-transparent" />
          <span className="text-base font-semibold text-blue-700">Loading flow diagram...</span>
        </div>
      </div>

      <div
        className="relative"
        style={{
          width: `${calculatedWidth}px`, // Use calculated width instead of minWidth
          height: `${calculatedHeight}px`, // Use calculated height instead of minHeight
          padding: "20px", // Add padding around the entire canvas
        }}
      >
        <div className="absolute inset-0">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="#cbd5e1" opacity="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="absolute inset-0">
          {sectionBackgrounds.map((section) => (
            <div
              key={section.id}
              className="absolute rounded-xl border-2 border-gray-300 bg-white p-6 shadow-lg transition-shadow hover:shadow-xl" // Improved border, shadow, and padding
              style={{
                left: `${section.x + 20}px`, // Account for canvas padding
                top: `${section.y + 20}px`, // Account for canvas padding
                width: `${section.width}px`,
                height: `${section.height}px`,
              }}
            >
              <div className="mb-6 flex items-center justify-between border-b-2 border-gray-200 pb-4">
                <Skeleton className="h-7 w-64 animate-pulse rounded-md bg-gray-200" />
                <Skeleton className="h-6 w-24 animate-pulse rounded-md bg-gray-200" />
              </div>
            </div>
          ))}
        </div>

        <div className="absolute inset-0">
          {skeletonNodes.map((node) => (
            <div
              key={node.id}
              className="absolute"
              style={{
                left: `${node.x + 20}px`, // Account for canvas padding
                top: `${node.y + 20}px`, // Account for canvas padding
                width: `${node.width}px`,
                height: `${node.height}px`,
              }}
            >
              <CardLoadingSkeleton className="h-full w-full shadow-md" /> {/* Enhanced shadow */}
            </div>
          ))}
        </div>

        <svg className="pointer-events-none absolute inset-0" style={{ zIndex: 5 }}>
          {sectionBackgrounds.length >= 2 &&
            sectionBackgrounds.slice(0, -1).map((section, index) => {
              const nextSection = sectionBackgrounds[index + 1]
              return (
                <line
                  key={`connection-${section.id}-${nextSection.id}`}
                  x1={section.x + section.width + 20} // Account for canvas padding
                  y1={section.y + section.height / 2 + 20}
                  x2={nextSection.x + 20}
                  y2={nextSection.y + nextSection.height / 2 + 20}
                  stroke="#64748b" // Darker stroke for better visibility
                  strokeWidth="3" // Thicker line
                  strokeDasharray="8 6" // Better dash pattern
                  className="animate-pulse"
                />
              )
            })}
        </svg>
      </div>
    </div>
  )
}
