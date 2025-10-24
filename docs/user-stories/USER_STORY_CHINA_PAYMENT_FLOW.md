# User Story: China Payment Flow Visualization

## Story ID
`PH-2024-001`

## User Story
**As a** Payment Operations Manager monitoring China domestic payments  
**I want** to visualize the CNAPS (China National Advanced Payment System) payment flow in the dashboard  
**So that** I can monitor transaction health, identify bottlenecks, and ensure compliance with Chinese banking regulations

---

## Priority
**HIGH** - China represents significant transaction volume and requires specialized monitoring

---

## Frontend Focus Areas (Primary Work)

### 1. ReactFlow Diagram Component
**Priority: CRITICAL**

Create a new interactive flow diagram component for China CNAPS system:

\`\`\`
src/domains/payment-health/components/flow/diagrams/flow-diagrams/flow-diagram-china-cnaps/
├── flow-china-cnaps.tsx              (Main ReactFlow component)
├── flow-diagram-china-cnaps-v1.tsx   (Diagram configuration)
├── china-cnaps-node-data.json        (Node definitions)
└── index.ts
\`\`\`

**Key Frontend Requirements:**
- Interactive ReactFlow canvas with zoom/pan controls
- Custom node components for CNAPS-specific systems
- Edge animations showing payment flow direction
- Node selection and highlighting
- Responsive layout (min 1400px width recommended)
- Loading skeleton states
- Error boundaries for graceful failure handling

### 2. Custom Node Components
**Priority: CRITICAL**

Create specialized node components for China payment systems:

\`\`\`typescript
// Node types needed:
- CNAPSCoreNode (HVPS/BEPS systems)
- BankNode (Commercial banks)
- PBOCNode (People's Bank of China)
- ClearingNode (Clearing houses)
- ComplianceNode (AML/sanctions screening)
\`\`\`

**Visual Requirements:**
- Red/gold color scheme (culturally appropriate for China)
- Simplified Chinese characters support (UTF-8)
- Icons representing Chinese banking institutions
- Status indicators (operational, delayed, error)
- Metric displays (volume, value, processing time)

### 3. UI Components & Interactions
**Priority: HIGH**

**Navigation Integration:**
\`\`\`tsx
// Add to main navigation
<NavigationItem 
  label="China CNAPS" 
  icon={<Globe />}
  href="/payment-health/china-cnaps"
/>
\`\`\`

**Toggle/Filter Controls:**
- System type filter (HVPS vs BEPS)
- Time range selector (real-time, 1h, 24h, 7d)
- Transaction type filter (retail vs wholesale)
- Bank filter (by institution)

**Info Panels:**
- System legend explaining CNAPS components
- Metric cards showing key statistics
- Alert notifications for system issues

### 4. Styling & Theming
**Priority: MEDIUM**

**Color Palette (China-specific):**
\`\`\`css
--china-primary: #DC143C (Chinese red)
--china-accent: #FFD700 (Gold)
--china-success: #228B22 (Forest green)
--china-warning: #FF8C00 (Dark orange)
--china-error: #8B0000 (Dark red)
--china-neutral: #2C3E50 (Dark blue-gray)
\`\`\`

**Typography:**
- Support for Simplified Chinese: `font-family: 'Noto Sans SC', sans-serif`
- Bilingual labels (English primary, Chinese secondary)

---

## Acceptance Criteria

### Frontend Deliverables

#### Must Have (P0)
- [ ] **Flow Diagram Renders** - China CNAPS flow diagram displays with all major systems
- [ ] **Interactive Nodes** - Users can click nodes to see details (system name, status, metrics)
- [ ] **System Components Visible** - All key systems shown:
  - PBOC (People's Bank of China)
  - HVPS (High Value Payment System)
  - BEPS (Bulk Electronic Payment System)
  - Commercial Banks (ICBC, Bank of China, CCB, ABC)
  - CNAPS Clearing Centers
  - AML/Compliance Systems
- [ ] **Edge Connections** - Payment flow paths clearly shown with directional arrows
- [ ] **Responsive Layout** - Diagram fits within dashboard container without horizontal scroll
- [ ] **Loading States** - Skeleton loader displays while fetching data
- [ ] **Error Handling** - Graceful error messages if data fails to load

#### Should Have (P1)
- [ ] **Node Highlighting** - Hover effects and selection states
- [ ] **Metric Display** - Real-time metrics shown on nodes (transaction count, volume, latency)
- [ ] **Status Indicators** - Visual indicators for system health (green/yellow/red)
- [ ] **Legend Component** - Explains node types and connection meanings
- [ ] **Zoom Controls** - Users can zoom in/out and reset view
- [ ] **Filter Controls** - Toggle between HVPS and BEPS views

#### Nice to Have (P2)
- [ ] **Animated Flows** - Animated particles showing payment movement
- [ ] **Time Scrubber** - View historical flow states
- [ ] **Export Functionality** - Download diagram as PNG/SVG
- [ ] **Bilingual Support** - Toggle between English and Simplified Chinese labels

---

## Technical Implementation (Frontend Focus)

### Component Architecture

\`\`\`typescript
// Main flow component structure
export function FlowChinaCNAPS() {
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<'all' | 'hvps' | 'beps'>('all')
  
  // Fetch flow data
  const { data, isLoading, error } = useFlowData('china-cnaps')
  
  // Handle node interactions
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node.id)
    // Show node details panel
  }, [])
  
  return (
    <div className="h-[700px] w-full">
      <FlowControls onFilterChange={setFilterType} />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodeClick={onNodeClick}
        nodeTypes={chinaNodeTypes}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
      {selectedNode && <NodeDetailsPanel nodeId={selectedNode} />}
    </div>
  )
}
\`\`\`

### Node Data Structure

\`\`\`typescript
interface ChinaCNAPSNodeData {
  id: string
  type: 'pboc' | 'hvps' | 'beps' | 'bank' | 'clearing' | 'compliance'
  label: {
    en: string
    zh: string  // Simplified Chinese
  }
  system: string
  metrics: {
    transactionCount: number
    totalValue: number
    averageLatency: number
    successRate: number
  }
  status: 'operational' | 'degraded' | 'down'
  connections: string[]  // IDs of connected nodes
  position: { x: number; y: number }
  style?: {
    backgroundColor?: string
    borderColor?: string
    icon?: string
  }
}
\`\`\`

### Key Systems to Visualize

**CNAPS Architecture:**
\`\`\`
┌─────────────────────────────────────────────────────┐
│                    PBOC (央行)                       │
│              People's Bank of China                 │
└─────────────────┬───────────────────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
┌───────▼────────┐  ┌──────▼────────┐
│  HVPS (大额)    │  │  BEPS (小额)   │
│  High Value    │  │  Bulk Payment │
│  >5M CNY       │  │  <5M CNY      │
└───────┬────────┘  └──────┬────────┘
        │                   │
        └─────────┬─────────┘
                  │
        ┌─────────▼─────────┐
        │  Clearing Centers  │
        │   (清算中心)        │
        └─────────┬─────────┘
                  │
    ┌─────────────┼─────────────┐
    │             │             │
┌───▼───┐    ┌───▼───┐    ┌───▼───┐
│ ICBC  │    │  BOC  │    │  CCB  │
│工商银行│    │中国银行│    │建设银行│
└───────┘    └───────┘    └───────┘
\`\`\`

### Styling Guidelines

**Node Styling:**
\`\`\`tsx
const chinaNodeStyles = {
  pboc: {
    background: 'linear-gradient(135deg, #DC143C 0%, #8B0000 100%)',
    border: '2px solid #FFD700',
    color: '#FFFFFF',
    fontWeight: 'bold'
  },
  hvps: {
    background: '#2C3E50',
    border: '2px solid #DC143C',
    color: '#FFFFFF'
  },
  beps: {
    background: '#34495E',
    border: '2px solid #3498DB',
    color: '#FFFFFF'
  },
  bank: {
    background: '#ECF0F1',
    border: '2px solid #95A5A6',
    color: '#2C3E50'
  }
}
\`\`\`

---

## Frontend Development Tasks

### Phase 1: Core Diagram (3 days)
1. **Day 1: Setup & Structure**
   - Create component directory structure
   - Set up ReactFlow canvas
   - Define node types and interfaces
   - Create basic node components

2. **Day 2: Node Implementation**
   - Build custom node components (PBOC, HVPS, BEPS, Bank)
   - Implement node styling with China color scheme
   - Add icons and labels
   - Create node data JSON file

3. **Day 3: Connections & Layout**
   - Define edges between nodes
   - Implement auto-layout algorithm
   - Add edge labels and styling
   - Test responsive behavior

### Phase 2: Interactivity (2 days)
4. **Day 4: User Interactions**
   - Implement node click handlers
   - Add hover effects
   - Create node details panel
   - Add zoom/pan controls

5. **Day 5: Filters & Controls**
   - Build filter controls (HVPS/BEPS toggle)
   - Add time range selector
   - Implement legend component
   - Add loading states

### Phase 3: Polish & Integration (2 days)
6. **Day 6: Styling & Theming**
   - Apply China-specific color palette
   - Add Chinese font support
   - Implement bilingual labels
   - Refine animations and transitions

7. **Day 7: Integration & Testing**
   - Integrate with main dashboard
   - Add navigation menu item
   - Test across browsers
   - Fix responsive issues
   - Add error boundaries

---

## Backend Requirements (Secondary)

**API Endpoints Needed:**
\`\`\`typescript
GET /api/payment-health/china-cnaps/flow-data
GET /api/payment-health/china-cnaps/metrics
GET /api/payment-health/china-cnaps/systems/:systemId
\`\`\`

**Data Structure:**
- Node configurations (systems, positions, connections)
- Real-time metrics (transaction counts, latency, status)
- Historical data for time-based views

**Note:** Backend team should provide mock data initially so frontend can proceed independently.

---

## Dependencies

### Frontend Dependencies
- `reactflow` - Already installed
- `@radix-ui/react-dialog` - For node details panel
- `lucide-react` - For icons
- `date-fns` - For time formatting

### External Dependencies
- Mock API data (can use JSON file initially)
- Chinese font files (Noto Sans SC)
- CNAPS system documentation for accuracy

---

## Estimation

**Frontend Work: 7 days**
- Core diagram implementation: 3 days
- Interactivity & controls: 2 days
- Polish & integration: 2 days

**Backend Work: 3 days** (parallel)
- API endpoints: 1 day
- Data models: 1 day
- Mock data: 1 day

**Total: 7 days** (with parallel backend work)

---

## Success Metrics

### User Experience
- Diagram loads in < 2 seconds
- Smooth interactions (60fps)
- Zero horizontal scroll on 1400px+ screens
- All nodes visible without initial zoom adjustment

### Technical
- Component bundle size < 100KB
- Lighthouse performance score > 90
- Zero console errors
- Passes accessibility audit (WCAG 2.1 AA)

---

## Risks & Mitigation

### Risk 1: Complex Layout
**Impact:** High  
**Mitigation:** Use auto-layout library (dagre) and test with various screen sizes early

### Risk 2: Chinese Character Rendering
**Impact:** Medium  
**Mitigation:** Test font loading early, provide fallbacks, use web fonts

### Risk 3: Performance with Many Nodes
**Impact:** Medium  
**Mitigation:** Implement virtualization if >50 nodes, lazy load node details

---

## Definition of Done

- [ ] Code reviewed and approved
- [ ] All P0 acceptance criteria met
- [ ] Component documented with JSDoc comments
- [ ] Storybook stories created for node components
- [ ] Unit tests written (>80% coverage)
- [ ] Integration tests pass
- [ ] Responsive design tested (1400px, 1920px, 2560px)
- [ ] Accessibility audit passed
- [ ] Performance benchmarks met
- [ ] Deployed to staging environment
- [ ] Product owner approval

---

## Notes

- **Cultural Considerations:** Use red and gold colors appropriately (positive connotations in Chinese culture)
- **Regulatory:** CNAPS is regulated by PBOC - ensure accurate representation
- **Language:** Primary language is English, Chinese labels are supplementary
- **Future Expansion:** Design should accommodate adding Hong Kong CHATS system later
