# Edge Context Menu Implementation Guide

## Overview

The Edge Context Menu provides an intuitive way for users to interact with connections in the React Flow diagram. Users can right-click on any edge to access a context menu with options to view details or remove the connection.

## Architecture

### Components

1. **context-menu.tsx** - Base Radix UI context menu component with shadcn styling
2. **EdgeContextMenu.tsx** - Domain-specific wrapper for edge interactions
3. **Flow diagram integration** - Handles edge deletion and state management

## Features

### 1. Right-Click Detection
- Detects right-click events on edges automatically
- Prevents context menu on background/nodes to avoid interference
- Works with React Flow's built-in edge interaction system

### 2. Context Menu Options

**View Details**
- Shows edge information including:
  - Source node label
  - Target node label
  - Edge ID
- Uses toast notification for non-intrusive display

**Remove Connection**
- Deletes the edge from the diagram
- Updates connected edges state if selected
- Shows success notification with connection details
- Styled as destructive action (red) for visual clarity

### 3. Visual Feedback

**Menu Appearance**
- Clean white background with subtle shadow
- Icon-based menu items for quick recognition
- Destructive action clearly marked in red
- Smooth animations on open/close

**Toast Notifications**
- Success toast on edge removal
- Info toast on detail view
- Includes relevant icons and descriptions

## Usage

### For Users

1. **Open Context Menu**
   - Right-click on any edge in the diagram
   - Works on both straight and curved edges
   - Menu appears at cursor position

2. **View Details**
   - Click "View Details" to see connection information
   - Displays source and target nodes
   - Shows internal edge ID for reference

3. **Remove Connection**
   - Click "Remove Connection" to delete the edge
   - Confirmation appears via toast notification
   - Action is immediate and cannot be undone

### For Developers

#### Adding Context Menu to Edges

\`\`\`tsx
import { EdgeContextMenu } from "@/domains/payment-health/components/flow/context-menu/EdgeContextMenu"

// In your edge data preparation
const edgesWithMenu = edges.map((edge) => ({
  ...edge,
  data: {
    ...edge.data,
    sourceLabel: getNodeLabel(edge.source),
    targetLabel: getNodeLabel(edge.target),
    onDelete: handleDeleteEdge,
  },
}))
\`\`\`

#### Handling Edge Deletion

\`\`\`tsx
const handleDeleteEdge = useCallback(
  (edgeIdToDelete: string) => {
    // Remove from edges state
    setEdges((currentEdges) => 
      currentEdges.filter((edge) => edge.id !== edgeIdToDelete)
    )
    
    // Update any dependent state
    if (connectedEdgeIds.has(edgeIdToDelete)) {
      setConnectedEdgeIds((prev) => {
        const updated = new Set(prev)
        updated.delete(edgeIdToDelete)
        return updated
      })
    }
  },
  [connectedEdgeIds]
)
\`\`\`

## Technical Details

### React Flow Integration

The context menu works seamlessly with React Flow's edge system:

1. **Edge Context Events**
   \`\`\`tsx
   <ReactFlow
     onEdgeContextMenu={(event, edge) => {
       event.preventDefault()
       // React Flow handles the context menu trigger
     }}
   />
   \`\`\`

2. **Edge Data Enhancement**
   - Edge data includes labels and delete handler
   - Menu extracts information from edge.data
   - Deletion flows through React Flow's state management

### State Management

**Edge State**
\`\`\`tsx
const [edges, setEdges] = useState<Edge[]>([])
const [connectedEdgeIds, setConnectedEdgeIds] = useState<Set<string>>(new Set())
\`\`\`

**Deletion Flow**
1. User right-clicks edge
2. Context menu opens with edge data
3. User clicks "Remove Connection"
4. Handler filters edge from state
5. React Flow re-renders without edge
6. Connected state updates if necessary

### Accessibility

- **Keyboard Support**: Context menu can be triggered via keyboard (Shift+F10)
- **Screen Reader**: Menu items have proper labels
- **Focus Management**: Focus returns to diagram after menu closes
- **Visual Indicators**: Destructive actions clearly marked

### Performance Considerations

- **Memoization**: Edge data is memoized to prevent unnecessary recalculations
- **State Updates**: Uses functional updates for concurrent-safe state changes
- **Event Handling**: Context menu events are properly scoped to prevent propagation issues

## Customization

### Adding New Menu Items

\`\`\`tsx
<ContextMenuItem onClick={handleCustomAction}>
  <CustomIcon className="h-4 w-4" />
  <span>Custom Action</span>
</ContextMenuItem>
\`\`\`

### Styling Options

The context menu uses shadcn/ui theming:
- Modify `context-menu.tsx` for global styling
- Use `className` prop for specific overrides
- Supports light/dark mode automatically

### Conditional Menu Items

\`\`\`tsx
{edge.data.canEdit && (
  <ContextMenuItem onClick={handleEdit}>
    <Edit className="h-4 w-4" />
    <span>Edit Connection</span>
  </ContextMenuItem>
)}
\`\`\`

## Best Practices

1. **Always Provide Feedback**
   - Show toast notifications for all actions
   - Use appropriate icons for context
   - Include descriptive messages

2. **Maintain State Consistency**
   - Update all related state when deleting edges
   - Clear selections if affected
   - Validate edge existence before operations

3. **Handle Edge Cases**
   - Disable menu for system-defined edges
   - Validate permissions before allowing deletion
   - Handle missing node labels gracefully

4. **Performance**
   - Memo-ize edge data calculations
   - Use functional state updates
   - Avoid unnecessary re-renders

## Troubleshooting

### Context Menu Not Appearing

**Issue**: Right-click doesn't show menu
**Solutions**:
- Check if `onContextMenu` is prevented globally
- Verify edge has `interactionWidth` for easier clicking
- Ensure `EdgeContextMenu` is properly wrapping content

### Edge Not Deleting

**Issue**: Delete action doesn't remove edge
**Solutions**:
- Verify `handleDeleteEdge` is called with correct ID
- Check edge state updates are immutable
- Ensure React Flow's `onEdgesChange` is connected

### Menu Positioning Issues

**Issue**: Menu appears in wrong location
**Solutions**:
- Radix UI handles positioning automatically
- Check for CSS transforms on parent containers
- Verify z-index stacking context

## Future Enhancements

Potential improvements for the context menu system:

1. **Edit Connection Properties**
   - Change edge label
   - Modify edge styling
   - Add metadata

2. **Bulk Operations**
   - Select multiple edges
   - Delete multiple connections
   - Apply actions to groups

3. **Undo/Redo**
   - Store edge deletion history
   - Allow undo of removals
   - Integrate with global undo system

4. **Connection Analytics**
   - Show connection health metrics
   - Display traffic flow data
   - Link to related monitoring

5. **Permissions**
   - Role-based menu items
   - Read-only mode
   - Audit logging for deletions

## Related Documentation

- [React Flow Edge Documentation](https://reactflow.dev/api-reference/types/edge)
- [Radix UI Context Menu](https://www.radix-ui.com/primitives/docs/components/context-menu)
- [Flow Diagram Architecture](./flow-data-architecture.md)
