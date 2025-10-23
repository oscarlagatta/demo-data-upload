# Node Configuration API Payload Examples

This document provides comprehensive examples of payloads sent from the frontend to the backend when updating node configurations in the flow diagram.

## Table of Contents

1. [Single Node Update](#single-node-update)
2. [Batch Node Update](#batch-node-update)
3. [Partial Node Update](#partial-node-update)
4. [Node Deletion](#node-deletion)
5. [Batch Node Deletion](#batch-node-deletion)
6. [Success Responses](#success-responses)
7. [Error Responses](#error-responses)
8. [Validation Rules](#validation-rules)

---

## Single Node Update

### POST /api/nodes/update

**Use Case:** User edits a single node's properties (label, position, metrics, etc.)

**Request Payload:**

\`\`\`json
{
  "node": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "label": "Payment Gateway",
    "description": "Primary payment processing gateway for credit card transactions",
    "position": {
      "x": 250,
      "y": 150
    },
    "dimensions": {
      "width": 200,
      "height": 120
    },
    "metrics": [
      {
        "id": "metric-1",
        "label": "Transactions",
        "value": 15234,
        "unit": "txns",
        "trend": "up",
        "isPrimary": true
      },
      {
        "id": "metric-2",
        "label": "Success Rate",
        "value": 99.7,
        "unit": "%",
        "trend": "neutral",
        "isPrimary": false
      },
      {
        "id": "metric-3",
        "label": "Avg Response",
        "value": 145,
        "unit": "ms",
        "trend": "down",
        "isPrimary": false
      }
    ],
    "style": {
      "backgroundColor": "#f0f4f8",
      "borderColor": "#3b82f6",
      "borderWidth": 2,
      "borderStyle": "solid",
      "textColor": "#1e293b",
      "icon": "credit-card",
      "customClasses": ["payment-node", "critical-path"]
    },
    "handles": [
      {
        "id": "handle-top",
        "type": "target",
        "position": "top",
        "enabled": true,
        "label": "Input"
      },
      {
        "id": "handle-bottom",
        "type": "source",
        "position": "bottom",
        "enabled": true,
        "label": "Output"
      }
    ],
    "customConfig": {
      "category": "payment",
      "type": "gateway",
      "expandable": true,
      "expanded": false,
      "maxConnections": 5,
      "customFields": {
        "provider": "Stripe",
        "apiVersion": "2023-10-16",
        "environment": "production"
      },
      "tags": ["payment", "critical", "pci-compliant"],
      "priority": 5,
      "isCritical": true
    },
    "version": 3,
    "isActive": true,
    "isVisible": true
  },
  "metadata": {
    "timestamp": "2025-01-23T14:30:45.123Z",
    "userId": "user-12345",
    "username": "john.doe",
    "userEmail": "john.doe@example.com",
    "sessionId": "sess-abc123xyz",
    "clientVersion": "1.2.3",
    "changeReason": "Updated metrics and styling"
  },
  "changedFields": ["label", "metrics", "style"],
  "validateConnections": true
}
\`\`\`

---

## Batch Node Update

### POST /api/nodes/batch-update

**Use Case:** User repositions multiple nodes at once (drag selection) or updates multiple nodes simultaneously

**Request Payload:**

\`\`\`json
{
  "nodes": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "label": "Payment Gateway",
      "position": {
        "x": 300,
        "y": 150
      },
      "version": 3,
      "isActive": true,
      "isVisible": true
    },
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "label": "Fraud Detection",
      "position": {
        "x": 300,
        "y": 300
      },
      "version": 2,
      "isActive": true,
      "isVisible": true
    },
    {
      "id": "770e8400-e29b-41d4-a716-446655440002",
      "label": "Settlement Engine",
      "position": {
        "x": 600,
        "y": 225
      },
      "version": 5,
      "isActive": true,
      "isVisible": true
    }
  ],
  "metadata": {
    "timestamp": "2025-01-23T14:35:22.456Z",
    "userId": "user-12345",
    "username": "john.doe",
    "userEmail": "john.doe@example.com",
    "sessionId": "sess-abc123xyz",
    "clientVersion": "1.2.3",
    "changeReason": "Reorganized flow layout"
  },
  "transactional": true,
  "validateConnections": true
}
\`\`\`

---

## Partial Node Update

### PATCH /api/nodes/{nodeId}

**Use Case:** User updates only specific fields of a node (e.g., just the label or just the position)

**Request Payload:**

\`\`\`json
{
  "node": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "label": "Updated Payment Gateway Name",
    "version": 3
  },
  "metadata": {
    "timestamp": "2025-01-23T14:40:10.789Z",
    "userId": "user-12345",
    "username": "john.doe",
    "userEmail": "john.doe@example.com",
    "sessionId": "sess-abc123xyz",
    "clientVersion": "1.2.3",
    "changeReason": "Renamed node for clarity"
  },
  "changedFields": ["label"],
  "validateConnections": false
}
\`\`\`

---

## Node Deletion

### DELETE /api/nodes/{nodeId}

**Use Case:** User deletes a single node from the flow diagram

**Request Payload:**

\`\`\`json
{
  "nodeId": "550e8400-e29b-41d4-a716-446655440000",
  "version": 3,
  "metadata": {
    "timestamp": "2025-01-23T14:45:33.012Z",
    "userId": "user-12345",
    "username": "john.doe",
    "userEmail": "john.doe@example.com",
    "sessionId": "sess-abc123xyz",
    "clientVersion": "1.2.3",
    "changeReason": "Node no longer needed in flow"
  },
  "cascadeDelete": true
}
\`\`\`

---

## Batch Node Deletion

### POST /api/nodes/batch-delete

**Use Case:** User deletes multiple nodes at once

**Request Payload:**

\`\`\`json
{
  "nodes": [
    {
      "nodeId": "550e8400-e29b-41d4-a716-446655440000",
      "version": 3
    },
    {
      "nodeId": "660e8400-e29b-41d4-a716-446655440001",
      "version": 2
    }
  ],
  "metadata": {
    "timestamp": "2025-01-23T14:50:15.345Z",
    "userId": "user-12345",
    "username": "john.doe",
    "userEmail": "john.doe@example.com",
    "sessionId": "sess-abc123xyz",
    "clientVersion": "1.2.3",
    "changeReason": "Removed deprecated nodes"
  },
  "transactional": true,
  "cascadeDelete": true
}
\`\`\`

---

## Success Responses

### Single Node Update Success

\`\`\`json
{
  "success": true,
  "node": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "label": "Payment Gateway",
    "description": "Primary payment processing gateway for credit card transactions",
    "position": {
      "x": 250,
      "y": 150
    },
    "version": 4,
    "isActive": true,
    "isVisible": true
  },
  "updatedAt": "2025-01-23T14:30:45.234Z",
  "warnings": []
}
\`\`\`

### Batch Update Success

\`\`\`json
{
  "success": true,
  "nodes": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "label": "Payment Gateway",
      "position": { "x": 300, "y": 150 },
      "version": 4,
      "isActive": true,
      "isVisible": true
    },
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "label": "Fraud Detection",
      "position": { "x": 300, "y": 300 },
      "version": 3,
      "isActive": true,
      "isVisible": true
    }
  ],
  "updatedCount": 2,
  "failedCount": 0,
  "failures": [],
  "updatedAt": "2025-01-23T14:35:22.567Z"
}
\`\`\`

---

## Error Responses

### Validation Error

\`\`\`json
{
  "success": false,
  "errorCode": "VALIDATION_ERROR",
  "message": "Node configuration validation failed",
  "details": {
    "nodeId": "550e8400-e29b-41d4-a716-446655440000"
  },
  "validationErrors": [
    {
      "field": "label",
      "message": "Label must be between 1 and 100 characters",
      "value": ""
    },
    {
      "field": "position.x",
      "message": "X coordinate must be a positive number",
      "value": -50
    },
    {
      "field": "metrics[0].value",
      "message": "Metric value must be a number",
      "value": "invalid"
    }
  ],
  "timestamp": "2025-01-23T14:30:45.234Z"
}
\`\`\`

### Version Conflict Error (Optimistic Locking)

\`\`\`json
{
  "success": false,
  "errorCode": "VERSION_CONFLICT",
  "message": "Node has been modified by another user",
  "details": {
    "nodeId": "550e8400-e29b-41d4-a716-446655440000",
    "clientVersion": 3,
    "serverVersion": 5,
    "lastModifiedBy": "jane.smith",
    "lastModifiedAt": "2025-01-23T14:28:30.123Z"
  },
  "timestamp": "2025-01-23T14:30:45.234Z"
}
\`\`\`

### Authorization Error

\`\`\`json
{
  "success": false,
  "errorCode": "UNAUTHORIZED",
  "message": "User does not have permission to modify this node",
  "details": {
    "nodeId": "550e8400-e29b-41d4-a716-446655440000",
    "userId": "user-12345",
    "requiredPermission": "nodes.write"
  },
  "timestamp": "2025-01-23T14:30:45.234Z"
}
\`\`\`

### Node Not Found Error

\`\`\`json
{
  "success": false,
  "errorCode": "NODE_NOT_FOUND",
  "message": "Node with specified ID does not exist",
  "details": {
    "nodeId": "550e8400-e29b-41d4-a716-446655440000"
  },
  "timestamp": "2025-01-23T14:30:45.234Z"
}
\`\`\`

---

## Validation Rules

### Backend Validation Checklist

The backend MUST validate the following for every node update:

#### 1. **Node ID Validation**
- Must be a valid UUID format
- Must exist in the database (for updates)
- Must not exist in the database (for creates)

#### 2. **Label Validation**
- Required field
- Length: 1-100 characters
- Must not contain only whitespace
- Sanitize for XSS: Remove/escape HTML tags and script content

#### 3. **Position Validation**
- `x` and `y` must be numbers
- `x` and `y` must be >= 0
- `x` must be <= 10000 (reasonable canvas limit)
- `y` must be <= 10000 (reasonable canvas limit)

#### 4. **Dimensions Validation**
- If provided, `width` and `height` must be numbers
- If provided, must be >= 50 (minimum usable size)
- If provided, must be <= 1000 (maximum reasonable size)

#### 5. **Metrics Validation**
- Each metric must have a unique `id`
- `label` is required (1-50 characters)
- `value` must be string or number
- `unit` if provided, max 10 characters
- `trend` must be one of: 'up', 'down', 'neutral'
- Maximum 10 metrics per node

#### 6. **Style Validation**
- Colors must be valid hex (#RRGGBB), rgb(r,g,b), or CSS color names
- `borderWidth` must be 0-10
- `borderStyle` must be one of: 'solid', 'dashed', 'dotted'
- `customClasses` array max 20 items, each max 50 characters
- Sanitize all string values for XSS

#### 7. **Handles Validation**
- Each handle must have a unique `id`
- `type` must be 'source' or 'target'
- `position` must be 'top', 'right', 'bottom', or 'left'
- Maximum 8 handles per node
- At least one source and one target handle recommended

#### 8. **Custom Config Validation**
- `category` max 50 characters
- `type` max 50 characters
- `maxConnections` must be 1-100
- `customFields` object max depth 3, max 50 keys
- `tags` array max 20 items, each max 30 characters
- `priority` must be 1-5
- Sanitize all string values

#### 9. **Version Validation**
- Must be a positive integer
- Must match current version in database (optimistic locking)
- Increment by 1 on successful update

#### 10. **Metadata Validation**
- `timestamp` must be valid ISO 8601 format
- `timestamp` must be within last 5 minutes (prevent replay attacks)
- `userId` must exist and be authenticated
- `username` and `userEmail` must match authenticated user
- `sessionId` must be valid and active
- `changeReason` max 500 characters

#### 11. **Security Validation**
- Verify JWT token or session authentication
- Check user has 'nodes.write' permission
- Rate limit: Max 100 requests per minute per user
- Log all modifications for audit trail
- Sanitize all string inputs to prevent SQL injection
- Validate against CSRF token

#### 12. **Business Logic Validation**
- Cannot delete a node that has active connections (unless cascadeDelete=true)
- Cannot move a node outside the canvas boundaries
- Cannot create circular dependencies in connections
- Cannot exceed maximum nodes per diagram (e.g., 500)
- Critical nodes (isCritical=true) may require additional approval

### SQL Injection Prevention

\`\`\`sql
-- BAD: String concatenation (vulnerable to SQL injection)
SELECT * FROM nodes WHERE id = '" + nodeId + "'

-- GOOD: Parameterized query
SELECT * FROM nodes WHERE id = $1
\`\`\`

### XSS Prevention

\`\`\`javascript
// Backend sanitization example (Node.js)
const sanitizeHtml = require('sanitize-html');

function sanitizeNodeData(node) {
  return {
    ...node,
    label: sanitizeHtml(node.label, { allowedTags: [], allowedAttributes: {} }),
    description: sanitizeHtml(node.description, { allowedTags: [], allowedAttributes: {} }),
    // Sanitize all string fields...
  };
}
\`\`\`

### Rate Limiting Example

\`\`\`javascript
// Express.js rate limiting middleware
const rateLimit = require('express-rate-limit');

const nodeUpdateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // Max 100 requests per minute
  message: 'Too many node updates, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

app.post('/api/nodes/update', nodeUpdateLimiter, updateNodeHandler);
\`\`\`

---

## Summary

This payload structure provides:

1. **Comprehensive Data Model**: All necessary fields for node configuration
2. **Metadata Tracking**: Complete audit trail with user info and timestamps
3. **Version Control**: Optimistic locking to prevent lost updates
4. **Flexibility**: Support for partial updates, batch operations, and custom fields
5. **Security**: Built-in fields for authentication, authorization, and audit
6. **Validation**: Clear rules for backend validation
7. **Error Handling**: Structured error responses with detailed information

Backend developers should implement all validation rules, sanitize inputs, enforce authentication/authorization, use parameterized queries, implement rate limiting, and maintain comprehensive audit logs for all modifications.
