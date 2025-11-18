"use client"

import { BaseEdge, EdgeLabelRenderer, getBezierPath, type EdgeProps } from "@xyflow/react"
import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useState } from "react"

export interface DeleteButtonEdgeData {
  onDelete?: (edgeId: string) => void
  label?: string
}

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
}: EdgeProps<DeleteButtonEdgeData>) {
  const [isHovered, setIsHovered] = useState(false)
  
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  const onEdgeDelete = () => {
    console.log("[v0] Deleting edge:", id)
    data?.onDelete?.(id)
  }

  return (
    <>
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        className="react-flow__edge-interaction"
        style={{ cursor: 'pointer' }}
        onMouseEnter={() => {
          console.log("[v0] Edge hover start:", id)
          setIsHovered(true)
        }}
        onMouseLeave={() => {
          console.log("[v0] Edge hover end:", id)
          setIsHovered(false)
        }}
      />
      
      <BaseEdge 
        path={edgePath} 
        markerEnd={markerEnd} 
        style={{
          ...style,
          strokeWidth: isHovered ? 3 : 2,
          stroke: isHovered ? '#3b82f6' : (style.stroke || '#b1b1b7'),
          filter: isHovered ? 'drop-shadow(0 0 4px rgba(59, 130, 246, 0.5))' : 'none',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />
      
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: "all",
          }}
          className="nodrag nopan"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Button
            onClick={onEdgeDelete}
            size="sm"
            variant="destructive"
            className={`h-6 w-6 rounded-full p-0 shadow-lg transition-all duration-200 hover:scale-110 ${
              isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            title="Remove connection"
            aria-label={`Remove connection ${id}`}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </EdgeLabelRenderer>
    </>
  )
}
