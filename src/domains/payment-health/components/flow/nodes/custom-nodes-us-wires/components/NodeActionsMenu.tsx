"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical } from "lucide-react"

interface NodeAction {
  label: string
  onClick: () => void
  disabled?: boolean
}

interface NodeActionsMenuProps {
  actions: NodeAction[]
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right"
}

/**
 * Reusable dropdown menu for node actions
 * Provides consistent action menu styling and behavior
 */
export function NodeActionsMenu({ actions, position = "top-right" }: NodeActionsMenuProps) {
  const positionClasses = {
    "top-left": "top-1 left-1",
    "top-right": "top-1 right-1",
    "bottom-left": "bottom-1 left-1",
    "bottom-right": "bottom-1 right-1",
  }

  return (
    <div className={`absolute ${positionClasses[position]} z-10`}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 rounded-full p-0 hover:bg-gray-200/80"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="h-3 w-3 text-gray-600" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {actions.map((action, index) => (
            <DropdownMenuItem key={index} onClick={action.onClick} disabled={action.disabled}>
              {action.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
