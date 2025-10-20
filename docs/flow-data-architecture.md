# Flow Data Architecture Guide

## Overview

This document explains the complete data flow architecture for the US Wires flow diagram, from data loading to visualization, with a focus on the `layOutConfig` data structure used by the skeleton loader.

## Data Flow Diagram

\`\`\`
get-wires-flow.json (Static Data)
         ↓
useGetSplunkWiresFlow (Hook)
         ↓
useFlowDataBackEnd (Hook)
         ↓
FlowDiagramUsWires (Parent Component)
         ↓
FlowUsWires (Child Component)
         ↓
FlowSkeletonLoader (Loading State)
\`\`\`

## Layer 1: Data Source

### get-wires-flow.json

Located at: `src/domains/payment-health/hooks/use-get-splunk-us-wires/get-wires-flow.json`

This JSON file contains the complete flow diagram configuration:

\`\`\`json
{
  "nodes": [...],              // Node data with timing information
  "edges": [...],              // Connection data between nodes
  "layOutConfig": [...],       // Layout configuration for sections
  "processingSections": [...], // Section timing data
  "averageThruputTime30": 0    // Total processing time
}
\`\`\`

**Key Property: `layOutConfig`**

The `layOutConfig` is an array of section configurations that define:
- Section ID and position
- Section dimensions (width, height)
- Node positions within each section (`sectionPositions`)
- Visual styling (background color, borders, etc.)

Example structure:
\`\`\`json
{
  "id": "origination",
  "position": { "x": 0, "y": 0 },
  "data": { "title": "Origination" },
  "style": {
    "width": "350px",
    "height": "960px",
    "backgroundColor": "#f0f9ff"
  },
  "sectionPositions": {
    "sections": {
      "origination": [
        { "id": "node1", "x": 50, "y": 100 },
        { "id": "node2", "x": 50, "y": 250 }
      ]
    }
  }
}
\`\`\`

## Layer 2: Data Loading Hook

### useGetSplunkWiresFlow

Located at: `src/domains/payment-health/hooks/use-get-splunk-us-wires/get-wires-flow.tsx`

**Purpose:** Loads the flow data from the JSON file using React Query

**Returns:**
\`\`\`typescript
{
  data: FlowData,      // Complete flow data including layOutConfig
  isLoading: boolean,
  isError: boolean,
  error: Error | null,
  refetch: () => void
}
\`\`\`

**Key Features:**
- Uses `@tanstack/react-query` for caching and state management
- Simulates API delay for realistic behavior
- Provides refetch capability for manual data refresh
- 5-minute stale time, 10-minute garbage collection time

## Layer 3: Data Transformation Hook

### useFlowDataBackEnd

Located at: `src/domains/payment-health/assets/flow-data-us-wires/flow-data-use-wires-back-end.ts`

**Purpose:** Transforms raw flow data into React Flow compatible format and extracts layout configuration

**Data Transformations:**

1. **Section Timings Extraction**
   \`\`\`typescript
   const sectionTimings: Record<string, SectionTiming> = Object.fromEntries(
     flowData?.processingSections?.map((section) => [
       section.id,
       {
         duration: section.averageThroughputTime || 0,
         trend: "stable" as const,
       },
     ]) || [],
   )
   \`\`\`

2. **Background Nodes Creation**
   \`\`\`typescript
   const backgroundNodes: AppNode[] =
     flowData?.layOutConfig?.map((config) => ({
       id: config.id,
       type: "background" as const,
       position: config.position,
       data: {
         title: config.data.title,
         duration: sectionTimings[config.id]?.duration || 0,
         trend: sectionTimings[config.id]?.trend || "stable",
       },
       style: config.style,
     })) || []
   \`\`\`

3. **Section Positions Extraction**
   \`\`\`typescript
   const sectionPositions: Record<string, SectionPositions> = Object.fromEntries(
     flowData?.layOutConfig?.map((config) => [
       config.id,
       config.sectionPositions.sections[config.id]
     ]) || [],
   )
   \`\`\`

**Returns:**
\`\`\`typescript
{
  nodes: Node[],                    // Transformed nodes for React Flow
  edges: Edge[],                    // Transformed edges for React Flow
  isLoading: boolean,
  isError: boolean,
  backgroundNodes: AppNode[],       // Section background nodes
  sectionPositions: Record<...>,    // Node positions by section
  sectionTimings: Record<...>,      // Performance timing data
  totalProcessingTime: number,
  splunkData: any[],               // Raw node data
  layOutConfig: any[],             // Layout configuration (NEWLY EXPORTED)
  refetch: () => void
}
\`\`\`

**Recent Fix:** The hook now exports `layOutConfig` directly from `flowData` so it can be passed down to child components.

## Layer 4: Parent Component

### FlowDiagramUsWires

Located at: `src/domains/payment-health/components/flow/diagrams/flow-diagrams/flow-diagram-us-wires/flow-diagram-us-wires.tsx`

**Purpose:** Orchestrates the flow diagram rendering with proper data and state management

**Key Responsibilities:**

1. **Data Fetching**
   \`\`\`typescript
   const { 
     nodes, 
     edges, 
     sectionTimings, 
     totalProcessingTime, 
     splunkData, 
     isLoading, 
     error, 
     refetch,
     layOutConfig  // NEWLY ADDED
   } = useFlowDataBackEnd()
   \`\`\`

2. **Node Types Configuration**
   - Creates custom node types with proper props
   - Passes timing data and loading states to nodes
   - Configures background section nodes

3. **Props Passing to Child**
   \`\`\`typescript
   <FlowUsWires
     nodeTypes={nodeTypes}
     onShowSearchBox={() => setShowSearchBox(true)}
     flowNodes={nodes}
     flowEdges={edges}
     splunkData={splunkData}
     sectionTimings={sectionTimings}
     totalProcessingTime={totalProcessingTime}
     isLoading={isLoading}
     isError={!!error}
     onRefetch={handleRefetch}
     layOutConfig={layOutConfig}  // NEWLY ADDED
   />
   \`\`\`

**Recent Fix:** The component now extracts and passes `layOutConfig` to the `FlowUsWires` child component.

## Layer 5: Child Component

### FlowUsWires

Located at: `src/domains/payment-health/components/flow/diagrams/flow-diagrams/flow-diagram-us-wires/flow-us-wires.tsx`

**Purpose:** Renders the interactive flow diagram with React Flow

**Props Interface:**
\`\`\`typescript
interface FlowProps {
  nodeTypes: NodeTypes
  onShowSearchBox: () => void
  flowNodes: Node[]
  flowEdges: Edge[]
  splunkData: any[]
  sectionTimings: Record<string, SectionTiming> | null
  totalProcessingTime: number
  isLoading: boolean
  isError: boolean
  onRefetch: () => void
  layOutConfig?: any[]  // NEWLY ADDED - Optional for backward compatibility
}
\`\`\`

**Loading State Handling:**
\`\`\`typescript
if (isLoading) {
  return <FlowSkeletonLoader layOutConfig={layOutConfig || []} />
}
\`\`\`

**Key Feature:** When loading, the component passes `layOutConfig` to the skeleton loader, which uses it to render an accurate placeholder that matches the final diagram structure.

## Layer 6: Skeleton Loader

### FlowSkeletonLoader

Located at: `src/domains/payment-health/components/flow/loading/flow-skeleton-loader.tsx`

**Purpose:** Renders a skeleton placeholder that accurately represents the flow diagram layout during loading

**Props Interface:**
\`\`\`typescript
interface FlowSkeletonLoaderProps {
  layOutConfig: LayoutSection[]
  firstNodeTopOffset?: number  // Optional offset for first node positioning
}
\`\`\`

**Layout Interpretation:**

1. **Canvas Dimensions Calculation**
   \`\`\`typescript
   const canvasWidth = useMemo(() => {
     return layOutConfig.reduce((maxX, section) => {
       const sectionRight = parseFloat(section.position.x) + parseDimension(section.style.width)
       return Math.max(maxX, sectionRight)
     }, 0)
   }, [layOutConfig])
   \`\`\`

2. **Section Rendering**
   - Renders background rectangles for each section
   - Applies exact dimensions and positions from `layOutConfig`
   - Shows animated title placeholders

3. **Node Skeleton Generation**
   \`\`\`typescript
   const skeletonNodes = useMemo(() => {
     return layOutConfig.flatMap((section) => {
       const sectionData = section.sectionPositions?.sections?.[section.id]
       return sectionData?.map((nodePos: any) => ({
         id: nodePos.id,
         x: parseFloat(section.position.x) + nodePos.x,
         y: nodePos.y + (firstNodeTopOffset || 0)
       })) || []
     })
   }, [layOutConfig, firstNodeTopOffset])
   \`\`\`

4. **Connection Lines**
   - Draws lines between sections to preview connections
   - Uses section positions to calculate line coordinates

**Visual Output:**
- Section backgrounds with proper dimensions
- Node placeholders using `CardLoadingSkeleton` component
- Connection lines between sections
- Animated loading states

## Best Practices

### 1. Data Flow Management

**DO:**
- Always extract `layOutConfig` from the hook return value
- Pass `layOutConfig` explicitly as a prop through the component tree
- Use TypeScript interfaces to ensure type safety
- Handle undefined/null cases with fallbacks (`layOutConfig || []`)

**DON'T:**
- Try to construct `layOutConfig` from `flowNodes` (it's not there)
- Assume `layOutConfig` is available on individual nodes
- Skip intermediate layers in the data flow

### 2. State Management

**DO:**
- Use React Query for data fetching and caching
- Leverage `useMemo` for expensive calculations
- Implement proper loading and error states
- Provide refetch capabilities for data refresh

**DON'T:**
- Fetch data in multiple places
- Recalculate derived data on every render
- Ignore loading and error states

### 3. Component Communication

**DO:**
- Use explicit props for data passing
- Document prop interfaces with TypeScript
- Provide default values for optional props
- Use callbacks for parent-child communication

**DON'T:**
- Rely on global state for component-specific data
- Use prop drilling for deeply nested components
- Mutate props directly

### 4. Skeleton Loader Integration

**DO:**
- Pass complete `layOutConfig` to skeleton loader
- Use the same layout calculations as the real diagram
- Provide visual feedback during loading
- Match skeleton structure to final diagram

**DON'T:**
- Hardcode skeleton dimensions
- Use generic loading spinners for complex layouts
- Ignore responsive design in skeleton

## Debugging Guide

### Issue: layOutConfig is empty

**Symptoms:**
- Skeleton loader shows nothing or errors
- Console logs show empty array for `layOutConfig`

**Diagnosis Steps:**

1. **Check data source:**
   \`\`\`typescript
   console.log("[v0] Raw flowData:", flowData)
   console.log("[v0] layOutConfig from JSON:", flowData?.layOutConfig)
   \`\`\`

2. **Check hook return:**
   \`\`\`typescript
   const hookData = useFlowDataBackEnd()
   console.log("[v0] Hook returns layOutConfig:", hookData.layOutConfig)
   \`\`\`

3. **Check parent component:**
   \`\`\`typescript
   console.log("[v0] Parent received layOutConfig:", layOutConfig)
   \`\`\`

4. **Check child component:**
   \`\`\`typescript
   console.log("[v0] Child received layOutConfig:", layOutConfigProp)
   \`\`\`

**Common Causes:**
- Hook not returning `layOutConfig`
- Parent not extracting `layOutConfig` from hook
- Parent not passing `layOutConfig` to child
- Child not accepting `layOutConfig` prop

**Solution:**
Ensure each layer properly extracts and passes the data as shown in this guide.

### Issue: Skeleton doesn't match final diagram

**Symptoms:**
- Skeleton layout looks different from loaded diagram
- Nodes appear in wrong positions
- Sections have incorrect sizes

**Diagnosis:**
- Compare skeleton calculations with actual flow diagram calculations
- Check if `firstNodeTopOffset` is being applied correctly
- Verify dimension parsing (string "350px" vs number 350)

**Solution:**
- Use the same layout utilities in both skeleton and diagram
- Ensure consistent coordinate systems
- Apply the same offsets and transformations

## Summary

The flow data architecture follows a clear, unidirectional data flow:

1. **JSON file** contains the source data with `layOutConfig`
2. **useGetSplunkWiresFlow** loads the data with React Query
3. **useFlowDataBackEnd** transforms and exports the data including `layOutConfig`
4. **FlowDiagramUsWires** orchestrates and passes data to child
5. **FlowUsWires** renders the diagram or skeleton based on loading state
6. **FlowSkeletonLoader** interprets `layOutConfig` to render accurate placeholder

By following this architecture and best practices, you ensure:
- Consistent data flow
- Proper separation of concerns
- Accurate skeleton representation
- Maintainable and debuggable code
