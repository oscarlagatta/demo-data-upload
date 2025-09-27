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
  splunkData: any[] | null
  sectionTimings: Record<string, { duration: number; trend: string }> | null
  totalProcessingTime: number | null
  isLoading: boolean
  isError: boolean
  onRefetch: () => void
}
