"use client"
import { useCallback, useEffect, useMemo, useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { type NodeTypes, ReactFlowProvider } from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { useTransactionSearchUsWiresContext } from "@/src/domains/payment-health/providers/us-wires/us-wires-transaction-search-provider"
import type { FlowDiagramProps } from "@/src/domains/payment-health/types/flow-diagram-types"
import { InfoSection } from "@/src/domains/payment-health/components/indicators/info-section/info-section"
import PaymentSearchBoxUsWires from "@/src/domains/payment-health/components/search/payment-search-box-us-wires/payment-search-box-us-wires"
import CustomNodeUsWires from "@/src/domains/payment-health/components/flow/nodes/custom-nodes-us-wires/custom-node-us-wires"
import SectionBackgroundNode from "@/src/domains/payment-health/components/flow/nodes/expandable-charts/section-background-node"
import { useFlowDataBackEnd } from "@/src/domains/payment-health/assets/flow-data-us-wires/flow-data-use-wires-back-end"
import { FlowUsWires } from "@/src/domains/payment-health/components/flow/diagrams/flow-diagrams/flow-diagram-us-wires/flow-us-wires"

const createNodeTypes = (
  isShowHiden: boolean,
  onHideSearch: () => void,
  splunkData: any[],
  sectionTimings: Record<string, { duration: number; trend: string }> | null,
  isLoading: boolean,
  isError: boolean,
  isFetching: boolean,
): NodeTypes => ({
  custom: (props) => (
    <CustomNodeUsWires
      {...props}
      isShowHiden={isShowHiden}
      onHideSearch={onHideSearch}
      splunkData={splunkData}
      isLoading={isLoading}
      isError={isError}
      isFetching={isFetching}
    />
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
    () =>
      createNodeTypes(
        isShowHiden,
        () => setShowSearchBox((prev) => !prev),
        splunkData || [],
        sectionTimings,
        isLoading,
        !!error,
        false, // isFetching can be derived from other states if needed
      ),
    [isShowHiden, splunkData, sectionTimings, isLoading, error],
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
