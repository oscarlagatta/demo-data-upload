"use client"

import { useState } from "react"
import { Info, ChevronDown, ChevronUp, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

/**
 * FlowLegend Component
 *
 * A responsive, collapsible legend component that explains the color coding system used in the flow diagram.
 * Positioned in the bottom-right corner of the viewport with adaptive sizing and collapsible sections.
 *
 * Features:
 * - Collapsible design to minimize space usage
 * - Responsive sizing across different screen widths
 * - Can be minimized to a compact button on smaller screens
 * - Fixed positioning that remains visible during scrolling
 * - Accessible color indicators with text descriptions
 * - High z-index to stay above diagram elements
 */
export function FlowLegend() {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isMinimized, setIsMinimized] = useState(false)

  if (isMinimized) {
    return (
      <Button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-4 right-4 z-30 h-12 w-12 rounded-full shadow-lg"
        size="icon"
        variant="default"
      >
        <Info className="h-5 w-5" />
        <span className="sr-only">Show legend</span>
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 z-30 w-72 shadow-lg transition-all duration-200 sm:w-80 lg:w-[22rem]">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-blue-500" />
            <CardTitle className="text-sm">Flow Diagram Legend</CardTitle>
          </div>
          <div className="flex items-center gap-1">
            <Button onClick={() => setIsExpanded(!isExpanded)} variant="ghost" size="icon" className="h-6 w-6">
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
              <span className="sr-only">{isExpanded ? "Collapse" : "Expand"} legend</span>
            </Button>
            <Button onClick={() => setIsMinimized(true)} variant="ghost" size="icon" className="h-6 w-6">
              <X className="h-3 w-3" />
              <span className="sr-only">Minimize legend</span>
            </Button>
          </div>
        </div>
        {isExpanded && <CardDescription className="text-xs">Node color meanings</CardDescription>}
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-3 text-xs sm:space-y-4">
          {/* Traffic Status Section */}
          <div className="space-y-2">
            <Badge variant="outline" className="text-xs font-semibold">
              Traffic Status
            </Badge>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 shrink-0 rounded-full bg-green-500" />
                <span className="text-foreground">
                  <span className="font-medium">Green:</span> Normal operation
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 shrink-0 rounded-full bg-yellow-500" />
                <span className="text-foreground">
                  <span className="font-medium">Yellow:</span> Warning (traffic not flowing OR off-trend)
                </span>
              </div>
              <div className="flex items-start gap-2">
                <div className="mt-0.5 h-3 w-3 shrink-0 rounded-full bg-red-500" />
                <div className="text-foreground">
                  <div className="font-medium">Red: Critical</div>
                  <div className="ml-2 mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                    All three conditions met:
                    <br />
                    1. Traffic not flowing
                    <br />
                    2. Off-trend pattern
                    <br />
                    3. High variation (|STD| &gt; 9)
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 shrink-0 rounded-full bg-gray-400" />
                <span className="text-foreground">
                  <span className="font-medium">Grey:</span> No data available
                </span>
              </div>
            </div>
          </div>

          {/* Trend Status Section */}
          <div className="space-y-2">
            <Badge variant="outline" className="text-xs font-semibold">
              Trend Status
            </Badge>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 shrink-0 rounded-full bg-green-500" />
                <span className="text-foreground">
                  <span className="font-medium">Green:</span> Healthy range (STD -20 to -6)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 shrink-0 rounded-full bg-yellow-500" />
                <span className="text-foreground">
                  <span className="font-medium">Yellow:</span> Warning (STD &gt; 30 or -6 to -10)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 shrink-0 rounded-full bg-red-500" />
                <span className="text-foreground">
                  <span className="font-medium">Red:</span> Critical (STD &lt; -10)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 shrink-0 rounded-full bg-gray-400" />
                <span className="text-foreground">
                  <span className="font-medium">Grey:</span> Insufficient data
                </span>
              </div>
            </div>
          </div>

          {/* Info Box - Hidden on very small screens to save space */}
          <div className="hidden rounded-md bg-blue-50 p-2 text-xs text-blue-700 sm:block">
            <p className="leading-relaxed">Click on any node to highlight its connections and view related systems.</p>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
