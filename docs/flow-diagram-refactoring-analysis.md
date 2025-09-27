# Flow Diagram Refactoring Analysis

## Executive Summary

The `flow-diagram-us-wires.tsx` file contains 700+ lines of code with multiple responsibilities that can be extracted into reusable utilities, components, and type definitions. This analysis identifies specific refactoring opportunities to improve code organization, reusability, and maintainability.

## Current File Structure Analysis

### File Size and Complexity
- **Total Lines**: ~700 lines
- **Main Components**: 2 (FlowDiagramUsWires, Flow)
- **Utility Functions**: 5+ inline functions
- **Constants**: 4 configuration objects
- **Types**: 2 inline type definitions

## Refactoring Recommendations

### 1. Extract Constants to Configuration File

**Target**: `src/domains/payment-health/config/flow-diagram-config.ts`

\`\`\`typescript
// Constants that should be extracted
const SECTION_IDS = ["bg-origination", "bg-validation", "bg-middleware", "bg-processing"]
const sectionDurations = {
  "bg-origination": 1.2,
  "bg-validation": 2.8,
  "bg-middleware": 1.9,
  "bg-processing": 3.4,
}
const SECTION_WIDTH_PROPORTIONS = [0.2, 0.2, 0.25, 0.35]
const GAP_WIDTH = 16
\`\`\`

**Benefits**:
- Centralized configuration management
- Easy to modify section parameters
- Reusable across different flow diagrams
- Better separation of concerns

### 2. Extract DraggablePanel Component

**Target**: `src/domains/payment-health/components/shared/draggable-panel.tsx`

**Current Location**: Lines 67-130 (63 lines)

**Rationale**:
- Self-contained React component with its own state management
- Reusable across different parts of the application
- Complex mouse event handling logic
- No dependencies on parent component state

**Benefits**:
- Component reusability
- Easier testing in isolation
- Cleaner main component file
- Better separation of UI concerns

### 3. Extract Flow Layout Utilities

**Target**: `src/domains/payment-health/utils/flow-layout-utils.ts`

**Functions to Extract**:

\`\`\`typescript
// Node positioning and sizing logic (Lines 350-420)
function calculateSectionDimensions(width: number, sectionIds: string[], proportions: number[], gapWidth: number)
function updateNodePositions(nodes: Node[], sectionDimensions: Record<string, any>, flowNodes: Node[])
function calculateCanvasHeight(nodes: Node[]): number
\`\`\`

**Benefits**:
- Pure functions that can be easily tested
- Reusable layout calculations
- Cleaner component logic
- Better separation of layout concerns

### 4. Extract Node Connection Logic

**Target**: `src/domains/payment-health/utils/node-connection-utils.ts`

**Functions to Extract**:

\`\`\`typescript
// Connection finding and highlighting logic (Lines 220-280)
function findNodeConnections(nodeId: string, edges: Edge[]): { connectedNodes: Set<string>; connectedEdges: Set<string> }
function getConnectedSystemNames(selectedNodeId: string, connectedNodeIds: Set<string>, nodes: Node[]): string[]
function createHighlightedNodes(nodes: Node[], selectedNodeId: string, connectedNodeIds: Set<string>): Node[]
function createHighlightedEdges(edges: Edge[], connectedEdgeIds: Set<string>, selectedNodeId: string): Edge[]
\`\`\`

**Benefits**:
- Pure functions for graph traversal
- Testable connection logic
- Reusable across different flow diagrams
- Better separation of graph logic

### 5. Extract Data Panel Rendering Logic

**Target**: `src/domains/payment-health/components/shared/flow-data-panel.tsx`

**Current Location**: Lines 450-550 (100 lines)

**Rationale**:
- Complex conditional rendering logic
- Self-contained UI component
- Multiple state-dependent views
- Reusable data display patterns

**Benefits**:
- Component reusability
- Easier testing of different states
- Cleaner main component
- Better error handling isolation

### 6. Extract Type Definitions

**Target**: `src/domains/payment-health/types/flow-diagram-types.ts`

**Types to Extract**:

\`\`\`typescript
type ActionType = "flow" | "trend" | "balanced"

interface TableModeState {
  show: boolean
  aitNum: string | null
  action: ActionType | null
}

interface FlowDiagramUsWiresProps {
  isMonitoringMode: boolean
}

interface FlowProps {
  nodeTypes: NodeTypes
  onShowSearchBox: () => void
  splunkData: any[] | null
  sectionTimings: Record<string, { duration: number; trend: string }> | null
  totalProcessingTime: number | null
  isLoading: boolean
  isError: boolean
  onRefetch: () => void
}
\`\`\`

**Benefits**:
- Centralized type definitions
- Better TypeScript support
- Reusable across components
- Improved type safety

### 7. Extract React Flow Configuration

**Target**: `src/domains/payment-health/utils/react-flow-config.ts`

**Functions to Extract**:

\`\`\`typescript
// Node types factory and configuration
function createNodeTypes(
  isShowHidden: boolean,
  onHideSearch: () => void,
  splunkData: any[],
  sectionTimings: Record<string, { duration: number; trend: string }> | null
): NodeTypes

// Query client configuration
function createFlowQueryClient(): QueryClient
\`\`\`

**Benefits**:
- Centralized React Flow configuration
- Reusable node type creation
- Better configuration management

## Unused Code Identification

### 1. Unused Variables and Imports

\`\`\`typescript
// Potentially unused - needs verification
const isAuthorized = true // hasRequiredRole(); - Line 180
\`\`\`

**Action**: Remove if not used in authorization logic

### 2. Commented Code

\`\`\`typescript
// Line 180: Hardcoded authorization
const isAuthorized = true // hasRequiredRole();
\`\`\`

**Action**: Either implement proper authorization or remove

### 3. Unused State Variables

**Needs Investigation**:
- `isAuthorized` - appears to be unused
- Some callback dependencies might be over-specified

## Implementation Priority

### Phase 1 (High Impact, Low Risk)
1. **Extract Constants** - Immediate benefit, zero risk
2. **Extract Type Definitions** - Better TypeScript support
3. **Remove Unused Code** - Cleaner codebase

### Phase 2 (Medium Impact, Medium Risk)
1. **Extract DraggablePanel Component** - Reusable component
2. **Extract Data Panel Component** - Better organization
3. **Extract Flow Layout Utils** - Testable utilities

### Phase 3 (High Impact, Higher Risk)
1. **Extract Node Connection Logic** - Complex but valuable
2. **Extract React Flow Configuration** - Architectural improvement

## Expected Outcomes

### Before Refactoring
- **File Size**: 700+ lines
- **Responsibilities**: 8+ different concerns
- **Testability**: Difficult due to coupling
- **Reusability**: Limited due to tight coupling

### After Refactoring
- **Main File Size**: ~300 lines (57% reduction)
- **Extracted Files**: 6-8 new utility/component files
- **Responsibilities**: Single responsibility per file
- **Testability**: High - pure functions and isolated components
- **Reusability**: High - extracted utilities and components

## Testing Strategy

### Unit Tests for Extracted Utilities
- `flow-layout-utils.ts` - Test layout calculations
- `node-connection-utils.ts` - Test graph traversal logic
- `flow-diagram-config.ts` - Test configuration values

### Component Tests
- `DraggablePanel` - Test drag interactions
- `FlowDataPanel` - Test different loading states

### Integration Tests
- Main flow diagram component with mocked utilities
- End-to-end flow interactions

## Migration Strategy

1. **Create new utility files** with extracted functions
2. **Update imports** in main component
3. **Test functionality** to ensure no regressions
4. **Remove old inline code** after verification
5. **Update documentation** and type definitions

## Conclusion

This refactoring will significantly improve code organization, testability, and maintainability while reducing the complexity of the main flow diagram component. The extracted utilities and components will be reusable across the payment health domain, promoting consistency and reducing code duplication.
