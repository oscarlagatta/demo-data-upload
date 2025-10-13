"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { HelpCircle, BookOpen } from "lucide-react"
import { PdfViewerModal } from "./pdf-viewer-modal"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface HelpButtonProps {
  pdfUrl: string
  title?: string
  variant?: "icon" | "button"
  className?: string
}

export function HelpButton({ pdfUrl, title = "Application Guide", variant = "button", className }: HelpButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (variant === "icon") {
    return (
      <>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(true)}
                className={className}
                aria-label="Open help documentation"
              >
                <HelpCircle className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View Application Guide</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <PdfViewerModal isOpen={isOpen} onClose={() => setIsOpen(false)} pdfUrl={pdfUrl} title={title} />
      </>
    )
  }

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)} className={className}>
        <BookOpen className="h-4 w-4 mr-2" />
        Help & Documentation
      </Button>

      <PdfViewerModal isOpen={isOpen} onClose={() => setIsOpen(false)} pdfUrl={pdfUrl} title={title} />
    </>
  )
}
