// checked
import type { Node, NodeProps } from "@xyflow/react"
import SectionDurationBadge from "@/src/domains/payment-health/components/badges/section-duration-badge"

type SectionBackgroundNodeProps = {
  title: string
  color: string
  isDimmed?: boolean
  duration?: number
  trend?: "up" | "down" | "stable"
}

type SectionBackgroundNodeType = Node<SectionBackgroundNodeProps>

const SectionBackgroundNode = ({ data, isHide }: NodeProps<SectionBackgroundNodeType> & { isHide: boolean }) => {
  const hasValidDuration =
    data.duration !== undefined && data.duration !== null && !isNaN(data.duration) && data.duration >= 0

  const validTrend = data.trend && ["up", "down", "stable"].includes(data.trend) ? data.trend : "stable"

  return (
    <div
      className={`h-full w-full rounded-lg bg-white shadow-xl transition-all duration-200 ${
        data.isDimmed ? "opacity-60" : ""
      }`}
    >
      <div className="p-4">
        {hasValidDuration && (
          <div className="mb-3 flex justify-center">
            <SectionDurationBadge
              duration={data.duration!}
              sectionName={data.title}
              trend={validTrend}
              className="shadow-sm"
            />
          </div>
        )}
        <h2 className="mb-2 text-center text-lg font-bold text-gray-700">{data.title}</h2>

        {process.env.NODE_ENV === "development" && (
          <div style={{ display: "none" }}>
            {console.log(
              `[v0] SectionBackgroundNode ${data.title}: duration=${data.duration}, trend=${data.trend}, hasValidDuration=${hasValidDuration}`,
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default SectionBackgroundNode
