"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Save, X } from "lucide-react"
import { toast } from "sonner"

export interface NodeEditData {
  id: string
  title: string
  subtext: string
  averageThruputTime30?: number
  currentThruputTime30?: number
  position?: { x: number; y: number }
  metadata?: Record<string, any>
}

interface NodeEditDialogProps {
  isOpen: boolean
  onClose: () => void
  nodeData: NodeEditData
  onSave: (updatedData: NodeEditData) => Promise<void>
}

export function NodeEditDialog({ isOpen, onClose, nodeData, onSave }: NodeEditDialogProps) {
  const [formData, setFormData] = useState<NodeEditData>(nodeData)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    const changed = JSON.stringify(formData) !== JSON.stringify(nodeData)
    setHasChanges(changed)
  }, [formData, nodeData])

  useEffect(() => {
    if (isOpen) {
      setFormData(nodeData)
      setHasChanges(false)
    }
  }, [isOpen, nodeData])

  const handleSave = async () => {
    console.log("[v0] NodeEditDialog: Saving node data", formData)
    setIsSaving(true)

    try {
      await onSave(formData)
      toast.success("Node updated successfully", {
        description: `${formData.title} has been saved to the database`,
      })
      onClose()
    } catch (error) {
      console.error("[v0] NodeEditDialog: Save failed", error)
      toast.error("Failed to save node", {
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Node Configuration</DialogTitle>
          <DialogDescription>
            Make changes to the node properties. Click save to persist changes to the database.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Node ID (read-only) */}
          <div className="grid gap-2">
            <Label htmlFor="node-id" className="text-sm font-medium">
              Node ID
            </Label>
            <Input id="node-id" value={formData.id} disabled className="bg-muted" />
          </div>

          {/* Title */}
          <div className="grid gap-2">
            <Label htmlFor="node-title" className="text-sm font-medium">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="node-title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter node title"
              maxLength={100}
            />
          </div>

          {/* Subtext (AIT Number) */}
          <div className="grid gap-2">
            <Label htmlFor="node-subtext" className="text-sm font-medium">
              AIT Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="node-subtext"
              value={formData.subtext}
              onChange={(e) => setFormData({ ...formData, subtext: e.target.value })}
              placeholder="e.g., AIT-001"
              maxLength={50}
            />
          </div>

          {/* Average Throughput Time */}
          <div className="grid gap-2">
            <Label htmlFor="node-avg-time" className="text-sm font-medium">
              Average Throughput Time (ms)
            </Label>
            <Input
              id="node-avg-time"
              type="number"
              value={formData.averageThruputTime30 || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  averageThruputTime30: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              placeholder="Enter average time in milliseconds"
              min="0"
            />
          </div>

          {/* Position */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="node-x" className="text-sm font-medium">
                Position X
              </Label>
              <Input
                id="node-x"
                type="number"
                value={formData.position?.x || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    position: { ...formData.position, x: Number(e.target.value), y: formData.position?.y || 0 },
                  })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="node-y" className="text-sm font-medium">
                Position Y
              </Label>
              <Input
                id="node-y"
                type="number"
                value={formData.position?.y || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    position: { x: formData.position?.x || 0, y: Number(e.target.value) },
                  })
                }
              />
            </div>
          </div>

          {/* Metadata (JSON) */}
          <div className="grid gap-2">
            <Label htmlFor="node-metadata" className="text-sm font-medium">
              Additional Metadata (JSON)
            </Label>
            <Textarea
              id="node-metadata"
              value={JSON.stringify(formData.metadata || {}, null, 2)}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value)
                  setFormData({ ...formData, metadata: parsed })
                } catch {
                  // Invalid JSON, don't update
                }
              }}
              placeholder='{"key": "value"}'
              rows={4}
              className="font-mono text-xs"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges || isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
