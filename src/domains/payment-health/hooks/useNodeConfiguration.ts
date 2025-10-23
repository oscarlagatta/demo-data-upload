"use client"

/**
 * Custom hook for managing node configuration state and persistence
 *
 * This hook provides a clean interface for components to:
 * - Track node configuration changes
 * - Save changes to the database
 * - Handle optimistic updates
 * - Manage loading and error states
 */

import { useState, useCallback } from "react"
import { toast } from "sonner"
import { updateNodeConfiguration, batchUpdateNodeConfigurations } from "../api/node-configuration-api"
import type { NodeEditData } from "../components/flow/nodes/custom-nodes-us-wires/components/NodeEditDialog"

interface UseNodeConfigurationOptions {
  onSuccess?: (nodeId: string) => void
  onError?: (error: Error) => void
}

export function useNodeConfiguration(options: UseNodeConfigurationOptions = {}) {
  const [pendingChanges, setPendingChanges] = useState<Map<string, NodeEditData>>(new Map())
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  /**
   * Track a node change in memory (optimistic update)
   */
  const trackNodeChange = useCallback((nodeId: string, nodeData: NodeEditData) => {
    console.log("[v0] useNodeConfiguration: Tracking change for node", nodeId)
    setPendingChanges((prev) => {
      const updated = new Map(prev)
      updated.set(nodeId, nodeData)
      return updated
    })
  }, [])

  /**
   * Save a single node configuration to the database
   */
  const saveNodeConfiguration = useCallback(
    async (nodeData: NodeEditData) => {
      console.log("[v0] useNodeConfiguration: Saving node", nodeData.id)
      setIsSaving(true)

      try {
        const response = await updateNodeConfiguration(nodeData)

        // Remove from pending changes on success
        setPendingChanges((prev) => {
          const updated = new Map(prev)
          updated.delete(nodeData.id)
          return updated
        })

        setLastSaved(new Date())
        options.onSuccess?.(nodeData.id)

        console.log("[v0] useNodeConfiguration: Save successful", response)
        return response
      } catch (error) {
        console.error("[v0] useNodeConfiguration: Save failed", error)
        options.onError?.(error as Error)
        throw error
      } finally {
        setIsSaving(false)
      }
    },
    [options],
  )

  /**
   * Save all pending changes in a batch
   */
  const saveAllPendingChanges = useCallback(async () => {
    if (pendingChanges.size === 0) {
      toast.info("No pending changes to save")
      return
    }

    console.log("[v0] useNodeConfiguration: Saving all pending changes", pendingChanges.size)
    setIsSaving(true)

    try {
      const nodesToSave = Array.from(pendingChanges.values())
      const responses = await batchUpdateNodeConfigurations(nodesToSave)

      setPendingChanges(new Map())
      setLastSaved(new Date())

      toast.success(`Successfully saved ${responses.length} node(s)`)
      console.log("[v0] useNodeConfiguration: Batch save successful", responses)

      return responses
    } catch (error) {
      console.error("[v0] useNodeConfiguration: Batch save failed", error)
      toast.error("Failed to save some changes")
      throw error
    } finally {
      setIsSaving(false)
    }
  }, [pendingChanges])

  /**
   * Discard all pending changes
   */
  const discardPendingChanges = useCallback(() => {
    console.log("[v0] useNodeConfiguration: Discarding pending changes")
    setPendingChanges(new Map())
    toast.info("Pending changes discarded")
  }, [])

  /**
   * Check if a specific node has pending changes
   */
  const hasPendingChanges = useCallback(
    (nodeId: string) => {
      return pendingChanges.has(nodeId)
    },
    [pendingChanges],
  )

  return {
    // State
    pendingChanges,
    pendingChangesCount: pendingChanges.size,
    isSaving,
    lastSaved,

    // Actions
    trackNodeChange,
    saveNodeConfiguration,
    saveAllPendingChanges,
    discardPendingChanges,
    hasPendingChanges,
  }
}
