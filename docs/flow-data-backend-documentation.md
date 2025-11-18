# Flow Data Backend Hook Documentation

## Overview

This documentation provides a comprehensive explanation of the `useFlowDataBackEnd` hook and the `transformEnhancedApiData` function, which work together to process and transform payment flow data for visualization in React Flow diagrams.

**Last Updated**: Revised to reflect new node properties including styling classes, positioning, and enhanced metrics.

## Table of Contents

1. [useFlowDataBackEnd Hook](#useflowdatabackend-hook)
2. [transformEnhancedApiData Function](#transformenhancedapidata-function)
3. [Data Flow Architecture](#data-flow-architecture)
4. [API Data Structure](#api-data-structure)
5. [New Node Properties](#new-node-properties)
6. [Component Integration](#component-integration)

---

## useFlowDataBackEnd Hook

### Purpose
The `useFlowDataBackEnd` hook serves as the primary data orchestrator for the US Wires payment flow visualization. It fetches raw API data, processes timing information, creates background nodes, and transforms the data into a format suitable for React Flow components.

### Location
`src/domains/payment-health/assets/flow-data-us-wires/flow-data-use-wires-back-end.ts`

### Line-by-Line Breakdown

#### Lines 1-5: Imports and Dependencies
\`\`\`typescript
import type { AppNode } from "../../types/app-node"
import type { SectionTiming, SectionPositions } from "../../types/api-flow-data"
import { classToParentId } from "@/domains/payment-health/utils/shared-mappings"
import { transformEnhancedApiData } from "@/domains/payment-health/utils/transform-utils"
import { useGetSplunkWiresFlow } from "@/domains/payment-health/hooks/use-get-splunk-us-wires/get-wires-flow"
\`\`\`

**Purpose**: Imports necessary types and utility functions:
- `AppNode`: TypeScript interface for React Flow nodes
- `SectionTiming`, `SectionPositions`: Types for timing and positioning data
- `classToParentId`: Mapping object for node categorization
- `transformEnhancedApiData`: Core transformation function
- `useGetSplunkWiresFlow`: API data fetching hook

#### Lines 10-16: API Data Fetching
\`\`\`typescript
export function useFlowDataBackEnd() {
  const {
    data: flowData,
    isLoading,
    isError,
  } = useGetSplunkWiresFlow({
    enabled: true,
    isMonitored: false,
  })
\`\`\`

**Purpose**: Fetches the raw flow data from the Splunk API with monitoring disabled.

#### Lines 18-25: Section Timings Processing
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

**Purpose**: Transforms the API's `processingSections` array into a lookup object where:
- **Key**: Section ID (e.g., "bg-origination", "bg-validation")
- **Value**: Object containing duration and trend information
- **Fallback**: Empty array if no processing sections exist

#### Lines 27-28: Total Processing Time Calculation
\`\`\`typescript
const totalProcessingTime =
  flowData?.averageThruputTime30 || Object.values(sectionTimings).reduce((sum, section) => sum + section.duration, 0)
\`\`\`

**Purpose**: Calculates total processing time using either:
1. **Primary**: API-provided `averageThruputTime30` value
2. **Fallback**: Sum of all individual section durations

#### Lines 30-44: Background Nodes Creation
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
    draggable: config.draggable,
    selectable: config.selectable,
    zIndex: config.zIndex,
    style: config.style,
  })) || []
\`\`\`

**Purpose**: Creates React Flow background nodes from layout configuration:
- **Maps**: Each layout config to a React Flow background node
- **Enriches**: Adds timing data from previously calculated `sectionTimings`
- **Preserves**: Original styling and interaction properties

#### Lines 46-49: Section Positions Extraction
\`\`\`typescript
const sectionPositions: Record<string, SectionPositions> = Object.fromEntries(
  flowData?.layOutConfig?.map((config) => [config.id, config.sectionPositions.sections[config.id]]) || [],
)
\`\`\`

**Purpose**: Extracts positioning information for each section:
- **Creates**: Lookup object for node positioning within sections
- **Structure**: `{ "bg-origination": { baseX: 50, positions: [...] } }`

#### Lines 51-54: Data Transformation
\`\`\`typescript
const transformedData = flowData
  ? transformEnhancedApiData(flowData, backgroundNodes, classToParentId, sectionPositions)
  : { nodes: [], edges: [] }
\`\`\`

**Purpose**: Applies the main transformation logic:
- **Conditional**: Only transforms if API data exists
- **Parameters**: Passes all necessary data for transformation
- **Fallback**: Returns empty nodes/edges if no data

#### Lines 56-67: Return Object
\`\`\`typescript
return {
  nodes: transformedData.nodes,
  edges: transformedData.edges,
  isLoading,
  isError,
  backgroundNodes,
  sectionPositions,
  sectionTimings,
  totalProcessingTime,
  splunkData: flowData?.nodes || [],
}
\`\`\`

**Purpose**: Returns comprehensive data object containing:
- **Core Data**: Transformed nodes and edges for React Flow
- **State**: Loading and error states
- **Metadata**: Background nodes, positions, timings
- **Raw Data**: Original Splunk data for debugging/analysis

---

## transformEnhancedApiData Function

### Purpose
The `transformEnhancedApiData` function is the core transformation engine that converts raw API data into React Flow-compatible nodes and edges. It handles node positioning, categorization, and connection mapping.

### Location
`src/domains/payment-health/utils/transform-utils.ts`

### Parameters

#### 1. `apiData: ApiData`
\`\`\`typescript
interface ApiData {
  nodes: ApiNode[]
  systemConnections: SystemConnection[]
}
\`\`\`
Raw API response containing node definitions and system connections.

#### 2. `backgroundNodes: AppNode[]`
Pre-created background section nodes that provide visual grouping.

#### 3. `classToParentId: Record<string, string>`
Mapping object that associates node categories with parent section IDs.

#### 4. `sectionPositions: Record<string, SectionPositions>`
Positioning configuration for placing nodes within their respective sections.

### Function Breakdown

#### Lines 1-5: Section Counter Initialization
\`\`\`typescript
const sectionCounters: Record<string, number> = Object.keys(sectionPositions).reduce(
  (acc, key: string) => ({ ...acc, [key]: 0 }),
  {},
)
\`\`\`

**Purpose**: Creates position counters for each section to prevent node overlap:
- **Structure**: `{ "bg-origination": 0, "bg-validation": 0, ... }`
- **Usage**: Incremented as nodes are positioned within sections

#### Lines 7-42: Node Transformation Logic
\`\`\`typescript
const transformedNodes: AppNode[] = apiData.nodes
  .map((apiNode: ApiNode): AppNode | null => {
    let parentId: string | null = null

    if (apiNode.category) {
      const categoryKey = apiNode.category.toLowerCase()
      parentId = classToParentId[categoryKey] || getCategoryParentId(apiNode.category)
    }

    if (!parentId) {
      console.warn(`No parent ID found for node ${apiNode.id} with category: ${apiNode.category || "undefined"}`)
      return null
    }

    const sectionConfig = sectionPositions[parentId]
    if (!sectionConfig) return null

    const positionIndex = sectionCounters[parentId]++
    const position = apiNode.xPosition !== undefined && apiNode.yPosition !== undefined
      ? { x: apiNode.xPosition, y: apiNode.yPosition }
      : sectionConfig.positions[positionIndex] || {
          x: sectionConfig.baseX,
          y: 100 + positionIndex * 120,
        }

    return {
      id: apiNode.id,
      type: "custom" as const,
      position,
      data: {
        title: apiNode.label,
        subtext: `AIT ${apiNode.id}`,
        systemHealth: apiNode.systemHealth,
        isTrafficFlowing: apiNode.isTrafficFlowing,
        currentThroughputTime: apiNode.currentThroughputTime ?? apiNode.currentThruputTime30,
        averageThroughputTime: apiNode.averageThroughputTime30 ?? apiNode.averageThruputTime30,
        splunkDatas: apiNode.splunkDatas,
        step: apiNode.step,
        descriptions: apiNode.descriptions,
        flowClass: apiNode.flowClass,
        trendClass: apiNode.trendClass,
        balancedClass: apiNode.balancedClass,
      },
      parentId: parentId,
      extent: "parent" as const,
      style: {
        height: apiNode.height,
        width: apiNode.width,
      },
    }
  })
  .filter((n): n is AppNode => n !== null)
\`\`\`

**Purpose**: Transforms API nodes into React Flow nodes:

1. **Category Resolution** (Lines 10-13):
   - Attempts to find parent section using lowercase category
   - Falls back to `getCategoryParentId` function if direct mapping fails

2. **Validation** (Lines 15-18):
   - Logs warning and returns null for nodes without valid parent sections
   - Ensures data integrity by filtering out unmappable nodes

3. **Position Calculation** (Lines 20-26):
   - Uses section counter to determine position index
   - Falls back to calculated position if predefined positions are exhausted
   - Increments counter to prevent overlap

4. **Node Creation** (Lines 28-41):
   - Creates React Flow node with all necessary properties
   - Preserves all API data in the `data` object
   - Sets parent relationship for proper grouping

#### Lines 44-66: Edge Transformation Logic
\`\`\`typescript
const transformedEdges = apiData.systemConnections.flatMap((connection: SystemConnection) => {
  const { source, target } = connection
  if (Array.isArray(target)) {
    return target.map((t) => ({
      id: `${source}-${t}`,
      source,
      target: t,
      type: "smoothstep",
      style: edgeStyle,
      markerStart: marker,
      markerEnd: marker,
    }))
  } else {
    return [
      {
        id: `${source}-${target}`,
        source,
        target: target as string,
        type: "smoothstep",
        style: edgeStyle,
        markerStart: marker,
        markerEnd: marker,
      },
    ]
  }
})
\`\`\`

**Purpose**: Converts system connections into React Flow edges:

1. **Array Target Handling** (Lines 46-55):
   - Handles one-to-many connections where a single source connects to multiple targets
   - Creates separate edge for each target

2. **Single Target Handling** (Lines 56-65):
   - Creates single edge for one-to-one connections
   - Ensures consistent edge styling and markers

#### Lines 68-71: Return Statement
\`\`\`typescript
return {
  nodes: [...backgroundNodes, ...transformedNodes],
  edges: transformedEdges,
}
\`\`\`

**Purpose**: Combines background and transformed nodes with edges for final output.

---

## Data Flow Architecture

### 1. API Data Ingestion
\`\`\`
Splunk API → useGetSplunkWiresFlow → Raw Flow Data
\`\`\`

### 2. Data Processing Pipeline
\`\`\`
Raw API Data → useFlowDataBackEnd → {
  ├── Section Timings Calculation
  ├── Background Nodes Creation  
  ├── Position Configuration
  └── transformEnhancedApiData → React Flow Data
}
\`\`\`

### 3. Component Integration
\`\`\`
React Flow Data → Flow Diagram Components → Visual Representation
\`\`\`

---

## API Data Structure

### Core Data Elements

#### Node Structure (Updated)
\`\`\`typescript
interface ApiNode {
  // Identifiers
  id: string                    // Unique identifier (e.g., "11554")
  label: string                 // Display name (e.g., "SAG")
  category?: string             // Section category (e.g., "Origination")
  
  // Performance Metrics
  systemHealth?: string         // Health status ("Healthy", "Unknown", etc.)
  isTrafficFlowing?: boolean    // Traffic flow indicator
  currentThroughputTime?: number // Current throughput time (standardized)
  currentThruputTime30?: number  // Legacy: Current throughput time
  averageThroughputTime30?: number // Average throughput time (standardized)
  averageThruputTime30?: number  // Legacy: Average throughput time
  
  // Styling Properties (NEW)
  flowClass?: string            // CSS class for flow state (e.g., "bg-gray-400")
  trendClass?: string           // CSS class for trend indication
  balancedClass?: string | null // CSS class for balanced state
  
  // Content (NEW)
  descriptions?: string         // Detailed node description
  
  // Positioning & Dimensions (NEW)
  height?: number              // Node height in pixels (e.g., 90)
  width?: number               // Node width in pixels (e.g., 180)
  xPosition?: number           // Absolute X position (e.g., 300)
  yPosition?: number           // Absolute Y position (e.g., 120)
  
  // Additional Data
  splunkDatas?: any[]          // Detailed Splunk metrics
  step?: number                // Processing step number
}
\`\`\`

#### Connection Structure
\`\`\`typescript
interface SystemConnection {
  source: string           // Source node ID
  target: string | string[] // Target node ID(s)
}
\`\`\`

#### Layout Configuration
\`\`\`typescript
interface LayoutConfig {
  id: string                    // Section ID
  type: "background"            // Node type
  position: { x: number, y: number } // Section position
  data: { title: string }       // Section title
  sectionPositions: {           // Node positioning within section
    sections: {
      [sectionId]: {
        baseX: number
        positions: Array<{ x: number, y: number }>
      }
    }
  }
}
\`\`\`

---

## New Node Properties

### Styling Classes

The updated backend structure includes three CSS class properties for dynamic styling:

#### 1. `flowClass`
- **Purpose**: Indicates the current traffic flow state
- **Values**: CSS class names (e.g., `"bg-gray-400"`, `"bg-green-500"`, `"bg-red-500"`)
- **Usage**: Applied to node background to show traffic status
- **Example**: `"bg-gray-400"` for no traffic, `"bg-green-500"` for healthy flow

#### 2. `trendClass`
- **Purpose**: Shows performance trend direction
- **Values**: CSS class names (e.g., `"bg-gray-400"`, `"bg-blue-500"`, `"bg-orange-500"`)
- **Usage**: Applied to trend indicators or borders
- **Example**: `"bg-blue-500"` for improving trend, `"bg-orange-500"` for degrading

#### 3. `balancedClass`
- **Purpose**: Indicates load balancing state
- **Values**: CSS class names or `null` if not applicable
- **Usage**: Applied when system shows balanced/unbalanced load distribution
- **Example**: `"bg-yellow-500"` for unbalanced, `null` for balanced or N/A

### Positioning Properties

#### Absolute Positioning
The backend now supports explicit positioning:

- **`xPosition`**: Absolute X coordinate within the flow canvas
- **`yPosition`**: Absolute Y coordinate within the flow canvas

**Priority**: If both `xPosition` and `yPosition` are provided, they override the calculated positions from `sectionPositions`.

**Fallback**: If not provided, the system uses section-based positioning with automatic spacing.

### Dimension Properties

Nodes can now specify custom dimensions:

- **`height`**: Node height in pixels (default: determined by content)
- **`width`**: Node width in pixels (default: determined by content)

**Usage**: Applied as inline styles to React Flow nodes for consistent sizing across the diagram.

### Descriptive Content

#### `descriptions`
- **Purpose**: Provides detailed information about the node's functionality
- **Format**: Plain text string
- **Usage**: Can be displayed in tooltips, expanded views, or node details panels
- **Example**: `"Handles origination requests\n- Receives inbound\n- Sends"`

### Data Migration & Compatibility

The transformation function maintains backward compatibility:

1. **Throughput Time Normalization**:
   \`\`\`typescript
   currentThroughputTime = apiNode.currentThroughputTime ?? apiNode.currentThruputTime30
   averageThroughputTime = apiNode.averageThroughputTime30 ?? apiNode.averageThruputTime30
   \`\`\`
   Both old and new property names are supported.

2. **Position Calculation**:
   \`\`\`typescript
   position = apiNode.xPosition !== undefined 
     ? { x: apiNode.xPosition, y: apiNode.yPosition }
     : calculatedPosition
   \`\`\`
   Seamlessly switches between absolute and calculated positioning.

3. **Optional Properties**:
   All new properties are optional, ensuring existing data structures remain valid.

---

## Component Integration

### Usage with New Properties

\`\`\`typescript
// In custom-node-us-wires.tsx
export function CustomNodeUsWires({ data }: NodeProps<NodeData>) {
  return (
    <div 
      className={cn(
        "node-container",
        data.flowClass,        // Apply dynamic flow state styling
        data.trendClass,       // Apply trend indication styling
        data.balancedClass     // Apply balance state styling
      )}
      style={{
        height: data.height,    // Apply custom dimensions
        width: data.width
      }}
    >
      <div className="node-header">
        <h3>{data.title}</h3>
        <span>{data.subtext}</span>
      </div>
      
      {data.descriptions && (
        <div className="node-description">
          {data.descriptions}   // Display detailed description
        </div>
      )}
      
      <div className="node-metrics">
        {data.currentThroughputTime !== undefined && (
          <span>Current: {data.currentThroughputTime}ms</span>
        )}
        {data.averageThroughputTime !== undefined && (
          <span>Average: {data.averageThroughputTime}ms</span>
        )}
      </div>
    </div>
  )
}
\`\`\`

### Validation & Error Handling

The transformation function includes comprehensive validation:

1. **Category Validation**: Warns if node category doesn't map to a parent section
2. **Position Fallback**: Automatically calculates positions if not provided
3. **Property Normalization**: Handles both old and new property names
4. **Type Safety**: TypeScript ensures all properties match expected types

### Performance Considerations

- **Edge Deduplication**: Prevents duplicate connections with bidirectional check
- **Position Caching**: Section counters minimize recalculation
- **Selective Styling**: Only applies custom dimensions when provided

---
