"use client"

import { useState } from "react"
import { Info, ChevronDown, ChevronUp, X, BookOpen } from "lucide-react"
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
 * - Complete hide/show toggle with smooth animations
 * - Collapsible design to minimize space usage
 * - Responsive sizing across different screen widths
 * - Fixed positioning that remains visible during scrolling
 * - Accessible color indicators with text descriptions
 * - High z-index to stay above diagram elements
 * - Clear visual cues for all interaction states
 */
export function FlowLegend() {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isHidden, setIsHidden] = useState(false)

  if (isHidden) {
    return (
      <div className="fixed bottom-20 right-4 z-30 animate-in fade-in slide-in-from-bottom-2 duration-300 sm:bottom-24">
        <Button
          onClick={() => setIsHidden(false)}
          className="group relative h-16 gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 px-5 shadow-xl ring-2 ring-blue-400/30 transition-all hover:scale-105 hover:from-blue-700 hover:to-blue-600 hover:shadow-2xl hover:ring-blue-400/50 active:scale-95"
          size="lg"
        >
          {/* Pulse animation ring for attention */}
          <span className="absolute inset-0 animate-pulse rounded-2xl bg-blue-400/20" />

          {/* Icon with rotation animation on hover */}
          <BookOpen className="relative h-6 w-6 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />

          {/* Text content */}
          <div className="relative flex flex-col items-start">
            <span className="text-sm font-bold leading-tight">Legend</span>
            <span className="text-xs font-normal opacity-90">Click to view</span>
          </div>

          {/* Visual indicator badge */}
          <Badge
            variant="secondary"
            className="relative ml-1 h-5 w-5 rounded-full bg-white/20 p-0 text-[10px] font-bold backdrop-blur-sm"
          >
            ?
          </Badge>

          <span className="sr-only">Show flow diagram legend with color explanations</span>
        </Button>
      </div>
    )
  }

  return (
    <Card className="fixed bottom-20 right-4 z-30 w-72 animate-in fade-in slide-in-from-bottom-4 shadow-lg duration-300 sm:bottom-24 sm:w-80 lg:w-[22rem]">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-blue-500" />
            <CardTitle className="text-sm">Flow Diagram Legend</CardTitle>
          </div>
          <div className="flex items-center gap-1">
            <Button
              onClick={() => setIsExpanded(!isExpanded)}
              variant="ghost"
              size="icon"
              className="h-7 w-7 transition-colors hover:bg-muted"
              title={isExpanded ? "Collapse legend" : "Expand legend"}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 transition-transform" />
              ) : (
                <ChevronUp className="h-4 w-4 transition-transform" />
              )}
              <span className="sr-only">{isExpanded ? "Collapse" : "Expand"} legend</span>
            </Button>
            <Button
              onClick={() => setIsHidden(true)}
              variant="ghost"
              size="icon"
              className="h-7 w-7 transition-colors hover:bg-muted hover:text-destructive"
              title="Hide legend"
            >
              <X className="h-4 w-4 transition-transform hover:scale-110" />
              <span className="sr-only">Hide legend</span>
            </Button>
          </div>
        </div>
        {isExpanded && <CardDescription className="text-xs">Node color meanings</CardDescription>}
      </CardHeader>

      {isExpanded && (
        <CardContent className="animate-in fade-in slide-in-from-top-2 space-y-3 text-xs duration-200 sm:space-y-4">
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
