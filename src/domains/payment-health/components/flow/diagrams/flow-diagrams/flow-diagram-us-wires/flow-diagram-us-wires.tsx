"use client"
import { useCallback, useEffect, useMemo, useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { type NodeTypes, ReactFlowProvider } from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { useTransactionSearchUsWiresContext } from "@/domains/payment-health/providers/us-wires/us-wires-transaction-search-provider"
import type { FlowDiagramProps } from "@/domains/payment-health/types/flow-diagram-types"
import { InfoSection } from "../../../../indicators/info-section/info-section"
import PaymentSearchBoxUsWires from "@/domains/payment-health/components/search/payment-search-box-us-wires/payment-search-box-us-wires"
import CustomNodeUsWires from "@/domains/payment-health/components/flow/nodes/custom-nodes-us-wires/custom-node-us-wires"
import SectionBackgroundNode from "@/domains/payment-health/components/flow/nodes/expandable-charts/section-background-node"
import { useFlowDataBackEnd } from "@/domains/payment-health/assets/flow-data-us-wires/flow-data-use-wires-back-end"
import { FlowUsWires } from "./flow-us-wires"

const createNodeTypes = (
  isShowHiden: boolean,
  onHideSearch: () => void,
  splunkData: any[],
  sectionTimings: Record<string, { duration: number; trend: string }> | null,
): NodeTypes => ({
  custom: (props) => (
    <CustomNodeUsWires {...props} isShowHiden={isShowHiden} onHideSearch={onHideSearch} splunkData={splunkData} />
  ),
  background: (props: any) => (
    <SectionBackgroundNode
      isHide={isShowHiden}
      {...props}
      duration={sectionTimings?.[props.id]?.duration}
      trend={sectionTimings?.[props.id]?.trend}
    />
  ),
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 3,
    },
  },
})

export function FlowDiagramUsWires({ isMonitoringMode = false }: FlowDiagramProps) {
  const { showAmountSearchResults, amountSearchParams } = useTransactionSearchUsWiresContext()
  const [showSearchBox, setShowSearchBox] = useState(true)

  const { sectionTimings, totalProcessingTime, splunkData, isLoading, error, refetch } = useFlowDataBackEnd()

  const [isShowHiden, setIsShowHiden] = useState(isMonitoringMode)

  useEffect(() => {
    setIsShowHiden(isMonitoringMode)
  }, [isMonitoringMode])

  const nodeTypes = useMemo(
    () => createNodeTypes(isShowHiden, () => setShowSearchBox((prev) => !prev), splunkData || [], sectionTimings),
    [isShowHiden, splunkData, sectionTimings],
  )

  const handleRefetch = useCallback(() => {
    if (refetch) {
      refetch()
    }
  }, [refetch])

  return (
    <QueryClientProvider client={queryClient}>
      <ReactFlowProvider>
        {showSearchBox && <PaymentSearchBoxUsWires />}
        <InfoSection time={totalProcessingTime || 0} />
        {showAmountSearchResults && amountSearchParams ? (
          <>
            <div>TransactionSearchResultsGrid Shows</div>
          </>
        ) : (
          <FlowUsWires
            nodeTypes={nodeTypes}
            onShowSearchBox={() => setShowSearchBox(true)}
            splunkData={splunkData}
            sectionTimings={sectionTimings}
            totalProcessingTime={totalProcessingTime}
            isLoading={isLoading}
            isError={!!error}
            onRefetch={handleRefetch}
          />
        )}
      </ReactFlowProvider>
    </QueryClientProvider>
  )
}
