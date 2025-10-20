# FlowSkeletonLoader Integration Guide

## Overview

The `FlowSkeletonLoader` component provides a dynamic loading skeleton that accurately mirrors the structure of the US Wires flow diagram. It interprets layout data from `get-wires-flow.json` to render section backgrounds, node placeholders, and connection lines that match the final diagram's appearance.

## Component Location

\`\`\`
src/domains/payment-health/components/flow/loading/flow-skeleton-loader.tsx
\`\`\`

## Key Features

- **Dynamic Layout Interpretation**: Reads `layOutConfig` from flow data to generate accurate skeleton structure
- **Configurable Node Positioning**: Accepts `firstNodeTopOffset` prop for precise vertical alignment
- **Section-Aware Rendering**: Automatically adjusts node dimensions based on section type
- **Connection Visualization**: Renders placeholder connection lines between sections
- **Responsive Design**: Adapts to different canvas dimensions

## Integration Steps

### 1. Import the Component

In your `flow-us-wires.tsx` file, import the FlowSkeletonLoader:

\`\`\`typescript
import { FlowSkeletonLoader } from "@/domains/payment-health/components/flow/loading/flow-skeleton-loader"
\`\`\`

### 2. Extract Layout Configuration

The `layOutConfig` is derived from the `flowNodes` array. Extract background nodes that contain section layout information:

\`\`\`typescript
const layOutConfig = useMemo(() => {
  if (!flowNodes || flowNodes.length === 0) return []

  // Find all background nodes which contain section layout information
  const backgroundNodes = flowNodes.filter((node) => node.type === "background")

  // Map background nodes to layout config format
  return backgroundNodes.map((node) => ({
    id: node.id,
    position: node.position,
    data: node.data,
    style: node.style || { width: "350px", height: "960px" },
    sectionPositions: (node.data as any).sectionPositions || { sections: {} },
  }))
}, [flowNodes])
\`\`\`

### 3. Render During Loading State

Use the skeleton loader as the early return when data is loading:

\`\`\`typescript
if (isLoading) {
  return <FlowSkeletonLoader layOutConfig={layOutConfig} />
}
\`\`\`

## Props Reference

### Required Props

None - the component works with default values if no props are provided.

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `layOutConfig` | `LayoutSection[]` | `[]` | Array of section layout configurations extracted from flow nodes |
| `canvasWidth` | `number` | `1650` | Total width of the flow diagram canvas in pixels |
| `canvasHeight` | `number` | `960` | Total height of the flow diagram canvas in pixels |
| `firstNodeTopOffset` | `number` | `50` | Vertical offset applied to the first node in each section for alignment |

### LayoutSection Interface

\`\`\`typescript
interface LayoutSection {
  id: string                    // Unique section identifier (e.g., "bg-origination")
  position: { x: number; y: number }  // Section's top-left position
  data: Record<string, any>     // Section metadata (title, label, etc.)
  style: CSSProperties          // Section dimensions and styling
  sectionPositions: {           // Node positions within the section
    sections: Record<string, {
      baseX: number
      positions: Array<{ x: number; y: number }>
    }>
  }
}
\`\`\`

## Advanced Usage

### Custom Node Positioning

Adjust the vertical positioning of nodes by providing a custom `firstNodeTopOffset`:

\`\`\`typescript
<FlowSkeletonLoader 
  layOutConfig={layOutConfig} 
  firstNodeTopOffset={75}  // Increase spacing from section top
/>
\`\`\`

### Custom Canvas Dimensions

Override default canvas dimensions for different layouts:

\`\`\`typescript
<FlowSkeletonLoader 
  layOutConfig={layOutConfig}
  canvasWidth={1800}
  canvasHeight={1080}
/>
\`\`\`

## Data Flow Architecture

\`\`\`
get-wires-flow.json
       ↓
get-wires-flow.tsx (hook)
       ↓
flow-us-wires.tsx (parent component)
       ↓
Extract layOutConfig from flowNodes
       ↓
FlowSkeletonLoader (skeleton component)
       ↓
Render skeleton structure
\`\`\`

## Best Practices

### 1. Memoize Layout Configuration

Always wrap `layOutConfig` extraction in `useMemo` to prevent unnecessary recalculations:

\`\`\`typescript
const layOutConfig = useMemo(() => {
  // Extract layout config logic
}, [flowNodes])
\`\`\`

### 2. Handle Empty States

The skeleton loader gracefully handles empty `layOutConfig` by showing a simple loading indicator:

\`\`\`typescript
if (!layOutConfig || layOutConfig.length === 0) {
  // Shows centered loading spinner
}
\`\`\`

### 3. Synchronize with Actual Flow

Ensure the skeleton's `firstNodeTopOffset` matches the offset used in the actual flow diagram for seamless transition.

### 4. Debug with Console Logs

The component includes debug logging to verify correct data interpretation:

\`\`\`typescript
console.log("[v0] FlowSkeletonLoader - Generated sections:", sectionBackgrounds.length)
console.log("[v0] FlowSkeletonLoader - Generated nodes:", skeletonNodes.length)
\`\`\`

### 5. Maintain Type Safety

Use proper TypeScript interfaces when passing data to ensure type safety:

\`\`\`typescript
interface FlowProps {
  flowNodes: Node[]
  // ... other props
}
\`\`\`

## Common Issues and Solutions

### Issue: Skeleton doesn't match final layout

**Solution**: Verify that `layOutConfig` contains all background nodes with correct `sectionPositions` data.

### Issue: Nodes appear misaligned

**Solution**: Adjust the `firstNodeTopOffset` prop to match the actual flow diagram's node positioning.

### Issue: Sections have incorrect dimensions

**Solution**: Ensure background nodes have proper `style` properties with width and height values.

### Issue: No skeleton appears

**Solution**: Check that `flowNodes` is populated before rendering and that background nodes exist in the data.

## Example Implementation

Here's a complete example from `flow-us-wires.tsx`:

\`\`\`typescript
export const FlowUsWires = ({
  flowNodes,
  flowEdges,
  isLoading,
  isError,
  // ... other props
}: FlowProps) => {
  // Extract layout configuration from flow nodes
  const layOutConfig = useMemo(() => {
    if (!flowNodes || flowNodes.length === 0) return []
    
    const backgroundNodes = flowNodes.filter((node) => node.type === "background")
    
    return backgroundNodes.map((node) => ({
      id: node.id,
      position: node.position,
      data: node.data,
      style: node.style || { width: "350px", height: "960px" },
      sectionPositions: (node.data as any).sectionPositions || { sections: {} },
    }))
  }, [flowNodes])

  // Show skeleton during loading
  if (isLoading) {
    return <FlowSkeletonLoader layOutConfig={layOutConfig} />
  }

  // Show error state
  if (isError) {
    return <ErrorDisplay />
  }

  // Render actual flow diagram
  return (
    <ReactFlow nodes={nodes} edges={edges} {...otherProps} />
  )
}
\`\`\`

## Performance Considerations

1. **Memoization**: The `layOutConfig` extraction is memoized to prevent recalculation on every render
2. **Conditional Rendering**: The skeleton only renders when `isLoading` is true
3. **Efficient Updates**: The component uses React's reconciliation to minimize DOM updates
4. **CSS Animations**: Uses CSS-based animations (animate-pulse) for smooth performance

## Maintenance Notes

- The skeleton automatically adapts to changes in `get-wires-flow.json` structure
- Node dimensions are hardcoded per section type but can be made configurable if needed
- Connection lines are calculated based on section positions for accurate visualization
- The component is fully typed with TypeScript for better maintainability

## Related Components

- `CardLoadingSkeleton`: Used for individual node placeholders
- `CustomNodeUsWires`: The actual node component that the skeleton mimics
- `FlowDiagramUsWires`: The parent container for the flow diagram
- `get-wires-flow.tsx`: Hook that provides the flow data structure

## Conclusion

The `FlowSkeletonLoader` provides a seamless loading experience by accurately representing the final flow diagram structure. By following this guide and best practices, you can ensure proper integration and maintain synchronization between the loading state and the actual diagram.
