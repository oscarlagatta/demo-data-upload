"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, ZoomIn, ZoomOut, Download, Maximize2, Minimize2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface PdfViewerModalProps {
  isOpen: boolean
  onClose: () => void
  pdfUrl: string
  title?: string
}

export function PdfViewerModal({ isOpen, onClose, pdfUrl, title = "Documentation" }: PdfViewerModalProps) {
  const [zoom, setZoom] = useState(100)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 25, 200))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 25, 50))
  }

  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = pdfUrl
    link.download = "documentation.pdf"
    link.click()
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          "p-0 gap-0 flex flex-col",
          isFullscreen ? "max-w-[100vw] h-[100vh] w-[100vw]" : "max-w-[95vw] w-[95vw] h-[95vh]",
        )}
      >
        <div className="shrink-0 px-6 py-4 border-b bg-white shadow-sm flex flex-row items-center justify-between">
          <h2 className="text-xl font-semibold">{title}</h2>

          <div className="flex items-center gap-2">
            {/* Zoom controls */}
            <div className="flex items-center gap-1 border rounded-lg p-1 bg-gray-50">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomOut}
                disabled={zoom <= 50}
                className="h-8 w-8 p-0 hover:bg-white"
                aria-label="Zoom out"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium px-2 min-w-[4rem] text-center">{zoom}%</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleZoomIn}
                disabled={zoom >= 200}
                className="h-8 w-8 p-0 hover:bg-white"
                aria-label="Zoom in"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>

            {/* Fullscreen toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              className="h-8 w-8 p-0"
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>

            {/* Download button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="h-8 w-8 p-0"
              aria-label="Download PDF"
            >
              <Download className="h-4 w-4" />
            </Button>

            {/* Close button */}
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0" aria-label="Close">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 min-h-0 bg-gray-100 p-4 overflow-auto">
          <div className="w-full h-full flex items-start justify-center">
            <iframe
              src={`${pdfUrl}#view=FitH&zoom=${zoom}`}
              className="w-full h-full border-0 rounded shadow-lg bg-white"
              title={title}
              style={{
                minHeight: "100%",
              }}
            />
          </div>
        </div>

        <div className="shrink-0 px-6 py-3 border-t bg-gray-50 text-sm text-gray-600 shadow-sm">
          <p className="text-center">
            Use the controls above to zoom, download, or view in fullscreen. Scroll through the document using your
            mouse or trackpad.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
