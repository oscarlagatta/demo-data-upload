import { Handle, Position } from "@xyflow/react"

interface NodeHandlesProps {
  positions?: Array<"left" | "right" | "top" | "bottom">
  className?: string
}

export function NodeHandles({
  positions = ["left", "right", "top", "bottom"],
  className = "h-2 w-2 !bg-gray-400",
}: NodeHandlesProps) {
  const positionMap = {
    left: Position.Left,
    right: Position.Right,
    top: Position.Top,
    bottom: Position.Bottom,
  }

  return (
    <>
      {positions.includes("left") && <Handle type="target" position={positionMap.left} className={className} />}
      {positions.includes("right") && <Handle type="source" position={positionMap.right} className={className} />}
      {positions.includes("top") && <Handle type="source" position={positionMap.top} className={className} />}
      {positions.includes("bottom") && <Handle type="source" position={positionMap.bottom} className={className} />}
    </>
  )
}
