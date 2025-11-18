import { Handle, Position } from "@xyflow/react"

interface NodeHandlesProps {
  positions?: Array<"left" | "right" | "top" | "bottom">
  className?: string
}

export function NodeHandles({
  positions = ["left", "right", "top", "bottom"],
  className = "h-3 w-3 !bg-blue-500 !border-2 !border-white hover:!bg-blue-600 hover:!scale-125 transition-all",
}: NodeHandlesProps) {
  const positionMap = {
    left: Position.Left,
    right: Position.Right,
    top: Position.Top,
    bottom: Position.Bottom,
  }

  const commonHandleProps = {
    isConnectable: true,
    className: `${className} !z-50`,
  }

  return (
    <>
      {positions.includes("left") && (
        <Handle 
          {...commonHandleProps}
          type="target" 
          position={positionMap.left} 
          id="left"
          style={{ 
            left: -6, // Extended handle outside node boundary for better visibility
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        />
      )}
      {positions.includes("right") && (
        <Handle 
          {...commonHandleProps}
          type="source" 
          position={positionMap.right} 
          id="right"
          style={{ 
            right: -6, // Extended handle outside node boundary
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        />
      )}
      {positions.includes("top") && (
        <Handle 
          {...commonHandleProps}
          type="target" // Changed to target to accept incoming connections
          position={positionMap.top} 
          id="top"
          style={{ 
            top: -6, // Extended handle outside node boundary
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        />
      )}
      {positions.includes("bottom") && (
        <Handle 
          {...commonHandleProps}
          type="source" 
          position={positionMap.bottom} 
          id="bottom"
          style={{ 
            bottom: -6, // Extended handle outside node boundary
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        />
      )}
    </>
  )
}
