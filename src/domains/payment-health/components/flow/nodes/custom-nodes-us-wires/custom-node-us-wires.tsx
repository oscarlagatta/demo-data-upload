"use client"

import { memo } from "react"
import { useState, useCallback } from "react"
import type { NodeProps } from "@xyflow/react"
import { useTransactionSearchUsWiresContext } from "@/domains/payment-health/providers/us-wires/us-wires-transaction-search-provider"
import { CardLoadingSkeleton } from "../../../loading/loading-skeleton"
import { IncidentSheet } from "../../../sheets/incident-sheet"
import { useNodeState } from "./useNodeState"
import { useNodeActions } from "./useNodeActions"
import { NodeCard } from "./components/NodeCard"
import { NodeHeader } from "./components/NodeHeader"
import { NodeActionsMenu } from "./components/NodeActionsMenu"
import { NodeActionButtons } from "./components/NodeActionButtons"
import { NodeHandles } from "./components/NodeHandles"
import { NodeEditDialog, type NodeEditData } from "./components/NodeEditDialog"
import { useNodeConfiguration } from "@/domains/payment-health/hooks/useNodeConfiguration"
import { Edit } from "lucide-react"
import type { CustomNodeType } from "./types"

interface CustomNodeUsWiresProps extends NodeProps<CustomNodeType> {
  onHideSearch: () => void
  isShowHiden?: boolean
  splunkData?: any[]
  isLoading?: boolean
  isError?: boolean
  isFetching?: boolean
}

const CustomNodeUsWires = ({
  data,
  id,
  onHideSearch,
  isShowHiden,
  splunkData,
  isLoading = false,
  isError = false,
  isFetching = false,
}: CustomNodeUsWiresProps) => {
  const isAuthorized = true

  const { active: txActive, isFetching: txFetching, matchedAitIds, showTable } = useTransactionSearchUsWiresContext()

  const {
    aitNum,
    trendColorClass,
    trafficStatusColorClass,
    isDataLoading,
    inDefaultMode,
    inLoadingMode,
    inResultsMode,
    isMatched,
    cardClassName,
  } = useNodeState({
    subtext: data.subtext,
    splunkData,
    isLoading,
    isError,
    isFetching,
    isSelected: data.isSelected,
    isConnected: data.isConnected,
    isDimmed: data.isDimmed,
    txActive,
    txFetching,
    matchedAitIds,
  })

  const {
    handleClick,
    triggerAction,
    handleDetailsClick,
    handleCreateIncident,
    isDetailsLoading,
    isIncidentSheetOpen,
    setIsIncidentSheetOpen,
  } = useNodeActions({
    nodeId: id,
    aitNum,
    isLoading: isDataLoading,
    isFetching,
    onNodeClick: data.onClick,
    onActionClick: data.onActionClick,
    onHideSearch,
    showTable,
  })

  const { saveNodeConfiguration } = useNodeConfiguration()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const handleEditNode = useCallback(() => {
    console.log("[v0] CustomNodeUsWires: Opening edit dialog for node", id)
    setIsEditDialogOpen(true)
  }, [id])

  const handleSaveNodeConfig = useCallback(
    async (updatedData: NodeEditData) => {
      console.log("[v0] CustomNodeUsWires: Saving node configuration", updatedData)
      await saveNodeConfiguration(updatedData)
    },
    [saveNodeConfiguration],
  )

  if (isDataLoading) {
    return <CardLoadingSkeleton className="w-full" />
  }

  if (isError) {
    return <div className="text-red-500">Failed to load data. Please try again later.</div>
  }

  return (
    <>
      <NodeCard className={cardClassName} onClick={handleClick} testId={`custom-node-${id}`}>
        <NodeHandles />

        <NodeActionsMenu
          actions={[
            {
              label: "Edit Node Configuration",
              onClick: handleEditNode,
              icon: <Edit className="h-4 w-4" />,
            },
            { label: "Create Incident Ticket", onClick: handleCreateIncident },
          ]}
        />

        <NodeHeader
          title={data.title}
          subtitle={data.subtext}
          metric={data.averageThruputTime30}
          metricLabel="Avg"
          metricUnit="ms"
        />

        <NodeActionButtons
          mode={inDefaultMode ? "default" : inLoadingMode ? "loading" : "results"}
          isAuthorized={isAuthorized}
          isMatched={isMatched}
          isLoading={isFetching}
          isDetailsLoading={isDetailsLoading}
          flowClassName={trafficStatusColorClass}
          trendClassName={trendColorClass}
          onFlowClick={() => triggerAction("flow")}
          onTrendClick={() => triggerAction("trend")}
          onBalancedClick={() => triggerAction("balanced")}
          onDetailsClick={handleDetailsClick}
        />
      </NodeCard>

      <NodeEditDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        nodeData={{
          id,
          title: data.title,
          subtext: data.subtext,
          averageThruputTime30: data.averageThruputTime30,
          currentThruputTime30: data.currentThruputTime30,
        }}
        onSave={handleSaveNodeConfig}
      />

      <IncidentSheet
        isOpen={isIncidentSheetOpen}
        onClose={() => setIsIncidentSheetOpen(false)}
        nodeTitle={data.title}
        aitId={data.subtext}
      />
    </>
  )
}

export default memo(CustomNodeUsWires)
