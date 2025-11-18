"use client"

import { useCallback, type MouseEvent } from "react"
import { Trash2, Info, Link2Off } from 'lucide-react'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { toast } from "sonner"

export interface EdgeContextMenuProps {
  children: React.ReactNode
  edgeId: string
  sourceLabel: string
  targetLabel: string
  onDeleteEdge: (edgeId: string) => void
  disabled?: boolean
}

export function EdgeContextMenu({
  children,
  edgeId,
  sourceLabel,
  targetLabel,
  onDeleteEdge,
  disabled = false,
}: EdgeContextMenuProps) {
  const handleDelete = useCallback(
    (e: MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      console.log("[v0] EdgeContextMenu: Deleting edge", edgeId)
      
      onDeleteEdge(edgeId)
      
      toast.success("Connection removed", {
        description: `Removed connection from ${sourceLabel} to ${targetLabel}`,
        icon: <Link2Off className="h-4 w-4" />,
      })
    },
    [edgeId, onDeleteEdge, sourceLabel, targetLabel]
  )

  const handleShowInfo = useCallback(
    (e: MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      toast.info("Connection Info", {
        description: `From: ${sourceLabel}\nTo: ${targetLabel}\nID: ${edgeId}`,
        icon: <Info className="h-4 w-4" />,
      })
    },
    [edgeId, sourceLabel, targetLabel]
  )

  if (disabled) {
    return <>{children}</>
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuLabel className="text-xs font-medium">
          Connection Menu
        </ContextMenuLabel>
        <ContextMenuSeparator />
        
        <ContextMenuItem onClick={handleShowInfo} className="gap-2">
          <Info className="h-4 w-4" />
          <span>View Details</span>
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem 
          onClick={handleDelete} 
          className="gap-2 text-destructive focus:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
          <span>Remove Connection</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
