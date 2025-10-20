# FlowSkeletonLoader Props and Layout Configuration Guide

## Overview

The `FlowSkeletonLoader` component displays an accurate loading placeholder for the flow diagram. It requires layout configuration data to render the correct structure, positions, and dimensions.

## Props Architecture

### FlowUsWires Component Props

\`\`\`typescript
interface FlowUsWiresProps extends FlowProps {
  layOutConfig?: any[]  // Optional: Layout config from backend
}
\`\`\`

**Prop: `layOutConfig`**
- **Source**: Passed from parent component (`FlowDiagramUsWires`)
- **Origin**: Backend API response via `useFlowDataBackEnd` hook
- **Type**: Array of layout section objects
- **Optional**: Yes (falls back to static config if not provided)
- **Purpose**: Provides dynamic layout configuration from the backend

### FlowSkeletonLoader Component Props

\`\`\`typescript
interface FlowSkeletonLoaderProps {
  layOutConfig?: LayoutSection[]     // Layout configuration array
  canvasWidth?: number               // Canvas width (default: 1650px)
  canvasHeight?: number              // Canvas height (default: 960px)
  firstNodeTopOffset?: number        // Top offset for first node (default: 50px)
}
\`\`\`

## Data Flow Architecture

### 1. Backend Data Flow (Dynamic)

\`\`\`
Backend API
  ↓
useGetSplunkWiresFlow hook
  ↓
useFlowDataBackEnd hook (extracts layOutConfig)
  ↓
FlowDiagramUsWires (parent component)
  ↓
FlowUsWires (passes layOutConfig prop)
  ↓
FlowSkeletonLoader (renders with backend config)
\`\`\`

### 2. Static Fallback Flow

\`\`\`
flow-layout-config.json (static file)
  ↓
Import in FlowUsWires
  ↓
Used when backend layOutConfig is empty/undefined
  ↓
FlowSkeletonLoader (renders with static config)
\`\`\`

## Why Two Sources?

### Backend Config (Dynamic)
- **When**: After data is fetched from API
- **Advantage**: Always up-to-date with backend structure
- **Use Case**: Production environment with live data

### Static Config (Fallback)
- **When**: During initial load before backend responds
- **Advantage**: Immediate skeleton rendering without waiting
- **Use Case**: Ensures skeleton shows even if backend is slow/unavailable

## Implementation Logic

### In FlowUsWires Component

\`\`\`typescript
if (isLoading) {
  // Use backend config if available, otherwise use static config
  const layoutConfigForSkeleton =
    layOutConfigFromBackend && layOutConfigFromBackend.length > 0
      ? layOutConfigFromBackend
      : staticLayoutConfig.layOutConfig

  return <FlowSkeletonLoader layOutConfig={layoutConfigForSkeleton} />
}
\`\`\`

**Logic Explanation:**
1. Check if `isLoading` is true
2. If backend config exists and has data → use it
3. If backend config is empty/undefined → use static config
4. Pass the selected config to FlowSkeletonLoader

### In FlowSkeletonLoader Component

\`\`\`typescript
export function FlowSkeletonLoader({
  layOutConfig = [],
  canvasWidth = DEFAULT_CANVAS_WIDTH,
  canvasHeight = DEFAULT_CANVAS_HEIGHT,
  firstNodeTopOffset = DEFAULT_TOP_OFFSET,
}: FlowSkeletonLoaderProps) {
  // Handle empty config gracefully
  if (!layOutConfig || layOutConfig.length === 0) {
    return <SimpleLoadingState />
  }

  // Render detailed skeleton with provided config
  return <DetailedSkeletonLayout />
}
\`\`\`

**Logic Explanation:**
1. Accept `layOutConfig` prop (defaults to empty array)
2. If empty → show simple loading spinner
3. If has data → render detailed skeleton matching layout

## Layout Configuration Structure

### LayoutSection Interface

\`\`\`typescript
interface LayoutSection {
  id: string                          // Section identifier (e.g., "bg-origination")
  position: { x: number; y: number }  // Section position on canvas
  data: Record<string, any>           // Section metadata (title, label, etc.)
  style: CSSProperties                // Section styling (width, height, etc.)
  sectionPositions: {                 // Node positions within section
    sections: {
      [key: string]: {
        baseX: number
        positions: Array<{ x: number; y: number }>
      }
    }
  }
}
\`\`\`

### Example Layout Config

\`\`\`json
[
  {
    "id": "bg-origination",
    "position": { "x": 0, "y": 0 },
    "data": { "title": "Origination" },
    "style": { "width": "350px", "height": "960px" },
    "sectionPositions": {
      "sections": {
        "origination": {
          "baseX": 50,
          "positions": [
            { "x": 50, "y": 100 },
            { "x": 50, "y": 250 },
            { "x": 50, "y": 400 }
          ]
        }
      }
    }
  }
]
\`\`\`

## Best Practices

### 1. Always Provide Fallback
\`\`\`typescript
// ✅ Good: Provides fallback
const config = backendConfig || staticConfig

// ❌ Bad: No fallback, skeleton may not render
const config = backendConfig
\`\`\`

### 2. Validate Config Before Use
\`\`\`typescript
// ✅ Good: Validates config has data
if (config && config.length > 0) {
  return <FlowSkeletonLoader layOutConfig={config} />
}

// ❌ Bad: Passes potentially empty config
return <FlowSkeletonLoader layOutConfig={config} />
\`\`\`

### 3. Keep Static Config Synchronized
- Update `flow-layout-config.json` when backend structure changes
- Ensure static config matches production layout
- Test skeleton with both static and backend configs

### 4. Use Descriptive Prop Names
\`\`\`typescript
// ✅ Good: Clear naming
layOutConfig: layOutConfigFromBackend

// ❌ Bad: Ambiguous naming
layOutConfig: layOutConfigProp
\`\`\`

## Common Issues and Solutions

### Issue 1: Skeleton Not Showing
**Symptom**: Blank screen during loading

**Cause**: Both backend and static configs are empty

**Solution**:
\`\`\`typescript
// Ensure static config is properly imported
import staticLayoutConfig from "@/domains/payment-health/config/flow-layout-config.json"

// Verify static config has data
console.log("Static config sections:", staticLayoutConfig.layOutConfig.length)
\`\`\`

### Issue 2: Skeleton Doesn't Match Final Diagram
**Symptom**: Layout shifts when data loads

**Cause**: Static config is outdated

**Solution**:
1. Extract current layout from backend response
2. Update `flow-layout-config.json` with latest structure
3. Test skeleton rendering

### Issue 3: Props Type Errors
**Symptom**: TypeScript errors about missing properties

**Cause**: Mismatch between prop interface and actual data

**Solution**:
\`\`\`typescript
// Define proper interface
interface FlowUsWiresProps extends FlowProps {
  layOutConfig?: LayoutSection[]  // Use proper type
}

// Use type assertion if needed
const config = backendConfig as LayoutSection[]
\`\`\`

## Testing Checklist

- [ ] Skeleton renders with backend config
- [ ] Skeleton renders with static config fallback
- [ ] Skeleton handles empty config gracefully
- [ ] Layout matches final diagram structure
- [ ] No console errors during loading
- [ ] Smooth transition from skeleton to diagram
- [ ] Responsive behavior on different screen sizes

## Maintenance

### When to Update Static Config
1. Backend layout structure changes
2. New sections added to flow diagram
3. Node positions or dimensions change
4. Section styling updates

### How to Update Static Config
1. Fetch latest backend response
2. Extract `layOutConfig` from response
3. Copy to `flow-layout-config.json`
4. Test skeleton rendering
5. Commit changes

## Summary

The `layOutConfig` prop system provides flexibility and reliability:
- **Dynamic**: Uses backend data when available for accuracy
- **Static**: Falls back to local config for immediate rendering
- **Graceful**: Handles empty/missing data without errors
- **Maintainable**: Clear separation between sources and usage

This architecture ensures users always see an accurate loading state, whether the backend responds quickly or slowly.
