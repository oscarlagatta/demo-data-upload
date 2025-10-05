"use client"

import type React from "react"

import { useState } from "react"

type ActionType = "flow" | "trend" | "balanced"

interface UseNodeActionsProps {
  nodeId: string
  aitNum: string | null
  isLoading: boolean
  isFetching: boolean
  onNodeClick?: (nodeId: string) => void
  onActionClick?: (aitNum: string, action: ActionType) => void
  onHideSearch: () => void
  showTable: (aitNum: string) => Promise<void>
}

export function useNodeActions({
  nodeId,
  aitNum,
  isLoading,
  isFetching,
  onNodeClick,
  onActionClick,
  onHideSearch,
  showTable,
}: UseNodeActionsProps) {
  const [isDetailsLoading, setIsDetailsLoading] = useState(false)
  const [isIncidentSheetOpen, setIsIncidentSheetOpen] = useState(false)

  const handleClick = () => {
    if (onNodeClick && nodeId && !isLoading) {
      onNodeClick(nodeId)
    }
  }

  const triggerAction = (action: ActionType) => {
    if (!isLoading && !isFetching && aitNum && onActionClick) {
      onActionClick(aitNum, action)
    }
    onHideSearch()
  }

  const handleDetailsClick = async (e: React.MouseEvent) => {
    e.stopPropagation()

    if (aitNum && !isDetailsLoading) {
      setIsDetailsLoading(true)
      try {
        await showTable(aitNum)
      } finally {
        setTimeout(() => {
          setIsDetailsLoading(false)
        }, 500)
      }
    }
  }

  const handleCreateIncident = () => {
    setIsIncidentSheetOpen(true)
  }

  return {
    handleClick,
    triggerAction,
    handleDetailsClick,
    handleCreateIncident,
    isDetailsLoading,
    isIncidentSheetOpen,
    setIsIncidentSheetOpen,
  }
}
