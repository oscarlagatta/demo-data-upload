import { Skeleton } from "@/components/ui/skeleton"

/**
 * FlowSkeletonLoader Component
 *
 * Provides a visually informative loading state for the flow diagram that shows
 * the background grid and skeleton placeholders for nodes, giving users a better
 * sense of the diagram structure while data loads.
 *
 * Features:
 * - Shows ReactFlow background grid for visual continuity
 * - Displays skeleton placeholders positioned where actual nodes will appear
 * - Mimics the actual flow diagram layout structure
 * - Provides a more seamless loading experience than a simple spinner
 * - Fully responsive and fills the entire container
 */
export function FlowSkeletonLoader() {
  // Define skeleton node positions using percentages for responsive layout
  const skeletonNodes = [
    // Initiation section (left side)
    { id: "init-1", x: "5%", y: "15%", width: "15%", height: "18%" },
    { id: "init-2", x: "5%", y: "40%", width: "15%", height: "18%" },
    { id: "init-3", x: "5%", y: "65%", width: "15%", height: "18%" },

    // Validation section (center-left)
    { id: "val-1", x: "23%", y: "15%", width: "15%", height: "18%" },
    { id: "val-2", x: "23%", y: "40%", width: "15%", height: "18%" },
    { id: "val-3", x: "23%", y: "65%", width: "15%", height: "18%" },

    // Processing section (center)
    { id: "proc-1", x: "41%", y: "15%", width: "15%", height: "18%" },
    { id: "proc-2", x: "41%", y: "40%", width: "15%", height: "18%" },
    { id: "proc-3", x: "41%", y: "65%", width: "15%", height: "18%" },

    // Settlement section (center-right)
    { id: "settle-1", x: "59%", y: "15%", width: "15%", height: "18%" },
    { id: "settle-2", x: "59%", y: "40%", width: "15%", height: "18%" },
    { id: "settle-3", x: "59%", y: "65%", width: "15%", height: "18%" },

    // Completion section (right side)
    { id: "comp-1", x: "77%", y: "15%", width: "15%", height: "18%" },
    { id: "comp-2", x: "77%", y: "40%", width: "15%", height: "18%" },
    { id: "comp-3", x: "77%", y: "65%", width: "15%", height: "18%" },
  ]

  // Section background placeholders using percentages
  const sectionBackgrounds = [
    { id: "bg-1", x: "3%", y: "8%", width: "17%", height: "80%", label: "Initiation" },
    { id: "bg-2", x: "21%", y: "8%", width: "17%", height: "80%", label: "Validation" },
    { id: "bg-3", x: "39%", y: "8%", width: "17%", height: "80%", label: "Processing" },
    { id: "bg-4", x: "57%", y: "8%", width: "17%", height: "80%", label: "Settlement" },
    { id: "bg-5", x: "75%", y: "8%", width: "17%", height: "80%", label: "Completion" },
  ]

  return (
    <div className="absolute inset-0 h-full w-full overflow-hidden" style={{ background: "#eeeff3ff" }}>
      {/* Background grid matching the actual flow diagram */}
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
      <div className="absolute top-4 left-1/2 z-20 -translate-x-1/2">
        <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-white px-4 py-2 shadow-sm">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          <span className="text-sm font-medium text-blue-600">Loading flow diagram...</span>
        </div>
      </div>

      {/* Section background skeletons */}
      <div className="absolute inset-0">
        {sectionBackgrounds.map((section) => (
          <div
            key={section.id}
            className="absolute rounded-lg border-2 border-dashed border-gray-300 bg-white/50 p-3"
            style={{
              left: section.x,
              top: section.y,
              width: section.width,
              height: section.height,
            }}
          >
            <Skeleton className="h-5 w-24" />
            <Skeleton className="mt-2 h-3 w-16" />
          </div>
        ))}
      </div>

      {/* Node skeletons */}
      <div className="absolute inset-0">
        {skeletonNodes.map((node) => (
          <div
            key={node.id}
            className="absolute rounded-lg border-2 border-gray-200 bg-white p-3 shadow-sm"
            style={{
              left: node.x,
              top: node.y,
              width: node.width,
              height: node.height,
            }}
          >
            {/* Node header skeleton */}
            <div className="mb-2 flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>

            {/* Node content skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>

            {/* Node footer skeleton (buttons) */}
            <div className="mt-3 flex gap-1">
              <Skeleton className="h-6 w-12 rounded" />
              <Skeleton className="h-6 w-12 rounded" />
              <Skeleton className="h-6 w-16 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Connection line skeletons */}
      <svg className="pointer-events-none absolute inset-0" style={{ zIndex: 1 }}>
        {/* Horizontal connection lines between sections */}
        {[
          { x1: "20%", y1: "24%", x2: "23%", y2: "24%" },
          { x1: "20%", y1: "49%", x2: "23%", y2: "49%" },
          { x1: "20%", y1: "74%", x2: "23%", y2: "74%" },
          { x1: "38%", y1: "24%", x2: "41%", y2: "24%" },
          { x1: "38%", y1: "49%", x2: "41%", y2: "49%" },
          { x1: "38%", y1: "74%", x2: "41%", y2: "74%" },
          { x1: "56%", y1: "24%", x2: "59%", y2: "24%" },
          { x1: "56%", y1: "49%", x2: "59%", y2: "49%" },
          { x1: "56%", y1: "74%", x2: "59%", y2: "74%" },
          { x1: "74%", y1: "24%", x2: "77%", y2: "24%" },
          { x1: "74%", y1: "49%", x2: "77%", y2: "49%" },
          { x1: "74%", y1: "74%", x2: "77%", y2: "74%" },
        ].map((line, index) => (
          <line
            key={index}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="#d1d5db"
            strokeWidth="2"
            strokeDasharray="4 4"
            className="animate-pulse"
          />
        ))}
      </svg>
    </div>
  )
}
