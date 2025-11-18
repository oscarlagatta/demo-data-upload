"use client"

import { BaseEdge, EdgeLabelRenderer, getBezierPath, type EdgeProps } from "@xyflow/react"
import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"

export function DeleteButtonEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  const onEdgeDelete = () => {
    // Call the delete handler passed from parent
    data?.onDelete?.(id)
  }

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            pointerEvents: "all",
          }}
          className="nodrag nopan"
        >
          <Button
            onClick={onEdgeDelete}
            size="sm"
            variant="destructive"
            className="group h-6 w-6 rounded-full p-0 opacity-0 shadow-lg transition-all duration-200 hover:scale-110 hover:opacity-100 focus:opacity-100"
            title="Remove connection"
            aria-label={`Remove connection ${id}`}
          >
            <X className="h-3 w-3" />
          </Button>
          {/* </CHANGE> */}
        </div>
      </EdgeLabelRenderer>
    </>
  )
}
