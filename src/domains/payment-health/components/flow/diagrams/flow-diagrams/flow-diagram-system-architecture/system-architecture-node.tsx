"use client"

import { memo } from "react"
import type { NodeProps } from "@xyflow/react"
import { Card } from "@/components/ui/card"
import { Handle, Position } from "@xyflow/react"
import {
  Shield,
  Database,
  Server,
  Globe,
  Lock,
  AlertCircle,
  Search,
  FileText,
  Building2,
  Laptop,
  Network,
} from "lucide-react"

interface SystemNodeData {
  title: string
  subtitle?: string
  features?: string[]
  icon?: string
  category?: "external" | "processing" | "core" | "compliance" | "clearing" | "limits"
  isSelected?: boolean
  isConnected?: boolean
  isDimmed?: boolean
  onClick?: (nodeId: string) => void
}

const iconMap = {
  shield: Shield,
  database: Database,
  server: Server,
  globe: Globe,
  lock: Lock,
  alert: AlertCircle,
  search: Search,
  file: FileText,
  building: Building2,
  laptop: Laptop,
  network: Network,
}

const SystemArchitectureNode = ({ data, id }: NodeProps<SystemNodeData>) => {
  const IconComponent = data.icon ? iconMap[data.icon as keyof typeof iconMap] : Server

  const getCategoryStyles = () => {
    switch (data.category) {
      case "external":
        return "bg-[#e8dcc8] border-[#d4c4a8]"
      case "processing":
        return "bg-[#e8dcc8] border-[#d4c4a8]"
      case "core":
        return "bg-[#e8dcc8] border-[#d4c4a8]"
      case "compliance":
        return "bg-[#e8dcc8] border-[#d4c4a8]"
      case "clearing":
        return "bg-[#e8dcc8] border-[#d4c4a8]"
      case "limits":
        return "bg-[#2a3f5f] border-[#1a2f4f] text-white"
      default:
        return "bg-[#e8dcc8] border-[#d4c4a8]"
    }
  }

  const handleClick = () => {
    if (data.onClick) {
      data.onClick(id)
    }
  }

  const cardClassName = `
    ${getCategoryStyles()}
    border-2 rounded-lg p-3 shadow-md cursor-pointer
    transition-all duration-200
    ${data.isSelected ? "ring-2 ring-blue-500 shadow-lg" : ""}
    ${data.isConnected ? "ring-2 ring-blue-300" : ""}
    ${data.isDimmed ? "opacity-30" : "opacity-100"}
    hover:shadow-lg
    min-w-[160px] max-w-[220px]
  `

  return (
    <Card className={cardClassName} onClick={handleClick}>
      {/* Connection handles */}
      <Handle type="target" position={Position.Left} className="h-2 w-2 !bg-gray-400" />
      <Handle type="source" position={Position.Right} className="h-2 w-2 !bg-gray-400" />
      <Handle type="target" position={Position.Top} className="h-2 w-2 !bg-gray-400" />
      <Handle type="source" position={Position.Bottom} className="h-2 w-2 !bg-gray-400" />

      {/* Node content */}
      <div className="flex flex-col gap-2">
        {/* Header with icon and title */}
        <div className="flex items-center gap-2">
          <div className={`rounded p-1 ${data.category === "limits" ? "bg-blue-600" : "bg-blue-500"}`}>
            <IconComponent className="h-4 w-4 text-white" />
          </div>
          <h3 className={`text-sm font-bold ${data.category === "limits" ? "text-white" : "text-blue-600"}`}>
            {data.title}
          </h3>
        </div>

        {/* Subtitle */}
        {data.subtitle && (
          <p className={`text-xs ${data.category === "limits" ? "text-gray-300" : "text-gray-600"}`}>{data.subtitle}</p>
        )}

        {/* Features list */}
        {data.features && data.features.length > 0 && (
          <ul className={`space-y-0.5 text-xs ${data.category === "limits" ? "text-gray-300" : "text-gray-700"}`}>
            {data.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-1">•</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  )
}

export default memo(SystemArchitectureNode)
