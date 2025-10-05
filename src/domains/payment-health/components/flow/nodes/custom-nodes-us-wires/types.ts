import type React from "react"
import type { Node } from "@xyflow/react"

export type ActionType = "flow" | "trend" | "balanced"

export type UIMode = "default" | "loading" | "results"

export type CustomNodeData = {
  title: string
  subtext: string
  isSelected?: boolean
  isConnected?: boolean
  isDimmed?: boolean
  onClick?: (nodeId: string) => void
  onActionClick?: (aitNum: string, action: ActionType) => void
  currentThruputTime30?: number
  averageThruputTime30?: number
}

export type CustomNodeType = Node<CustomNodeData>

export interface ButtonConfig {
  type: ActionType | "summary" | "details"
  label: string
  className?: string
  onClick?: (e: React.MouseEvent) => void
  disabled?: boolean
  isLoading?: boolean
}

export interface NodeAction {
  label: string
  onClick: () => void
  icon?: React.ReactNode
}
