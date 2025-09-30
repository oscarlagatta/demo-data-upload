"use client"

import { useState, useEffect } from "react"

export interface SplunkData {
  aiT_NUM: string
  aiT_NAME: string
  floW_DIRECTION?: string | null
  floW_AIT_NUM?: string | null
  floW_AIT_NAME?: string | null
  iS_TRAFFIC_FLOWING?: string
  iS_TRAFFIC_ON_TREND?: string | null
  averagE_TRANSACTION_COUNT?: string | null
  currenT_TRANSACTION_COUNT?: string | null
  historic_STD?: string | null
  historic_MEAN?: string | null
  currenT_STD_VARIATION?: string | null
}

export interface RealFlowNode {
  id: string
  label: string
  category: string
  isTrafficFlowing: boolean
  currentThruputTime30?: number
  averageThruputTime30?: number
  systemHealth: string
  splunkDatas: SplunkData[]
  step: number
}

export interface ProcessingSection {
  id: string
  title: string
  averageThroughputTime: number
  aitNumber: string[]
}

export interface SystemConnection {
  id: string
  source: string
  target: string[]
}

export interface LayoutConfig {
  id: string
  type: string
  position: { x: number; y: number }
  data: { title: string }
  draggable: boolean
  selectable: boolean
  zIndex: number
  style: { width: string; height: string }
  sectionPositions?: any
}

export interface RealFlowData {
  averageThruputTime30: number
  nodes: RealFlowNode[]
  processingSections: ProcessingSection[]
  systemConnections: SystemConnection[]
  layOutConfig: LayoutConfig[]
}

export function useGetWiresFlow() {
  const [flowData, setFlowData] = useState<RealFlowData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const realFlowData: RealFlowData = {
          averageThruputTime30: 63.68,
          nodes: [
            {
              id: "11554",
              label: "SAG",
              category: "Origination",
              isTrafficFlowing: false,
              currentThruputTime30: 0,
              averageThruputTime30: 0,
              systemHealth: "",
              splunkDatas: [],
              step: 1,
            },
            {
              id: "41107",
              label: "CPMobile",
              category: "Origination",
              isTrafficFlowing: false,
              currentThruputTime30: 0,
              averageThruputTime30: 0,
              systemHealth: "Healthy",
              splunkDatas: [
                {
                  aiT_NUM: "41107",
                  aiT_NAME: "CPMOBILE",
                  floW_DIRECTION: null,
                  floW_AIT_NUM: "28950",
                  floW_AIT_NAME: "CPO Pay",
                  iS_TRAFFIC_FLOWING: "Yes",
                  iS_TRAFFIC_ON_TREND: "Trend (-24.99%)",
                  averagE_TRANSACTION_COUNT: "13.33",
                  currenT_TRANSACTION_COUNT: "10",
                  historic_STD: "4.01",
                  historic_MEAN: "6.56",
                  currenT_STD_VARIATION: "0.86",
                },
              ],
              step: 1,
            },
            {
              id: "48581",
              label: "Loan IQ",
              category: "Origination",
              isTrafficFlowing: false,
              currentThruputTime30: 0,
              averageThruputTime30: 0,
              systemHealth: "Healthy",
              splunkDatas: [
                {
                  aiT_NUM: "48581",
                  aiT_NAME: "Loan IQ",
                  floW_DIRECTION: null,
                  floW_AIT_NUM: "8979",
                  floW_AIT_NAME: "",
                  iS_TRAFFIC_FLOWING: "No",
                  iS_TRAFFIC_ON_TREND: "No Historical Traffic",
                  averagE_TRANSACTION_COUNT: "0",
                  currenT_TRANSACTION_COUNT: "0",
                  historic_STD: "437.27",
                  historic_MEAN: "349.44",
                  currenT_STD_VARIATION: "-0.80",
                },
              ],
              step: 1,
            },
            {
              id: "54071",
              label: "DTS_B2B1",
              category: "Origination",
              isTrafficFlowing: false,
              currentThruputTime30: 18.57,
              averageThruputTime30: 18.48,
              systemHealth: "Healthy",
              splunkDatas: [
                {
                  aiT_NUM: "54071",
                  aiT_NAME: "DTS_B2B1",
                  floW_DIRECTION: null,
                  floW_AIT_NUM: "28960",
                  floW_AIT_NAME: "CPO Pay",
                  iS_TRAFFIC_FLOWING: "No",
                  iS_TRAFFIC_ON_TREND: "On-Trend (10.81%)",
                  averagE_TRANSACTION_COUNT: "6496.00",
                  currenT_TRANSACTION_COUNT: "7198",
                  historic_STD: "1989.72",
                  historic_MEAN: "2355.27",
                  currenT_STD_VARIATION: "-2.43",
                },
              ],
              step: 1,
            },
            {
              id: "71800",
              label: "APIGW",
              category: "Origination",
              isTrafficFlowing: false,
              currentThruputTime30: 0,
              averageThruputTime30: 0,
              systemHealth: "Healthy",
              splunkDatas: [
                {
                  aiT_NUM: "71800",
                  aiT_NAME: "APIGW",
                  floW_DIRECTION: null,
                  floW_AIT_NUM: "28960",
                  floW_AIT_NAME: "CPO Pay",
                  iS_TRAFFIC_FLOWING: "Yes",
                  iS_TRAFFIC_ON_TREND: "Approaching-Trend (-11.42%)",
                  averagE_TRANSACTION_COUNT: "951.67",
                  currenT_TRANSACTION_COUNT: "843",
                  historic_STD: "344.87",
                  historic_MEAN: "385.81",
                  currenT_STD_VARIATION: "-1.33",
                },
              ],
              step: 1,
            },
            {
              id: "512",
              label: "SCP",
              category: "Payment Validation and Routing",
              isTrafficFlowing: false,
              currentThruputTime30: 0,
              averageThruputTime30: 0,
              systemHealth: "Healthy",
              splunkDatas: [
                {
                  aiT_NUM: "512",
                  aiT_NAME: "SCP",
                  floW_DIRECTION: "Received",
                  floW_AIT_NUM: "0",
                  floW_AIT_NAME: "SCP Clearing House",
                  iS_TRAFFIC_FLOWING: "Yes",
                  iS_TRAFFIC_ON_TREND: "Off-Trend (-34.96%)",
                  averagE_TRANSACTION_COUNT: "3550.67",
                  currenT_TRANSACTION_COUNT: "2580",
                  historic_STD: "735.65",
                  historic_MEAN: "3947.33",
                  currenT_STD_VARIATION: "-1.54",
                },
              ],
              step: 1,
            },
            {
              id: "834",
              label: "ECS",
              category: "Payment Validation and Routing",
              isTrafficFlowing: false,
              currentThruputTime30: 0,
              averageThruputTime30: 0,
              systemHealth: "Healthy",
              splunkDatas: [
                {
                  aiT_NUM: "834",
                  aiT_NAME: "ECS",
                  floW_DIRECTION: "OUTBOUND TO",
                  floW_AIT_NUM: "1901",
                  floW_AIT_NAME: "ECS TO WTX (via MRP) - All US Wire Messages",
                  iS_TRAFFIC_FLOWING: "Yes",
                  iS_TRAFFIC_ON_TREND: "On-Trend (~4.13%)",
                  averagE_TRANSACTION_COUNT: "20130.25",
                  currenT_TRANSACTION_COUNT: "19298",
                  historic_STD: "2810.00",
                  historic_MEAN: "15697.26",
                  currenT_STD_VARIATION: "1.28",
                },
              ],
              step: 2,
            },
            {
              id: "15227",
              label: "FRP US",
              category: "Payment Validation and Routing",
              isTrafficFlowing: false,
              currentThruputTime30: 31.03,
              averageThruputTime30: 30.03,
              systemHealth: "Healthy",
              splunkDatas: [
                {
                  aiT_NUM: "15227",
                  aiT_NAME: "File Request Processor US",
                  floW_DIRECTION: "Outbound",
                  floW_AIT_NUM: "834",
                  floW_AIT_NAME: "ECS(Complete)",
                  iS_TRAFFIC_FLOWING: "Yes",
                  iS_TRAFFIC_ON_TREND: "On-Trend (46.85%)",
                  averagE_TRANSACTION_COUNT: "317.33",
                  currenT_TRANSACTION_COUNT: "466",
                  historic_STD: "1971.46",
                  historic_MEAN: "2419.37",
                  currenT_STD_VARIATION: "-0.99",
                },
              ],
              step: 2,
            },
            {
              id: "28960",
              label: "CPO-PAY",
              category: "Payment Validation and Routing",
              isTrafficFlowing: false,
              currentThruputTime30: 0.78,
              averageThruputTime30: 0.83,
              systemHealth: "Healthy",
              splunkDatas: [
                {
                  aiT_NUM: "28960",
                  aiT_NAME: "CashPro Payments",
                  floW_DIRECTION: "INBOUND FROM",
                  floW_AIT_NUM: "71800",
                  floW_AIT_NAME: "API_GATEWAY",
                  iS_TRAFFIC_FLOWING: "Yes",
                  iS_TRAFFIC_ON_TREND: "Approaching-Trend (-13.08%)",
                  averagE_TRANSACTION_COUNT: "956.00",
                  currenT_TRANSACTION_COUNT: "831",
                  historic_STD: "344.81",
                  historic_MEAN: "377.91",
                  currenT_STD_VARIATION: "1.33",
                },
              ],
              step: 2,
            },
            {
              id: "31427",
              label: "PSH",
              category: "Payment Validation and Routing",
              isTrafficFlowing: false,
              currentThruputTime30: 0,
              averageThruputTime30: 0,
              systemHealth: "Healthy",
              splunkDatas: [
                {
                  aiT_NUM: "31427",
                  aiT_NAME: "Payments Services Hub",
                  floW_DIRECTION: "OUTBOUND TO",
                  floW_AIT_NUM: "4679",
                  floW_AIT_NAME: "MRP(COMPLETE)",
                  iS_TRAFFIC_FLOWING: "Yes",
                  iS_TRAFFIC_ON_TREND: "On-Trend (62.36%)",
                  averagE_TRANSACTION_COUNT: "16995.75",
                  currenT_TRANSACTION_COUNT: "27594",
                  historic_STD: "3325.86",
                  historic_MEAN: "5663.96",
                  currenT_STD_VARIATION: "6.59",
                },
              ],
              step: 2,
            },
            {
              id: "70199",
              label: "GPO",
              category: "Payment Validation and Routing",
              isTrafficFlowing: false,
              currentThruputTime30: 2.18,
              averageThruputTime30: 2.32,
              systemHealth: "Unknown",
              splunkDatas: [
                {
                  aiT_NUM: "70199",
                  aiT_NAME: "Global Payments Orchestrator",
                  floW_DIRECTION: "OUTBOUND TO",
                  floW_AIT_NUM: "1901",
                  floW_AIT_NAME: "WTX(Payout Initiated)",
                  iS_TRAFFIC_FLOWING: "No",
                  iS_TRAFFIC_ON_TREND: null,
                  averagE_TRANSACTION_COUNT: null,
                  currenT_TRANSACTION_COUNT: null,
                  historic_STD: null,
                  historic_MEAN: null,
                  currenT_STD_VARIATION: null,
                },
              ],
              step: 2,
            },
            {
              id: "4679",
              label: "mRP",
              category: "Middleware",
              isTrafficFlowing: false,
              currentThruputTime30: 0,
              averageThruputTime30: 0,
              systemHealth: "Healthy",
              splunkDatas: [
                {
                  aiT_NUM: "4679",
                  aiT_NAME: "mRP",
                  floW_DIRECTION: null,
                  floW_AIT_NUM: null,
                  floW_AIT_NAME: "ECS to WTX via mRP",
                  iS_TRAFFIC_FLOWING: "Yes",
                  iS_TRAFFIC_ON_TREND: "On-Trend (-4.13%)",
                  averagE_TRANSACTION_COUNT: "20130.25",
                  currenT_TRANSACTION_COUNT: "19298",
                  historic_STD: "5694.62",
                  historic_MEAN: "7268.67",
                  currenT_STD_VARIATION: "2.11",
                },
              ],
              step: 3,
            },
            {
              id: "60745",
              label: "RPI",
              category: "Middleware",
              isTrafficFlowing: false,
              currentThruputTime30: 0,
              averageThruputTime30: 0,
              systemHealth: "Healthy",
              splunkDatas: [
                {
                  aiT_NUM: "60745",
                  aiT_NAME: "RPI",
                  floW_DIRECTION: null,
                  floW_AIT_NUM: null,
                  floW_AIT_NAME: "WTX to ECS via RPI",
                  iS_TRAFFIC_FLOWING: "No",
                  iS_TRAFFIC_ON_TREND: "Approaching-Trend (-15.39%)",
                  averagE_TRANSACTION_COUNT: "197993.83333333334",
                  currenT_TRANSACTION_COUNT: "167517",
                  historic_STD: "52764.84",
                  historic_MEAN: "132922.00",
                  currenT_STD_VARIATION: "0.66",
                },
              ],
              step: 3,
            },
            {
              id: "515",
              label: "GBSAPS",
              category: "Payment Processing, Sanctions & Investigation",
              isTrafficFlowing: false,
              currentThruputTime30: 0,
              averageThruputTime30: 0,
              systemHealth: "Healthy",
              splunkDatas: [
                {
                  aiT_NUM: "515",
                  aiT_NAME: "GBS",
                  floW_DIRECTION: null,
                  floW_AIT_NUM: null,
                  floW_AIT_NAME: null,
                  iS_TRAFFIC_FLOWING: "No",
                  iS_TRAFFIC_ON_TREND: "On-Trend (5.35%)",
                  averagE_TRANSACTION_COUNT: "110180.25",
                  currenT_TRANSACTION_COUNT: "116076",
                  historic_STD: "1351.75",
                  historic_MEAN: "108655.97",
                  currenT_STD_VARIATION: "5.49",
                },
              ],
              step: 4,
            },
            {
              id: "1901",
              label: "WTX",
              category: "Payment Processing, Sanctions & Investigation",
              isTrafficFlowing: false,
              currentThruputTime30: 0,
              averageThruputTime30: 0,
              systemHealth: "Healthy",
              splunkDatas: [
                {
                  aiT_NUM: "1901",
                  aiT_NAME: "Wire Transfer System",
                  floW_DIRECTION: "INBOUND FROM",
                  floW_AIT_NUM: "46581",
                  floW_AIT_NAME: "ETS",
                  iS_TRAFFIC_FLOWING: "Yes",
                  iS_TRAFFIC_ON_TREND: "On-Trend (-6.03%)",
                  averagE_TRANSACTION_COUNT: "374150.00",
                  currenT_TRANSACTION_COUNT: "351594",
                  historic_STD: "104411.72",
                  historic_MEAN: "169888.37",
                  currenT_STD_VARIATION: "-1.74",
                },
              ],
              step: 4,
            },
            {
              id: "43929",
              label: "GFD",
              category: "Payment Processing, Sanctions & Investigation",
              isTrafficFlowing: false,
              currentThruputTime30: 0,
              averageThruputTime30: 0,
              systemHealth: "Healthy",
              splunkDatas: [
                {
                  aiT_NUM: "43929",
                  aiT_NAME: "GFD",
                  floW_DIRECTION: "OUTBOUND TO",
                  floW_AIT_NUM: "28960",
                  floW_AIT_NAME: "E2E_USWires_43929_GFD_CPC_PAYMENT_INFO",
                  iS_TRAFFIC_FLOWING: "Yes",
                  iS_TRAFFIC_ON_TREND: "On-Trend (115.81%)",
                  averagE_TRANSACTION_COUNT: "168535.50",
                  currenT_TRANSACTION_COUNT: "363722",
                  historic_STD: "62202.35",
                  historic_MEAN: "143756.45",
                  currenT_STD_VARIATION: "3.54",
                },
              ],
              step: 4,
            },
            {
              id: "46951",
              label: "ETS US",
              category: "Payment Processing, Sanctions & Investigation",
              isTrafficFlowing: false,
              currentThruputTime30: 49.51,
              averageThruputTime30: 1.74,
              systemHealth: "Healthy",
              splunkDatas: [
                {
                  aiT_NUM: "46951",
                  aiT_NAME: "ETS_US",
                  floW_DIRECTION: "Outbound",
                  floW_AIT_NUM: "46951",
                  floW_AIT_NAME: "E2E_US_ETS_Sanctions_Analytics",
                  iS_TRAFFIC_FLOWING: "Yes",
                  iS_TRAFFIC_ON_TREND: "Off-Trend (-23.77%)",
                  averagE_TRANSACTION_COUNT: "3300.75",
                  currenT_TRANSACTION_COUNT: "2516",
                  historic_STD: "438.54",
                  historic_MEAN: "3675.32",
                  currenT_STD_VARIATION: "-2.64",
                },
              ],
              step: 4,
            },
            {
              id: "62686",
              label: "GTMS",
              category: "Payment Processing, Sanctions & Investigation",
              isTrafficFlowing: false,
              currentThruputTime30: 0,
              averageThruputTime30: 0,
              systemHealth: "",
              splunkDatas: [],
              step: 4,
            },
            {
              id: "74014",
              label: "RTPF",
              category: "Payment Processing, Sanctions & Investigation",
              isTrafficFlowing: false,
              currentThruputTime30: 0,
              averageThruputTime30: 0,
              systemHealth: "",
              splunkDatas: [],
              step: 4,
            },
          ],
          processingSections: [
            {
              id: "bg-middleware",
              title: "Middleware",
              averageThroughputTime: 0,
              aitNumber: ["4679", "60745"],
            },
            {
              id: "bg-origination",
              title: "Origination",
              averageThroughputTime: 18.48,
              aitNumber: ["11554", "41107", "48581", "54071", "71800"],
            },
            {
              id: "bg-processing",
              title: "Payment Processing, Sanctions & Investigation",
              averageThroughputTime: 1.74,
              aitNumber: ["515", "1901", "43929", "46951", "62686", "74014"],
            },
            {
              id: "bg-validation",
              title: "Payment Validation and Routing",
              averageThroughputTime: 30.03,
              aitNumber: ["512", "834", "15227", "28960", "31427", "70199"],
            },
          ],
          systemConnections: [
            { id: "SAG", source: "11554", target: ["512"] },
            { id: "CPMobile", source: "41107", target: ["28960"] },
            { id: "Loan IQ", source: "48581", target: ["4679"] },
            { id: "DTS_B2BT", source: "54071", target: ["28960", "834"] },
            { id: "APIGW", source: "71800", target: ["28960"] },
            { id: "SAA", source: "512", target: ["11554", "74014"] },
            { id: "ECS", source: "834", target: ["54071", "15227", "4679"] },
            { id: "FRP US", source: "15227", target: ["28960", "834"] },
            { id: "CPO-PAY", source: "28960", target: ["41107", "54071", "31427", "4679"] },
            { id: "PSH", source: "31427", target: ["515", "1901"] },
            { id: "RP", source: "4679", target: ["48581", "31427", "834", "515", "46951", "43929", "70199"] },
            { id: "RPI", source: "60745", target: ["70199", "1901"] },
            { id: "GBSAPS", source: "515", target: ["70199", "4679"] },
            { id: "WTX", source: "1901", target: ["60745", "4679", "74014"] },
            { id: "GFD", source: "43929", target: ["28960", "4679"] },
            { id: "ETS US", source: "46951", target: ["4679"] },
            { id: "GTMS", source: "62686", target: ["4679"] },
            { id: "RTPF", source: "74014", target: ["512", "70199", "1901"] },
          ],
          layOutConfig: [
            {
              id: "bg-origination",
              type: "background",
              position: { x: 0, y: 0 },
              data: { title: "Origination" },
              draggable: false,
              selectable: false,
              zIndex: -1,
              style: { width: "350px", height: "960px" },
            },
            {
              id: "bg-validation",
              type: "background",
              position: { x: 350, y: 0 },
              data: { title: "Payment Validation and Routing" },
              draggable: false,
              selectable: false,
              zIndex: -1,
              style: { width: "350px", height: "960px" },
            },
            {
              id: "bg-middleware",
              type: "background",
              position: { x: 700, y: 0 },
              data: { title: "Middleware" },
              draggable: false,
              selectable: false,
              zIndex: -1,
              style: { width: "450px", height: "960px" },
            },
            {
              id: "bg-processing",
              type: "background",
              position: { x: 1150, y: 0 },
              data: { title: "Payment Processing, Sanctions & Investigation" },
              draggable: false,
              selectable: false,
              zIndex: -1,
              style: { width: "500px", height: "960px" },
            },
          ],
        }

        console.log("[v0] Real flow data loaded with", realFlowData.nodes.length, "nodes")
        setFlowData(realFlowData)
        setIsLoading(false)
      } catch (err) {
        console.error("[v0] Error loading flow data:", err)
        setError(err as Error)
        setIsLoading(false)
      }
    }, 500) // Reduced delay

    return () => clearTimeout(timer)
  }, [])

  const refetch = () => {
    setIsLoading(true)
    setError(null)
    setFlowData(null)
  }

  return {
    flowData,
    nodes: flowData?.nodes || [],
    processingSections: flowData?.processingSections || [],
    systemConnections: flowData?.systemConnections || [],
    layoutConfig: flowData?.layOutConfig || [],
    isLoading,
    error,
    refetch,
    isError: !!error,
    isSuccess: !isLoading && !error && !!flowData,
  }
}

export { useGetWiresFlow as useGetSplunkWiresFlow }
