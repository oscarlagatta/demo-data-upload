import type { Edge } from "@xyflow/react"
import type { AppNode } from "./app-node"

export type ActionType = "flow" | "trend" | "balanced"

export interface TableModeState {
  show: boolean
  aitNum: string | null
  action: ActionType | null
}

export interface FlowDiagramProps {
  isMonitoringMode: boolean
}

export interface FlowProps {
  nodeTypes: any
  onShowSearchBox: () => void
  flowNodes: AppNode[] // Array of nodes for the flow diagram
  flowEdges: Edge[] // Array of edges for the flow diagram
  splunkData: any[] | null
  sectionTimings: Record<string, { duration: number; trend: string }> | null
  totalProcessingTime: number | null
  isLoading: boolean
  isError: boolean
  onRefetch: () => void
}
