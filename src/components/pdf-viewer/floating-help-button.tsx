"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"
import { PdfViewerModal } from "./pdf-viewer-modal"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface FloatingHelpButtonProps {
  pdfUrl: string
  title?: string
}

export function FloatingHelpButton({ pdfUrl, title = "Application Guide" }: FloatingHelpButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Floating Action Button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setIsOpen(true)}
              className="fixed top-4 right-4 z-50 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-blue-600 hover:bg-blue-700 text-white"
              size="icon"
              aria-label="Open help documentation"
            >
              <BookOpen className="h-6 w-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left" className="mr-2">
            <p className="font-medium">Application Guide</p>
            <p className="text-xs text-muted-foreground">Click to view documentation</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* PDF Viewer Modal */}
      <PdfViewerModal isOpen={isOpen} onClose={() => setIsOpen(false)} pdfUrl={pdfUrl} title={title} />
    </>
  )
}
