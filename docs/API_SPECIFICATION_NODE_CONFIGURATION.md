# Node Configuration API Specification

## Overview

This document specifies the backend API endpoints required to support node configuration updates in the Payment Health Dashboard flow diagrams. The API enables frontend applications to persist node modifications to the database while maintaining data integrity and security.

## Base URL

\`\`\`
/api/v2/flow/nodes
\`\`\`

## Authentication

All endpoints require authentication via JWT token in the Authorization header:

\`\`\`
Authorization: Bearer <jwt_token>
\`\`\`

## Endpoints

### 1. Update Single Node Configuration

**Endpoint:** `PUT /api/v2/flow/nodes/:nodeId`

**Description:** Updates a single node's configuration in the database.

**Request Headers:**
\`\`\`
Content-Type: application/json
Authorization: Bearer <jwt_token>
\`\`\`

**Path Parameters:**
- `nodeId` (string, required): The unique identifier of the node to update

**Request Body:**
\`\`\`typescript
{
  "nodeId": "string",           // Must match path parameter
  "title": "string",            // Required, max 100 chars
  "aitNumber": "string",        // Required, max 50 chars
  "averageThruputTime30": number | null,  // Optional, milliseconds
  "currentThruputTime30": number | null,  // Optional, milliseconds
  "position": {                 // Optional
    "x": number,
    "y": number
  },
  "metadata": {                 // Optional, flexible JSON object
    [key: string]: any
  },
  "updatedBy": "string",        // Optional, user identifier
  "timestamp": "string"         // ISO 8601 timestamp
}
\`\`\`

**Response (200 OK):**
\`\`\`typescript
{
  "success": true,
  "nodeId": "string",
  "version": number,            // Incremented version number
  "updatedAt": "string",        // ISO 8601 timestamp
  "message": "Node configuration updated successfully"
}
\`\`\`

**Error Responses:**

**400 Bad Request:**
\`\`\`json
{
  "error": "ValidationError",
  "message": "Invalid request data",
  "statusCode": 400,
  "details": {
    "field": "title",
    "issue": "Title is required and cannot be empty"
  }
}
\`\`\`

**401 Unauthorized:**
\`\`\`json
{
  "error": "Unauthorized",
  "message": "Invalid or missing authentication token",
  "statusCode": 401
}
\`\`\`

**404 Not Found:**
\`\`\`json
{
  "error": "NotFound",
  "message": "Node with ID 'xyz' not found",
  "statusCode": 404
}
\`\`\`

**409 Conflict:**
\`\`\`json
{
  "error": "VersionConflict",
  "message": "Node has been modified by another user",
  "statusCode": 409,
  "details": {
    "currentVersion": 5,
    "attemptedVersion": 4
  }
}
\`\`\`

**500 Internal Server Error:**
\`\`\`json
{
  "error": "InternalServerError",
  "message": "An unexpected error occurred",
  "statusCode": 500
}
\`\`\`

---

### 2. Batch Update Node Configurations

**Endpoint:** `PUT /api/v2/flow/nodes/batch`

**Description:** Updates multiple nodes in a single transaction.

**Request Body:**
\`\`\`typescript
{
  "nodes": [
    {
      "nodeId": "string",
      "title": "string",
      "aitNumber": "string",
      "averageThruputTime30": number | null,
      "currentThruputTime30": number | null,
      "position": { "x": number, "y": number },
      "metadata": { [key: string]: any }
    }
  ],
  "timestamp": "string"
}
\`\`\`

**Response (200 OK):**
\`\`\`typescript
{
  "success": true,
  "results": [
    {
      "success": true,
      "nodeId": "string",
      "version": number,
      "updatedAt": "string"
    }
  ],
  "totalUpdated": number,
  "totalFailed": number
}
\`\`\`

---

### 3. Get Node Configuration History

**Endpoint:** `GET /api/v2/flow/nodes/:nodeId/history`

**Description:** Retrieves the modification history for a specific node.

**Query Parameters:**
- `limit` (number, optional): Maximum number of history entries to return (default: 50)
- `offset` (number, optional): Pagination offset (default: 0)

**Response (200 OK):**
\`\`\`typescript
{
  "nodeId": "string",
  "history": [
    {
      "version": number,
      "title": "string",
      "aitNumber": "string",
      "averageThruputTime30": number | null,
      "position": { "x": number, "y": number },
      "metadata": { [key: string]: any },
      "updatedBy": "string",
      "updatedAt": "string",
      "changes": {
        "field": "title",
        "oldValue": "Old Title",
        "newValue": "New Title"
      }[]
    }
  ],
  "total": number,
  "limit": number,
  "offset": number
}
\`\`\`

---

## Database Schema

### Table: `flow_node_configurations`

\`\`\`sql
CREATE TABLE flow_node_configurations (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  ait_number VARCHAR(50) NOT NULL,
  average_thruput_time_30 DECIMAL(10, 2),
  current_thruput_time_30 DECIMAL(10, 2),
  position_x DECIMAL(10, 2),
  position_y DECIMAL(10, 2),
  metadata JSONB,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_by VARCHAR(255),
  
  INDEX idx_ait_number (ait_number),
  INDEX idx_updated_at (updated_at)
);
\`\`\`

### Table: `flow_node_configuration_history`

\`\`\`sql
CREATE TABLE flow_node_configuration_history (
  history_id SERIAL PRIMARY KEY,
  node_id VARCHAR(255) NOT NULL,
  version INTEGER NOT NULL,
  title VARCHAR(100) NOT NULL,
  ait_number VARCHAR(50) NOT NULL,
  average_thruput_time_30 DECIMAL(10, 2),
  current_thruput_time_30 DECIMAL(10, 2),
  position_x DECIMAL(10, 2),
  position_y DECIMAL(10, 2),
  metadata JSONB,
  updated_by VARCHAR(255),
  updated_at TIMESTAMP NOT NULL,
  change_summary JSONB,
  
  FOREIGN KEY (node_id) REFERENCES flow_node_configurations(id) ON DELETE CASCADE,
  INDEX idx_node_version (node_id, version),
  INDEX idx_updated_at (updated_at)
);
\`\`\`

---

## Backend Implementation Guidelines

### 1. Data Validation

**Required Validations:**
- `title`: Required, non-empty, max 100 characters, trim whitespace
- `aitNumber`: Required, non-empty, max 50 characters, alphanumeric with hyphens
- `averageThruputTime30`: If provided, must be >= 0
- `currentThruputTime30`: If provided, must be >= 0
- `position.x` and `position.y`: If provided, must be valid numbers
- `metadata`: If provided, must be valid JSON object

**Example Validation (Node.js/TypeScript):**
\`\`\`typescript
import Joi from 'joi';

const nodeConfigSchema = Joi.object({
  nodeId: Joi.string().required(),
  title: Joi.string().trim().min(1).max(100).required(),
  aitNumber: Joi.string().trim().pattern(/^[A-Z0-9-]+$/).max(50).required(),
  averageThruputTime30: Joi.number().min(0).allow(null).optional(),
  currentThruputTime30: Joi.number().min(0).allow(null).optional(),
  position: Joi.object({
    x: Joi.number().required(),
    y: Joi.number().required()
  }).optional(),
  metadata: Joi.object().optional(),
  updatedBy: Joi.string().optional(),
  timestamp: Joi.string().isoDate().required()
});
\`\`\`

### 2. Security Considerations

**Input Sanitization:**
\`\`\`typescript
import DOMPurify from 'isomorphic-dompurify';

function sanitizeInput(data: any): any {
  if (typeof data === 'string') {
    return DOMPurify.sanitize(data, { ALLOWED_TAGS: [] });
  }
  if (typeof data === 'object' && data !== null) {
    return Object.keys(data).reduce((acc, key) => {
      acc[key] = sanitizeInput(data[key]);
      return acc;
    }, {} as any);
  }
  return data;
}
\`\`\`

**SQL Injection Prevention:**
- Use parameterized queries or ORM (e.g., Prisma, TypeORM)
- Never concatenate user input into SQL strings

**Example (Prisma):**
\`\`\`typescript
await prisma.flowNodeConfiguration.update({
  where: { id: nodeId },
  data: {
    title: sanitizedTitle,
    aitNumber: sanitizedAitNumber,
    // ... other fields
  }
});
\`\`\`

**Authorization:**
- Verify user has permission to modify nodes
- Implement role-based access control (RBAC)
- Log all modification attempts

### 3. Optimistic Locking

Implement version-based optimistic locking to prevent concurrent modification conflicts:

\`\`\`typescript
async function updateNodeWithVersionCheck(
  nodeId: string,
  updates: Partial<NodeConfig>,
  expectedVersion: number
): Promise<NodeConfig> {
  const result = await prisma.flowNodeConfiguration.updateMany({
    where: {
      id: nodeId,
      version: expectedVersion
    },
    data: {
      ...updates,
      version: { increment: 1 },
      updatedAt: new Date()
    }
  });

  if (result.count === 0) {
    throw new VersionConflictError('Node has been modified by another user');
  }

  return await prisma.flowNodeConfiguration.findUnique({
    where: { id: nodeId }
  });
}
\`\`\`

### 4. Audit Trail

Create audit trail entries for all modifications:

\`\`\`typescript
async function createAuditEntry(
  nodeId: string,
  oldData: NodeConfig,
  newData: NodeConfig,
  userId: string
): Promise<void> {
  const changes = computeChanges(oldData, newData);
  
  await prisma.flowNodeConfigurationHistory.create({
    data: {
      nodeId,
      version: newData.version,
      title: newData.title,
      aitNumber: newData.aitNumber,
      // ... other fields
      updatedBy: userId,
      updatedAt: new Date(),
      changeSummary: changes
    }
  });
}

function computeChanges(oldData: any, newData: any): any[] {
  const changes: any[] = [];
  
  for (const key of Object.keys(newData)) {
    if (oldData[key] !== newData[key]) {
      changes.push({
        field: key,
        oldValue: oldData[key],
        newValue: newData[key]
      });
    }
  }
  
  return changes;
}
\`\`\`

### 5. Transaction Management

Use database transactions for batch updates:

\`\`\`typescript
async function batchUpdateNodes(
  updates: NodeUpdateRequest[]
): Promise<BatchUpdateResponse> {
  return await prisma.$transaction(async (tx) => {
    const results = [];
    
    for (const update of updates) {
      try {
        const result = await tx.flowNodeConfiguration.update({
          where: { id: update.nodeId },
          data: {
            title: update.title,
            aitNumber: update.aitNumber,
            // ... other fields
            version: { increment: 1 }
          }
        });
        
        results.push({
          success: true,
          nodeId: result.id,
          version: result.version,
          updatedAt: result.updatedAt
        });
      } catch (error) {
        results.push({
          success: false,
          nodeId: update.nodeId,
          error: error.message
        });
      }
    }
    
    return {
      success: true,
      results,
      totalUpdated: results.filter(r => r.success).length,
      totalFailed: results.filter(r => !r.success).length
    };
  });
}
\`\`\`

### 6. Error Handling

Implement comprehensive error handling:

\`\`\`typescript
class NodeConfigurationError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public details?: any
  ) {
    super(message);
    this.name = 'NodeConfigurationError';
  }
}

async function handleNodeUpdate(req, res) {
  try {
    const result = await updateNodeConfiguration(req.body);
    res.status(200).json(result);
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).json({
        error: 'ValidationError',
        message: error.message,
        statusCode: 400,
        details: error.details
      });
    } else if (error instanceof VersionConflictError) {
      res.status(409).json({
        error: 'VersionConflict',
        message: error.message,
        statusCode: 409
      });
    } else {
      console.error('Unexpected error:', error);
      res.status(500).json({
        error: 'InternalServerError',
        message: 'An unexpected error occurred',
        statusCode: 500
      });
    }
  }
}
\`\`\`

---

## Data Flow Diagram

\`\`\`
┌─────────────────┐
│   React Flow    │
│   Component     │
└────────┬────────┘
         │ User edits node
         ▼
┌─────────────────┐
│  NodeEditDialog │
│   (UI Layer)    │
└────────┬────────┘
         │ Form submission
         ▼
┌─────────────────┐
│useNodeConfig    │
│  (State Mgmt)   │
└────────┬────────┘
         │ Optimistic update
         ▼
┌─────────────────┐
│ API Client      │
│ (HTTP Layer)    │
└────────┬────────┘
         │ PUT /api/v2/flow/nodes/:id
         ▼
┌─────────────────┐
│ Backend API     │
│ (Validation)    │
└────────┬────────┘
         │ Sanitize & validate
         ▼
┌─────────────────┐
│ Database Layer  │
│ (Persistence)   │
└────────┬────────┘
         │ Transaction commit
         ▼
┌─────────────────┐
│ Audit Trail     │
│ (History Log)   │
└─────────────────┘
\`\`\`

---

## Testing Recommendations

### Unit Tests
- Validate input sanitization
- Test version conflict detection
- Verify audit trail creation

### Integration Tests
- Test full update flow from API to database
- Verify transaction rollback on errors
- Test concurrent update scenarios

### Security Tests
- SQL injection attempts
- XSS payload injection
- Authorization bypass attempts

---

## Performance Considerations

1. **Database Indexing:** Ensure indexes on `ait_number` and `updated_at` columns
2. **Caching:** Consider caching frequently accessed node configurations
3. **Batch Operations:** Use batch updates for multiple nodes to reduce round trips
4. **Connection Pooling:** Configure appropriate database connection pool size

---

## Monitoring and Logging

Log the following events:
- All node configuration updates (success and failure)
- Version conflicts
- Authorization failures
- Performance metrics (response times)

Example log entry:
\`\`\`json
{
  "timestamp": "2025-01-23T10:30:00Z",
  "event": "node_configuration_updated",
  "nodeId": "node-001",
  "userId": "user-123",
  "changes": ["title", "position"],
  "duration_ms": 45,
  "success": true
}
