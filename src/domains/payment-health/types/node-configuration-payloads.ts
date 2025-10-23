/**
 * Node Configuration API Payload Types
 *
 * This file defines the complete payload structure for node configuration
 * updates sent from the frontend to the backend API.
 */

/**
 * Position coordinates for a node in the flow diagram
 */
export interface NodePosition {
  /** X coordinate in pixels */
  x: number
  /** Y coordinate in pixels */
  y: number
}

/**
 * Dimensions of a node
 */
export interface NodeDimensions {
  /** Width in pixels (optional, can be auto-calculated) */
  width?: number
  /** Height in pixels (optional, can be auto-calculated) */
  height?: number
}

/**
 * Metric display configuration for a node
 */
export interface NodeMetric {
  /** Unique identifier for the metric */
  id: string
  /** Display label for the metric */
  label: string
  /** Current value of the metric */
  value: string | number
  /** Unit of measurement (e.g., "ms", "%", "$") */
  unit?: string
  /** Trend indicator (up, down, neutral) */
  trend?: "up" | "down" | "neutral"
  /** Whether this metric should be prominently displayed */
  isPrimary?: boolean
}

/**
 * Visual styling configuration for a node
 */
export interface NodeStyle {
  /** Background color (hex, rgb, or CSS color name) */
  backgroundColor?: string
  /** Border color */
  borderColor?: string
  /** Border width in pixels */
  borderWidth?: number
  /** Border style (solid, dashed, dotted) */
  borderStyle?: "solid" | "dashed" | "dotted"
  /** Text color */
  textColor?: string
  /** Icon name or URL */
  icon?: string
  /** Custom CSS classes */
  customClasses?: string[]
}

/**
 * Connection handle configuration
 */
export interface NodeHandle {
  /** Unique identifier for the handle */
  id: string
  /** Type of handle (source or target) */
  type: "source" | "target"
  /** Position on the node (top, right, bottom, left) */
  position: "top" | "right" | "bottom" | "left"
  /** Whether this handle is currently enabled */
  enabled: boolean
  /** Label for the handle (optional) */
  label?: string
}

/**
 * Custom configuration specific to node type
 */
export interface NodeCustomConfig {
  /** Node category (e.g., "payment", "validation", "settlement") */
  category?: string
  /** Node type (e.g., "processor", "gateway", "database") */
  type?: string
  /** Whether the node is expandable */
  expandable?: boolean
  /** Whether the node is currently expanded */
  expanded?: boolean
  /** Maximum number of connections allowed */
  maxConnections?: number
  /** Custom data fields specific to this node type */
  customFields?: Record<string, unknown>
  /** Tags for categorization and filtering */
  tags?: string[]
  /** Priority level (1-5, where 5 is highest) */
  priority?: number
  /** Whether this node is critical to the flow */
  isCritical?: boolean
}

/**
 * Complete node configuration data
 */
export interface NodeConfiguration {
  /** Unique identifier for the node (UUID recommended) */
  id: string
  /** Display label for the node */
  label: string
  /** Optional description or tooltip text */
  description?: string
  /** Position in the flow diagram */
  position: NodePosition
  /** Dimensions of the node */
  dimensions?: NodeDimensions
  /** Metrics to display on the node */
  metrics?: NodeMetric[]
  /** Visual styling configuration */
  style?: NodeStyle
  /** Connection handles configuration */
  handles?: NodeHandle[]
  /** Custom configuration specific to node type */
  customConfig?: NodeCustomConfig
  /** Version number for optimistic locking */
  version: number
  /** Whether the node is currently active/enabled */
  isActive: boolean
  /** Whether the node is visible in the diagram */
  isVisible: boolean
}

/**
 * Metadata included with every request
 */
export interface RequestMetadata {
  /** Timestamp when the request was created (ISO 8601 format) */
  timestamp: string
  /** User ID of the person making the change */
  userId: string
  /** Username for audit trail */
  username: string
  /** User's email address */
  userEmail?: string
  /** Session ID for tracking */
  sessionId?: string
  /** Client application version */
  clientVersion?: string
  /** Reason for the change (optional, for audit trail) */
  changeReason?: string
  /** IP address of the client (set by backend) */
  ipAddress?: string
}

/**
 * Single node update payload
 */
export interface UpdateNodePayload {
  /** Node configuration data */
  node: NodeConfiguration
  /** Request metadata */
  metadata: RequestMetadata
  /** Fields that were actually changed (for partial updates) */
  changedFields?: string[]
  /** Whether to validate connections after update */
  validateConnections?: boolean
}

/**
 * Batch node update payload
 */
export interface BatchUpdateNodesPayload {
  /** Array of node configurations to update */
  nodes: NodeConfiguration[]
  /** Request metadata */
  metadata: RequestMetadata
  /** Whether to perform updates as a transaction (all or nothing) */
  transactional?: boolean
  /** Whether to validate all connections after updates */
  validateConnections?: boolean
}

/**
 * Node deletion payload
 */
export interface DeleteNodePayload {
  /** ID of the node to delete */
  nodeId: string
  /** Version number for optimistic locking */
  version: number
  /** Request metadata */
  metadata: RequestMetadata
  /** Whether to cascade delete connected edges */
  cascadeDelete?: boolean
}

/**
 * Batch node deletion payload
 */
export interface BatchDeleteNodesPayload {
  /** Array of node IDs to delete with their versions */
  nodes: Array<{
    nodeId: string
    version: number
  }>
  /** Request metadata */
  metadata: RequestMetadata
  /** Whether to perform deletions as a transaction */
  transactional?: boolean
  /** Whether to cascade delete connected edges */
  cascadeDelete?: boolean
}

/**
 * Response from the backend after successful update
 */
export interface NodeUpdateResponse {
  /** Whether the operation was successful */
  success: boolean
  /** Updated node configuration with new version */
  node: NodeConfiguration
  /** Timestamp of the update on the server */
  updatedAt: string
  /** Any warnings or informational messages */
  warnings?: string[]
}

/**
 * Response from the backend after batch update
 */
export interface BatchNodeUpdateResponse {
  /** Whether the operation was successful */
  success: boolean
  /** Array of updated node configurations */
  nodes: NodeConfiguration[]
  /** Number of nodes successfully updated */
  updatedCount: number
  /** Number of nodes that failed to update */
  failedCount: number
  /** Details of any failures */
  failures?: Array<{
    nodeId: string
    error: string
  }>
  /** Timestamp of the update on the server */
  updatedAt: string
}

/**
 * Error response structure
 */
export interface NodeUpdateErrorResponse {
  /** Whether the operation was successful (always false) */
  success: false
  /** Error code for programmatic handling */
  errorCode: string
  /** Human-readable error message */
  message: string
  /** Detailed error information */
  details?: Record<string, unknown>
  /** Field-specific validation errors */
  validationErrors?: Array<{
    field: string
    message: string
    value?: unknown
  }>
  /** Timestamp of the error */
  timestamp: string
}
