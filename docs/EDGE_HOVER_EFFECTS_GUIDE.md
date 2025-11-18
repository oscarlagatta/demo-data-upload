# React Flow Edge Hover Effects Guide

## Overview

This guide documents the enhanced edge hover effects implemented in the React Flow payment health monitoring system. The effects provide clear visual feedback without changing edge positions, maintaining clarity and preventing user confusion.

## Design Principles

### 1. **No Position Changes**
- Edges remain in their exact position during hover
- No translation, rotation, or layout shifts
- Maintains spatial relationships and mental model

### 2. **Subtle Visual Feedback**
- Changes are noticeable but not jarring
- Smooth transitions using ease-in-out curves
- Professional and polished appearance

### 3. **Progressive Enhancement**
- Base state: Gray stroke (#6b7280)
- Hover state: Blue stroke (#3b82f6) with glow
- Connected state: Darker blue (#1d4ed8) with stronger glow
- Dimmed state: Light gray (#d1d5db) with no hover effects

## Implemented Effects

### Color Transition
\`\`\`css
.react-flow__edge:hover .react-flow__edge-path {
  stroke: #3b82f6 !important;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
\`\`\`

**Purpose**: Primary visual indicator of hover state
**Effect**: Smooth color change from gray to blue
**Duration**: 200ms with cubic-bezier easing

### Stroke Width Increase
\`\`\`css
.react-flow__edge:hover .react-flow__edge-path {
  stroke-width: 3 !important;
}

.react-flow__edge:hover .react-flow__edge-path.edge-connected {
  stroke-width: 4 !important;
}
\`\`\`

**Purpose**: Emphasize the edge without position change
**Effect**: Line becomes thicker on hover
**States**:
- Default: 2px
- Hover: 3px
- Connected + Hover: 4px

### Glow/Shadow Effect
\`\`\`css
.react-flow__edge:hover .react-flow__edge-path {
  filter: drop-shadow(0 0 4px rgba(59, 130, 246, 0.5));
}

.react-flow__edge:hover .react-flow__edge-path.edge-connected {
  filter: drop-shadow(0 0 6px rgba(29, 78, 216, 0.6));
}
\`\`\`

**Purpose**: Add depth and prominence
**Effect**: Soft blue glow around the edge
**Intensity**: Stronger for connected edges

### Marker (Arrow) Styling
\`\`\`css
.react-flow__edge:hover marker path {
  fill: #3b82f6 !important;
  filter: drop-shadow(0 0 2px rgba(59, 130, 246, 0.5));
}
\`\`\`

**Purpose**: Ensure arrows match edge styling
**Effect**: Arrows change color and glow with edge

### Edge Label Enhancement
\`\`\`css
.react-flow__edge:hover .react-flow__edge-text {
  fill: #1e40af !important;
  font-weight: 600 !important;
}

.react-flow__edge:hover .react-flow__edge-textbg {
  fill: #dbeafe !important;
}
\`\`\`

**Purpose**: Improve label readability on hover
**Effect**: Text becomes bold and background lightens

### Pulse Animation (Active State)
\`\`\`css
@keyframes edge-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

.react-flow__edge:active .react-flow__edge-path {
  animation: edge-pulse 0.4s ease-in-out;
}
\`\`\`

**Purpose**: Provide tactile feedback on click/drag
**Effect**: Brief opacity pulse when interacting

## State-Based Behavior

### Default State
- Stroke: #6b7280 (gray)
- Width: 2px
- No glow
- Full opacity

### Hover State
- Stroke: #3b82f6 (blue)
- Width: 3px
- Blue glow (4px radius)
- Smooth transition

### Connected State (from node selection)
- Stroke: #1d4ed8 (darker blue)
- Width: 3px (4px on hover)
- Animated dashes
- Stronger glow on hover

### Dimmed State (when other nodes selected)
- Stroke: #d1d5db (light gray)
- Width: 2px
- Opacity: 0.3
- No hover effects (disabled)

## Implementation Details

### CSS Classes
The component applies these classes dynamically:

\`\`\`typescript
className: `${isConnected ? "edge-connected" : ""} ${isDimmed ? "edge-dimmed" : ""}`
\`\`\`

### Interaction Width
\`\`\`typescript
interactionWidth: 20
\`\`\`

Creates a wider invisible area for easier hovering, especially on mobile or with less precise input devices.

### Transition Timing
All transitions use: `0.2s cubic-bezier(0.4, 0, 0.2, 1)`

This provides:
- Fast initial response (feels instant)
- Smooth deceleration (appears natural)
- Professional polish

## Accessibility Considerations

### Keyboard Navigation
- Edge hover effects work with keyboard focus
- Tab through edges to see highlighting

### High Contrast Mode
- Sufficient color contrast maintained
- Stroke width increase provides non-color feedback

### Reduced Motion
Consider adding a media query for users who prefer reduced motion:

\`\`\`css
@media (prefers-reduced-motion: reduce) {
  .react-flow__edge,
  .react-flow__edge:hover .react-flow__edge-path {
    transition: none !important;
    animation: none !important;
  }
}
\`\`\`

## Performance Optimization

### Hardware Acceleration
Using `transform` and `opacity` (GPU-accelerated properties) for animations where possible.

### Will-Change Hint
Consider adding for frequently hovered edges:

\`\`\`css
.react-flow__edge {
  will-change: stroke, stroke-width, filter;
}
\`\`\`

**Note**: Only use if performance issues are detected, as it can increase memory usage.

## Browser Compatibility

### Modern Browsers
- Chrome/Edge 90+: Full support
- Firefox 88+: Full support
- Safari 14+: Full support

### Filter Effects
The `drop-shadow()` filter is supported in all modern browsers. Fallback without glow is acceptable for older browsers.

## Testing Checklist

- [ ] Hover over edge changes color smoothly
- [ ] Stroke width increases without layout shift
- [ ] Glow effect visible on hover
- [ ] Arrow markers change with edge
- [ ] Labels become bold and readable
- [ ] No hover effects on dimmed edges
- [ ] Click/drag produces pulse animation
- [ ] Transitions are smooth (200ms)
- [ ] No performance issues with many edges
- [ ] Works with keyboard navigation

## Future Enhancements

### Potential Additions
1. **Gradient strokes**: Directional flow indication
2. **Animated dash patterns**: For data flow visualization
3. **Custom hover tooltips**: Show edge metadata
4. **Click-to-highlight**: Persistent edge selection
5. **Edge bundling**: Group related edges with shared hover

### Performance Monitoring
\`\`\`javascript
// Add to development build
console.time('[v0] Edge hover render time')
// Edge interaction code
console.timeEnd('[v0] Edge hover render time')
\`\`\`

## Troubleshooting

### Issue: Hover effects not working
**Solution**: Check CSS specificity. Use `!important` if needed or increase selector specificity.

### Issue: Transitions feel sluggish
**Solution**: Reduce transition duration from 0.2s to 0.15s or adjust easing function.

### Issue: Glow not visible
**Solution**: Ensure background color provides sufficient contrast. Test on both light and dark backgrounds.

### Issue: Hover area too small
**Solution**: Increase `interactionWidth` property (current: 20px).

## Code Examples

### Basic Edge Configuration
\`\`\`typescript
const edgeConfig = {
  style: {
    stroke: "#6b7280",
    strokeWidth: 2,
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  interactionWidth: 20,
}
\`\`\`

### Dynamic Edge with States
\`\`\`typescript
const edgeWithStates = {
  ...baseEdge,
  className: `
    ${isConnected ? "edge-connected" : ""} 
    ${isDimmed ? "edge-dimmed" : ""}
  `.trim(),
  style: {
    strokeWidth: isConnected ? 3 : 2,
    stroke: isConnected ? "#1d4ed8" : isDimmed ? "#d1d5db" : "#6b7280",
    opacity: isDimmed ? 0.3 : 1,
  },
  animated: isConnected,
}
\`\`\`

## Conclusion

The enhanced edge hover effects provide clear, intuitive visual feedback without disrupting the user's spatial understanding of the flow diagram. The effects are subtle, performant, and accessible, ensuring a professional user experience across all interaction methods and devices.
