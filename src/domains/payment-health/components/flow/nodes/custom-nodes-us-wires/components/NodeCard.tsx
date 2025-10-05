"use client"

import type React from "react"
import { Card } from "@/components/ui/card"
import { Handle, Position } from "@xyflow/react"

interface NodeCardProps {
  className?: string
  onClick?: () => void
  testId?: string
  height?: number
  children: React.ReactNode
  showHandles?: boolean
  handleClassName?: string
}

/**
 * Base card wrapper for all custom nodes
 * Provides consistent styling, click handling, and connection handles
 */
export function NodeCard({
  className = "",
  onClick,
  testId,
  height = 100,
  children,
  showHandles = true,
  handleClassName = "h-2 w-2 !bg-gray-400",
}: NodeCardProps) {
  return (
    <Card className={`${className} h-[${height}px]`} onClick={onClick} data-testid={testId}>
      {showHandles && (
        <>
          <Handle type="target" position={Position.Left} className={handleClassName} />
          <Handle type="source" position={Position.Right} className={handleClassName} />
          <Handle type="source" position={Position.Top} className={handleClassName} />
          <Handle type="source" position={Position.Bottom} className={handleClassName} />
        </>
      )}
      {children}
    </Card>
  )
}
