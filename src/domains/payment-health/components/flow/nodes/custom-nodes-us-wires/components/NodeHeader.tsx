"use client"

import { CardHeader, CardTitle } from "@/components/ui/card"

interface NodeHeaderProps {
  title: string
  subtitle: string
  metric?: number
  metricLabel?: string
  metricUnit?: string
  metricPrecision?: number
  showMetricWhenZero?: boolean
}

/**
 * Reusable header component for custom nodes
 * Displays title, subtitle, and optional metric with formatting
 */
export function NodeHeader({
  title,
  subtitle,
  metric,
  metricLabel = "Avg",
  metricUnit = "ms",
  metricPrecision = 2,
  showMetricWhenZero = false,
}: NodeHeaderProps) {
  const shouldShowMetric = metric !== undefined && (showMetricWhenZero || metric > 0)

  return (
    <CardHeader className="p-2">
      <CardTitle className="text-center text-xs font-bold whitespace-nowrap">{title}</CardTitle>
      <p className="text-muted-foreground text-center text-[10px]">{subtitle}</p>
      {shouldShowMetric && (
        <p className="text-center text-[9px] text-blue-600 font-medium mt-0.5">
          {metricLabel}: {metric.toFixed(metricPrecision)}
          {metricUnit}
        </p>
      )}
    </CardHeader>
  )
}
