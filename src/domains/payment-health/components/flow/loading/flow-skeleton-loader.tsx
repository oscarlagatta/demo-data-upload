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

const DEFAULT_CANVAS_WIDTH = 2400 // Increased for better spacing
const DEFAULT_CANVAS_HEIGHT = 1200
const DEFAULT_TOP_OFFSET = 150
const DEFAULT_SECTION_GAP = 10
const STANDARD_NODE_WIDTH = 200 // Increased from 175 to 200 for better proportions
const STANDARD_NODE_HEIGHT = 100 // Reduced from 120 to 100 for better proportions
const FIXED_SECTION_HEIGHT = 600 // Fixed height for all sections to maintain balance

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
        <div className="flex flex-col items-center gap-5 rounded-2xl border-2 border-blue-300 bg-white px-10 py-8 shadow-2xl">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <span className="text-xl font-bold text-gray-900">Loading flow diagram...</span>
          <span className="text-sm font-medium text-gray-600">Preparing your data visualization</span>
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

  const totalSectionsWidth = sectionBackgrounds.reduce((sum, section, index) => {
    return sum + section.width + (index > 0 ? sectionGap : 0)
  }, 0)

  console.log("[v0] FlowSkeletonLoader - Total sections width:", totalSectionsWidth)

  return (
    <div
      className="flex h-full w-full items-center justify-center bg-[#eeeff3ff]"
      style={{
        background: "#eeeff3ff",
      }}
    >
      <div className="fixed left-1/2 top-12 z-30 -translate-x-1/2">
        <div className="flex items-center gap-4 rounded-2xl border-2 border-blue-400 bg-white px-8 py-4 shadow-2xl">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <span className="text-lg font-bold text-blue-800">Loading flow diagram...</span>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1400px] px-6 py-32">
        <div className="flex items-start justify-center gap-4 overflow-x-auto">
          {sectionBackgrounds.map((section, sectionIndex) => {
            const sectionNodes = skeletonNodes.filter((node) => node.sectionId === section.id)

            return (
              <div
                key={section.id}
                className="relative flex-shrink-0 rounded-2xl border-2 border-gray-400 bg-white p-8 shadow-xl transition-shadow hover:shadow-2xl"
                style={{
                  minWidth: `${Math.min(section.width, 280)}px`,
                  maxWidth: `${section.width}px`,
                  height: `${FIXED_SECTION_HEIGHT}px`,
                }}
              >
                {/* Section header */}
                <div className="mb-8 flex items-center justify-between border-b-2 border-gray-300 pb-5">
                  <Skeleton className="h-8 w-3/4 animate-pulse rounded-lg bg-gray-300" />
                  <Skeleton className="h-7 w-1/4 animate-pulse rounded-lg bg-gray-300" />
                </div>

                <div className="relative overflow-hidden" style={{ height: `${FIXED_SECTION_HEIGHT - 120}px` }}>
                  {sectionNodes.map((node, nodeIndex) => (
                    <div
                      key={node.id}
                      className="absolute"
                      style={{
                        left: `${node.x - section.x}px`,
                        top: `${node.y - section.y}px`,
                        width: `${node.width}px`,
                        height: `${node.height}px`,
                      }}
                    >
                      <CardLoadingSkeleton className="h-full w-full shadow-lg" size="md" />
                    </div>
                  ))}
                </div>

                {sectionIndex < sectionBackgrounds.length - 1 && (
                  <div className="absolute right-0 top-1/2 z-10 h-1 w-4 -translate-y-1/2 translate-x-full bg-gray-400">
                    <div className="h-full w-full animate-pulse bg-gray-500" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
