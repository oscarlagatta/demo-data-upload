interface NodeMetricDisplayProps {
  value?: number
  label: string
  unit?: string
  precision?: number
  className?: string
  showWhenZero?: boolean
}

export function NodeMetricDisplay({
  value,
  label,
  unit = "",
  precision = 2,
  className = "text-blue-600",
  showWhenZero = false,
}: NodeMetricDisplayProps) {
  if (value === undefined || (!showWhenZero && value === 0)) {
    return null
  }

  return (
    <p className={`text-center text-[9px] font-medium mt-0.5 ${className}`}>
      {label}: {value.toFixed(precision)}
      {unit}
    </p>
  )
}
