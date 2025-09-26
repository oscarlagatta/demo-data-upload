export interface SplunkData {
  aiT_NUM: string
  aiT_NAME: string
  floW_DIRECTION: string | null
  floW_AIT_NUM: string | null
  floW_AIT_NAME: string | null
  iS_TRAFFIC_FLOWING: string
  iS_TRAFFIC_ON_TREND: string | null
  averagE_TRANSACTION_COUNT: string | null
  currenT_TRANSACTION_COUNT: string | null
  historic_STD: string | null
  historic_MEAN: string | null
  currenT_STD_VARIATION: string | null
}

export interface ApiNode {
  id: string
  label: string
  category: string
  isTrafficFlowing: boolean
  currentThruputTime30: number
  averageThruputTime30: number
  systemHealth: string
  splunkDatas: SplunkData[]
  step: number
}

export interface SystemConnection {
  id: string
  source: string
  target: string | string[]
}

export interface ProcessingSection {
  id: string
  title: string
  averageThroughputTime: number
  aitNumber: string[]
}

export interface ApiData {
  nodes: ApiNode[]
  systemConnections: SystemConnection[]
  processingSections?: ProcessingSection[]
  averageThruputTime30?: number
  layOutConfig?: any[]
}

export interface SectionTiming {
  duration: number
  trend: "stable" | "increasing" | "decreasing"
}

export interface SectionPositions {
  baseX: number
  positions: { x: number; y: number }[]
}
