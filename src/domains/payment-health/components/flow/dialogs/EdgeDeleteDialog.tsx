"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertCircle } from 'lucide-react'

interface EdgeDeleteDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  sourceLabel?: string
  targetLabel?: string
  isLoading?: boolean
}

export function EdgeDeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  sourceLabel = "Unknown",
  targetLabel = "Unknown",
  isLoading = false,
}: EdgeDeleteDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-5 w-5 text-destructive" />
            </div>
            <DialogTitle>Remove Connection?</DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            Are you sure you want to remove the connection between{" "}
            <span className="font-semibold text-foreground">{sourceLabel}</span> and{" "}
            <span className="font-semibold text-foreground">{targetLabel}</span>?
          </DialogDescription>
          <div className="mt-3 rounded-md bg-muted p-3 text-sm text-muted-foreground">
            This action can be undone by reconnecting the nodes manually.
          </div>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "Removing..." : "Remove Connection"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
