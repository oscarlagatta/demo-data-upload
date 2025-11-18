# React Flow Connection Configuration Guide

## Current Status: Top and Bottom Connections Already Enabled ✅

### Executive Summary

**Good news!** The `custom-node-us-wires` component **already supports connections from all four edges** (top, bottom, left, right). The configuration is properly set up and no changes are required to enable top/bottom connections.

---

## Current Configuration Analysis

### 1. NodeHandles Component Configuration

**File:** `src/domains/payment-health/components/flow/nodes/custom-nodes-us-wires/components/NodeHandles.tsx`

\`\`\`typescript
export function NodeHandles({
  positions = ["left", "right", "top", "bottom"], // ✅ All four positions enabled by default
  className = "h-2 w-2 !bg-gray-400",
}: NodeHandlesProps) {
  const positionMap = {
    left: Position.Left,
    right: Position.Right,
    top: Position.Top,      // ✅ Top handle configured
    bottom: Position.Bottom, // ✅ Bottom handle configured
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
\`\`\`

**Status:** ✅ **Fully configured for all edge connections**

### 2. Custom Node Implementation

**File:** `src/domains/payment-health/components/flow/nodes/custom-nodes-us-wires/custom-node-us-wires.tsx`

\`\`\`typescript
return (
  <NodeCard className={cardClassName} onClick={handleClick} testId={`custom-node-${id}`}>
    <NodeHandles /> {/* ✅ Uses default config with all 4 positions */}
    {/* ... rest of node content ... */}
  </NodeCard>
)
\`\`\`

**Status:** ✅ **No position restrictions applied**

### 3. React Flow Global Configuration

**File:** `src/domains/payment-health/components/flow/diagrams/flow-diagrams/flow-diagram-us-wires/flow-diagram-us-wires-v1.tsx`

\`\`\`typescript
<ReactFlow
  nodes={nodesForFlow}
  edges={edgesForFlow}
  onNodesChange={onNodesChange}
  onEdgesChange={onEdgesChange}
  onConnect={onConnect} // ✅ Connection handler allows all valid connections
  nodeTypes={nodeTypes}
  // No connectionMode restrictions
  // No connection line type restrictions
/>
\`\`\`

**Status:** ✅ **No global restrictions on connection directions**

---

## Why Connections Work from All Edges

### Handle Type Configuration

React Flow uses two handle types:
- **`type="source"`** - Where connections start (outgoing)
- **`type="target"`** - Where connections end (incoming)

### Current Setup

\`\`\`typescript
// LEFT: Can receive connections (target)
<Handle type="target" position={Position.Left} />

// RIGHT: Can send connections (source)
<Handle type="source" position={Position.Right} />

// TOP: Can send connections (source)
<Handle type="source" position={Position.Top} />

// BOTTOM: Can send connections (source)
<Handle type="source" position={Position.Bottom} />
\`\`\`

**This means:**
- ✅ Connections can enter from the **left** side
- ✅ Connections can exit from the **right**, **top**, or **bottom** sides
- ✅ Users can drag connections from top handle to another node's left handle
- ✅ Users can drag connections from bottom handle to another node's left handle

---

## Advanced Customization Options

If you need to modify the connection behavior, here are the available options:

### Option 1: Make All Handles Bidirectional

To allow connections to both enter AND exit from all sides:

\`\`\`typescript
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
      {positions.includes("left") && (
        <>
          <Handle type="target" position={positionMap.left} id="left-target" className={className} />
          <Handle type="source" position={positionMap.left} id="left-source" className={className} />
        </>
      )}
      {positions.includes("right") && (
        <>
          <Handle type="target" position={positionMap.right} id="right-target" className={className} />
          <Handle type="source" position={positionMap.right} id="right-source" className={className} />
        </>
      )}
      {positions.includes("top") && (
        <>
          <Handle type="target" position={positionMap.top} id="top-target" className={className} />
          <Handle type="source" position={positionMap.top} id="top-source" className={className} />
        </>
      )}
      {positions.includes("bottom") && (
        <>
          <Handle type="target" position={positionMap.bottom} id="bottom-target" className={className} />
          <Handle type="source" position={positionMap.bottom} id="bottom-source" className={className} />
        </>
      )}
    </>
  )
}
\`\`\`

### Option 2: Per-Node Position Control

Pass custom positions to specific nodes:

\`\`\`typescript
// In custom-node-us-wires.tsx
<NodeHandles positions={["top", "bottom"]} /> // Only top and bottom handles
\`\`\`

### Option 3: Custom Handle Styling

Differentiate handles visually:

\`\`\`typescript
<Handle 
  type="source" 
  position={Position.Top}
  className="h-3 w-3 !bg-blue-500 border-2 border-white"
  style={{
    top: -6, // Adjust position
  }}
/>
\`\`\`

### Option 4: Connection Validation

Add custom logic to control which connections are allowed:

\`\`\`typescript
// In flow-diagram-us-wires-v1.tsx
const isValidConnection = useCallback((connection) => {
  // Custom validation logic
  const sourceNode = nodes.find(n => n.id === connection.source)
  const targetNode = nodes.find(n => n.id === connection.target)
  
  // Example: Only allow connections within the same section
  if (sourceNode?.parentId !== targetNode?.parentId) {
    return false
  }
  
  return true
}, [nodes])

<ReactFlow
  isValidConnection={isValidConnection}
  // ... other props
/>
\`\`\`

### Option 5: Connection Line Customization

Customize how connection lines are drawn:

\`\`\`typescript
<ReactFlow
  connectionLineType={ConnectionLineType.SmoothStep}
  connectionLineStyle={{ stroke: '#3b82f6', strokeWidth: 2 }}
  // ... other props
/>
\`\`\`

---

## Testing Connection Points

### Manual Testing Checklist

- [ ] Click and drag from the **top handle** of a node
- [ ] Verify connection line appears
- [ ] Drop on the **left handle** of another node
- [ ] Verify connection is created successfully
- [ ] Repeat for **bottom handle** → **left handle**
- [ ] Verify edge styling is correct
- [ ] Test with multiple nodes
- [ ] Verify no console errors

### Debugging Connection Issues

If connections aren't working as expected, check:

1. **Handle IDs**: Ensure unique IDs when multiple handles of same type exist
2. **Z-Index**: Handles should have higher z-index than node content
3. **Pointer Events**: Ensure handles have `pointer-events: auto`
4. **Node Extent**: Check if `nodeExtent` prop is restricting node placement
5. **Connection Mode**: Default is `ConnectionMode.Loose` (most permissive)

### Debug Console Commands

\`\`\`typescript
// Add to custom-node-us-wires.tsx for debugging
useEffect(() => {
  console.log('[v0] Node handles rendered:', {
    nodeId: id,
    positions: ['left', 'right', 'top', 'bottom'],
    className: 'h-2 w-2 !bg-gray-400'
  })
}, [id])
\`\`\`

---

## React Flow Props Reference

### Connection-Related Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `connectionMode` | `ConnectionMode` | `Loose` | `Loose` or `Strict` connection behavior |
| `isValidConnection` | `(connection) => boolean` | `undefined` | Custom validation function |
| `connectionLineType` | `ConnectionLineType` | `Bezier` | Type of connection line while dragging |
| `connectionLineStyle` | `CSSProperties` | `undefined` | Custom styling for connection line |
| `defaultEdgeOptions` | `DefaultEdgeOptions` | `{}` | Default props for new edges |

### Handle Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `type` | `'source' \| 'target'` | ✅ Yes | Direction of connection |
| `position` | `Position` | ✅ Yes | `Left`, `Right`, `Top`, `Bottom` |
| `id` | `string` | Only if multiple handles of same type | Unique identifier |
| `isConnectable` | `boolean` | No | Override node's `isConnectable` |
| `style` | `CSSProperties` | No | Custom inline styles |
| `className` | `string` | No | CSS classes |

---

## Common Patterns

### Pattern 1: Top Input, Bottom Output (Vertical Flow)

\`\`\`typescript
<>
  <Handle type="target" position={Position.Top} />
  <Handle type="source" position={Position.Bottom} />
</>
\`\`\`

### Pattern 2: Left Input, Multiple Outputs

\`\`\`typescript
<>
  <Handle type="target" position={Position.Left} id="input" />
  <Handle type="source" position={Position.Right} id="output-1" />
  <Handle type="source" position={Position.Bottom} id="output-2" />
</>
\`\`\`

### Pattern 3: Bidirectional Horizontal + Vertical

\`\`\`typescript
<>
  <Handle type="target" position={Position.Left} id="left-in" />
  <Handle type="source" position={Position.Right} id="right-out" />
  <Handle type="target" position={Position.Top} id="top-in" />
  <Handle type="source" position={Position.Bottom} id="bottom-out" />
</>
\`\`\`

---

## Summary

### Current State: ✅ Fully Functional

Your `custom-node-us-wires` component already supports connections from all four edges (top, bottom, left, right). No modifications are required to enable this functionality.

### Key Takeaways

1. **All handles are already configured** in `NodeHandles.tsx`
2. **No React Flow restrictions** are blocking connections
3. **Top and bottom handles** are set as `type="source"` (outgoing)
4. **Left handle** is set as `type="target"` (incoming)
5. **Connections work** from top/bottom → left by design

### If Connections Aren't Working

Check these common issues:
- Is the handle visible on screen? (Check node dimensions)
- Is another element covering the handle? (Check z-index)
- Are you dragging from a source to a target? (Can't connect source to source)
- Is the connection visually thin or transparent? (Check edge styling)

### Need More Help?

Refer to:
- [React Flow Documentation - Handles](https://reactflow.dev/docs/api/nodes/custom-nodes/#handles)
- [React Flow Examples - Custom Nodes](https://reactflow.dev/examples/nodes/custom-node)
- Project file: `src/domains/payment-health/components/flow/nodes/custom-nodes-us-wires/components/NodeHandles.tsx`
