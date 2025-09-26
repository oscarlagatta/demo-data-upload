# Flow Data Backend Hook Documentation

## Overview

This documentation provides a comprehensive explanation of the `useFlowDataBackEnd` hook and the `transformEnhancedApiData` function, which work together to process and transform payment flow data for visualization in React Flow diagrams.

## Table of Contents

1. [useFlowDataBackEnd Hook](#useflowdatabackend-hook)
2. [transformEnhancedApiData Function](#transformenhancedapidata-function)
3. [Data Flow Architecture](#data-flow-architecture)
4. [API Data Structure](#api-data-structure)
5. [Component Integration](#component-integration)

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
    const position = sectionConfig.positions[positionIndex] || {
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
        currentThruputTime30: apiNode.currentThruputTime30,
        averageThruputTime30: apiNode.averageThruputTime30,
        splunkDatas: apiNode.splunkDatas,
        step: apiNode.step,
      },
      parentId: parentId,
      extent: "parent" as const,
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

#### Node Structure
\`\`\`typescript
interface ApiNode {
  id: string                    // Unique identifier (e.g., "11554")
  label: string                 // Display name (e.g., "SAG")
  category?: string             // Section category (e.g., "Origination")
  systemHealth?: string         // Health status ("Healthy", "Unknown", etc.)
  isTrafficFlowing?: boolean    // Traffic flow indicator
  currentThruputTime30?: number // Current throughput time
  averageThruputTime30?: number // Average throughput time
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

## Component Integration

### Usage in Flow Diagram Components

The hook is used in flow diagram components like this:

\`\`\`typescript
// In flow-diagram-us-wires.tsx
const {
  nodes,
  edges,
  isLoading,
  isError,
  backgroundNodes,
  sectionTimings,
  totalProcessingTime,
  splunkData
} = useFlowDataBackEnd()

// Nodes and edges are passed to React Flow
<ReactFlow
  nodes={nodes}
  edges={edges}
  // ... other props
/>
\`\`\`

### Key Benefits

1. **Separation of Concerns**: Data fetching, transformation, and visualization are cleanly separated
2. **Type Safety**: Strong TypeScript typing throughout the pipeline
3. **Error Handling**: Graceful handling of missing or malformed data
4. **Performance**: Efficient data transformation with minimal re-computation
5. **Maintainability**: Clear data flow and well-documented transformations

### Error Handling

The system includes robust error handling:
- **Missing Categories**: Logs warnings and filters out unmappable nodes
- **Invalid Positions**: Falls back to calculated positions
- **API Failures**: Returns empty data structures to prevent crashes
- **Type Safety**: TypeScript ensures data structure integrity

This architecture ensures reliable operation even with incomplete or malformed API data while providing comprehensive debugging information through console warnings.
