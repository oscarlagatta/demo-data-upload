"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface PdfViewerModalProps {
  isOpen: boolean
  onClose: () => void
  pdfUrl: string
  title?: string
}

export function PdfViewerModal({ isOpen, onClose, pdfUrl, title = "Documentation" }: PdfViewerModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-[95vw] h-[95vh] p-0 gap-0 flex flex-col">
        <DialogHeader className="shrink-0 px-6 py-4 border-b">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 min-h-0 bg-gray-100 p-4 overflow-auto">
          <div className="w-full h-full flex items-start justify-center">
            <iframe
              src={pdfUrl}
              className="w-full h-full border-0 rounded shadow-lg bg-white"
              title={title}
              style={{
                minHeight: "100%",
              }}
            />
          </div>
        </div>

        <div className="shrink-0 px-6 py-3 border-t bg-gray-50 text-sm text-gray-600">
          <p className="text-center">
            Use your browser's built-in PDF controls to zoom, navigate, and download the document.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
