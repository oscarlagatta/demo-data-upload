import { Skeleton } from "@/components/ui/skeleton"

/**
 * FlowSkeletonLoader Component
 *
 * Provides a visually accurate loading state for the flow diagram that precisely matches
 * the actual layout configuration from get-wires-flow.json. This skeleton uses the exact
 * pixel positions and dimensions defined in layOutConfig to create a seamless loading experience.
 *
 * Features:
 * - Exact section backgrounds matching layOutConfig (350px, 350px, 450px, 500px widths)
 * - Node skeletons positioned at precise coordinates from sectionPositions
 * - Total canvas: 1650px width × 960px height
 * - Matches the actual flow diagram structure perfectly
 */
export function FlowSkeletonLoader() {
  // Section backgrounds from layOutConfig - exact pixel dimensions
  const sectionBackgrounds = [
    {
      id: "bg-origination",
      x: 0,
      y: 0,
      width: 350,
      height: 960,
      label: "Origination",
    },
    {
      id: "bg-validation",
      x: 350,
      y: 0,
      width: 350,
      height: 960,
      label: "Payment Validation and Routing",
    },
    {
      id: "bg-middleware",
      x: 700,
      y: 0,
      width: 450,
      height: 960,
      label: "Middleware",
    },
    {
      id: "bg-processing",
      x: 1150,
      y: 0,
      width: 500,
      height: 960,
      label: "Payment Processing, Sanctions & Investigation",
    },
  ]

  // Node skeleton positions from sectionPositions - exact pixel coordinates
  const skeletonNodes = [
    // Origination section - 5 nodes at baseX: 50
    { id: "node-orig-1", x: 50, y: 0, width: 250, height: 160 },
    { id: "node-orig-2", x: 50, y: 192, width: 250, height: 160 },
    { id: "node-orig-3", x: 50, y: 384, width: 250, height: 160 },
    { id: "node-orig-4", x: 50, y: 576, width: 250, height: 160 },
    { id: "node-orig-5", x: 50, y: 768, width: 250, height: 160 },

    // Payment Validation section - 6 nodes at baseX: 425
    { id: "node-val-1", x: 425, y: 0, width: 250, height: 140 },
    { id: "node-val-2", x: 425, y: 160, width: 250, height: 140 },
    { id: "node-val-3", x: 425, y: 320, width: 250, height: 140 },
    { id: "node-val-4", x: 425, y: 480, width: 250, height: 140 },
    { id: "node-val-5", x: 425, y: 640, width: 250, height: 140 },
    { id: "node-val-6", x: 425, y: 800, width: 250, height: 140 },

    // Middleware section - 3 nodes at baseX: 750
    { id: "node-mid-1", x: 750, y: 0, width: 350, height: 200 },
    { id: "node-mid-2", x: 750, y: 240, width: 350, height: 200 },
    { id: "node-mid-3", x: 750, y: 480, width: 350, height: 200 },

    // Payment Processing section - 6 nodes at baseX: 1200
    { id: "node-proc-1", x: 1200, y: 0, width: 400, height: 140 },
    { id: "node-proc-2", x: 1200, y: 160, width: 400, height: 140 },
    { id: "node-proc-3", x: 1200, y: 320, width: 400, height: 140 },
    { id: "node-proc-4", x: 1200, y: 480, width: 400, height: 140 },
    { id: "node-proc-5", x: 1200, y: 640, width: 400, height: 140 },
    { id: "node-proc-6", x: 1200, y: 800, width: 400, height: 140 },
  ]

  return (
    <div
      className="absolute inset-0 h-full w-full overflow-hidden"
      style={{
        background: "#eeeff3ff",
        minWidth: "1650px",
        minHeight: "960px",
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

      {/* Section background skeletons - exact pixel positions */}
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

      {/* Node skeletons - exact pixel positions */}
      <div className="absolute inset-0">
        {skeletonNodes.map((node) => (
          <div
            key={node.id}
            className="absolute rounded-lg border-2 border-gray-200 bg-white p-3 shadow-sm"
            style={{
              left: `${node.x}px`,
              top: `${node.y}px`,
              width: `${node.width}px`,
              height: `${node.height}px`,
            }}
          >
            {/* Node header skeleton */}
            <div className="mb-2 flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>

            {/* Node content skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-3 w-5/6" />
            </div>

            {/* Node footer skeleton (buttons) */}
            <div className="mt-3 flex gap-1">
              <Skeleton className="h-6 w-14 rounded" />
              <Skeleton className="h-6 w-14 rounded" />
              <Skeleton className="h-6 w-16 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Connection line skeletons between sections */}
      <svg className="pointer-events-none absolute inset-0" style={{ zIndex: 1 }}>
        {/* Origination to Validation connections */}
        <line
          x1="300"
          y1="80"
          x2="425"
          y2="70"
          stroke="#d1d5db"
          strokeWidth="2"
          strokeDasharray="4 4"
          className="animate-pulse"
        />
        <line
          x1="300"
          y1="272"
          x2="425"
          y2="230"
          stroke="#d1d5db"
          strokeWidth="2"
          strokeDasharray="4 4"
          className="animate-pulse"
        />
        <line
          x1="300"
          y1="464"
          x2="425"
          y2="390"
          stroke="#d1d5db"
          strokeWidth="2"
          strokeDasharray="4 4"
          className="animate-pulse"
        />
        <line
          x1="300"
          y1="656"
          x2="425"
          y2="550"
          stroke="#d1d5db"
          strokeWidth="2"
          strokeDasharray="4 4"
          className="animate-pulse"
        />
        <line
          x1="300"
          y1="848"
          x2="425"
          y2="710"
          stroke="#d1d5db"
          strokeWidth="2"
          strokeDasharray="4 4"
          className="animate-pulse"
        />

        {/* Validation to Middleware connections */}
        <line
          x1="675"
          y1="70"
          x2="750"
          y2="100"
          stroke="#d1d5db"
          strokeWidth="2"
          strokeDasharray="4 4"
          className="animate-pulse"
        />
        <line
          x1="675"
          y1="230"
          x2="750"
          y2="100"
          stroke="#d1d5db"
          strokeWidth="2"
          strokeDasharray="4 4"
          className="animate-pulse"
        />
        <line
          x1="675"
          y1="390"
          x2="750"
          y2="340"
          stroke="#d1d5db"
          strokeWidth="2"
          strokeDasharray="4 4"
          className="animate-pulse"
        />
        <line
          x1="675"
          y1="550"
          x2="750"
          y2="580"
          stroke="#d1d5db"
          strokeWidth="2"
          strokeDasharray="4 4"
          className="animate-pulse"
        />

        {/* Middleware to Processing connections */}
        <line
          x1="1100"
          y1="100"
          x2="1200"
          y2="70"
          stroke="#d1d5db"
          strokeWidth="2"
          strokeDasharray="4 4"
          className="animate-pulse"
        />
        <line
          x1="1100"
          y1="100"
          x2="1200"
          y2="230"
          stroke="#d1d5db"
          strokeWidth="2"
          strokeDasharray="4 4"
          className="animate-pulse"
        />
        <line
          x1="1100"
          y1="340"
          x2="1200"
          y2="390"
          stroke="#d1d5db"
          strokeWidth="2"
          strokeDasharray="4 4"
          className="animate-pulse"
        />
        <line
          x1="1100"
          y1="580"
          x2="1200"
          y2="550"
          stroke="#d1d5db"
          strokeWidth="2"
          strokeDasharray="4 4"
          className="animate-pulse"
        />
        <line
          x1="1100"
          y1="580"
          x2="1200"
          y2="710"
          stroke="#d1d5db"
          strokeWidth="2"
          strokeDasharray="4 4"
          className="animate-pulse"
        />
      </svg>
    </div>
  )
}
