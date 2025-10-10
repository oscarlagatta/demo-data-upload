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
  const sectionBackgrounds = [
    { id: "bg-1", x: "2%", y: "5%", width: "18%", height: "90%", label: "Origination" },
    { id: "bg-2", x: "22%", y: "5%", width: "18%", height: "90%", label: "Payment Validation and Routing" },
    { id: "bg-3", x: "42%", y: "5%", width: "18%", height: "90%", label: "Middleware" },
    {
      id: "bg-4",
      x: "62%",
      y: "5%",
      width: "36%",
      height: "90%",
      label: "Payment Processing, Enrollment & Investigation",
    },
  ]

  const skeletonNodes = [
    // Origination section (left side) - 4 nodes vertically
    { id: "init-1", x: "4%", y: "12%", width: "14%", height: "15%" },
    { id: "init-2", x: "4%", y: "32%", width: "14%", height: "15%" },
    { id: "init-3", x: "4%", y: "52%", width: "14%", height: "15%" },
    { id: "init-4", x: "4%", y: "72%", width: "14%", height: "15%" },

    // Payment Validation section - 5 nodes vertically
    { id: "val-1", x: "24%", y: "10%", width: "14%", height: "12%" },
    { id: "val-2", x: "24%", y: "26%", width: "14%", height: "12%" },
    { id: "val-3", x: "24%", y: "42%", width: "14%", height: "12%" },
    { id: "val-4", x: "24%", y: "58%", width: "14%", height: "12%" },
    { id: "val-5", x: "24%", y: "74%", width: "14%", height: "12%" },

    // Middleware section - 2 nodes vertically
    { id: "mid-1", x: "44%", y: "20%", width: "14%", height: "18%" },
    { id: "mid-2", x: "44%", y: "55%", width: "14%", height: "18%" },

    // Payment Processing section - 6 nodes in 2 columns
    { id: "proc-1", x: "64%", y: "10%", width: "14%", height: "12%" },
    { id: "proc-2", x: "64%", y: "26%", width: "14%", height: "12%" },
    { id: "proc-3", x: "64%", y: "42%", width: "14%", height: "12%" },
    { id: "proc-4", x: "64%", y: "58%", width: "14%", height: "12%" },
    { id: "proc-5", x: "64%", y: "74%", width: "14%", height: "12%" },

    { id: "proc-6", x: "82%", y: "10%", width: "14%", height: "12%" },
    { id: "proc-7", x: "82%", y: "26%", width: "14%", height: "12%" },
    { id: "proc-8", x: "82%", y: "42%", width: "14%", height: "12%" },
    { id: "proc-9", x: "82%", y: "58%", width: "14%", height: "12%" },
    { id: "proc-10", x: "82%", y: "74%", width: "14%", height: "12%" },
  ]

  return (
    <div className="fixed inset-0 h-full w-full overflow-hidden" style={{ background: "#eeeff3ff" }}>
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
            className="absolute rounded-lg border-2 border-gray-200 bg-white/60 p-4"
            style={{
              left: section.x,
              top: section.y,
              width: section.width,
              height: section.height,
            }}
          >
            <div className="mb-2 flex items-center justify-between border-b border-gray-200 pb-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-16" />
            </div>
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
        {[
          // Origination to Validation
          { x1: "18%", y1: "19%", x2: "24%", y2: "16%" },
          { x1: "18%", y1: "39%", x2: "24%", y2: "32%" },
          { x1: "18%", y1: "59%", x2: "24%", y2: "48%" },
          { x1: "18%", y1: "79%", x2: "24%", y2: "64%" },

          // Validation to Middleware
          { x1: "38%", y1: "16%", x2: "44%", y2: "29%" },
          { x1: "38%", y1: "32%", x2: "44%", y2: "29%" },
          { x1: "38%", y1: "48%", x2: "44%", y2: "64%" },
          { x1: "38%", y1: "64%", x2: "44%", y2: "64%" },

          // Middleware to Processing
          { x1: "58%", y1: "29%", x2: "64%", y2: "16%" },
          { x1: "58%", y1: "29%", x2: "64%", y2: "32%" },
          { x1: "58%", y1: "64%", x2: "64%", y2: "48%" },
          { x1: "58%", y1: "64%", x2: "64%", y2: "64%" },

          // Processing column 1 to column 2
          { x1: "78%", y1: "16%", x2: "82%", y2: "16%" },
          { x1: "78%", y1: "32%", x2: "82%", y2: "32%" },
          { x1: "78%", y1: "48%", x2: "82%", y2: "48%" },
          { x1: "78%", y1: "64%", x2: "82%", y2: "64%" },
          { x1: "78%", y1: "80%", x2: "82%", y2: "80%" },
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
