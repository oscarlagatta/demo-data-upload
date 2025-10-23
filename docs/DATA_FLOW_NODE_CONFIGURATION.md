# Node Configuration Data Flow Documentation

## Overview

This document provides a comprehensive guide to the data flow for node configuration updates in the Payment Health Dashboard. It covers the complete journey from user interaction in the UI through API communication to database persistence, with emphasis on data integrity, synchronization, and security.

---

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Data Flow Sequence](#data-flow-sequence)
3. [Frontend Implementation](#frontend-implementation)
4. [Backend Implementation](#backend-implementation)
5. [Database Schema](#database-schema)
6. [Validation & Security](#validation--security)
7. [Error Handling](#error-handling)
8. [Synchronization Strategy](#synchronization-strategy)
9. [Testing Guidelines](#testing-guidelines)

---

## 1. System Architecture

### Component Overview

\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ Flow Diagram │  │ Node Actions │  │ Edit Dialog  │         │
│  │  Component   │→ │    Menu      │→ │  (Form)      │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      STATE MANAGEMENT                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   React      │  │  Optimistic  │  │   Pending    │         │
│  │   State      │  │   Updates    │  │   Changes    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                       API LAYER                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   HTTP       │  │  Request     │  │  Response    │         │
│  │   Client     │→ │  Validation  │→ │  Handling    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND API                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Route      │  │  Business    │  │  Data        │         │
│  │   Handler    │→ │  Logic       │→ │  Access      │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                       DATABASE                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Nodes      │  │   Audit      │  │   Versions   │         │
│  │   Table      │  │   Log        │  │   History    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
\`\`\`

---

## 2. Data Flow Sequence

### 2.1 Single Node Update Flow

\`\`\`
User                Frontend              API Layer           Backend              Database
 │                     │                     │                   │                    │
 │  Click Edit        │                     │                   │                    │
 ├───────────────────>│                     │                   │                    │
 │                     │                     │                   │                    │
 │  Open Dialog       │                     │                   │                    │
 │<───────────────────┤                     │                   │                    │
 │                     │                     │                   │                    │
 │  Fill Form         │                     │                   │                    │
 ├───────────────────>│                     │                   │                    │
 │                     │                     │                   │                    │
 │  Click Save        │                     │                   │                    │
 ├───────────────────>│                     │                   │                    │
 │                     │                     │                   │                    │
 │                     │  Validate Form     │                   │                    │
 │                     ├────────────────────┤                   │                    │
 │                     │                     │                   │                    │
 │                     │  Optimistic Update │                   │                    │
 │                     │  (Update UI)       │                   │                    │
 │                     ├────────────────────┤                   │                    │
 │                     │                     │                   │                    │
 │                     │  POST /api/nodes/:id                   │                    │
 │                     ├────────────────────>│                   │                    │
 │                     │                     │                   │                    │
 │                     │                     │  Authenticate     │                    │
 │                     │                     ├──────────────────>│                    │
 │                     │                     │                   │                    │
 │                     │                     │  Validate Payload │                    │
 │                     │                     ├──────────────────>│                    │
 │                     │                     │                   │                    │
 │                     │                     │  Check Version    │                    │
 │                     │                     ├──────────────────>│                    │
 │                     │                     │                   │                    │
 │                     │                     │                   │  SELECT version   │
 │                     │                     │                   ├──────────────────>│
 │                     │                     │                   │                    │
 │                     │                     │                   │  Return version   │
 │                     │                     │                   │<──────────────────┤
 │                     │                     │                   │                    │
 │                     │                     │  Version Match?   │                    │
 │                     │                     ├──────────────────>│                    │
 │                     │                     │                   │                    │
 │                     │                     │  Sanitize Input   │                    │
 │                     │                     ├──────────────────>│                    │
 │                     │                     │                   │                    │
 │                     │                     │                   │  BEGIN TRANSACTION│
 │                     │                     │                   ├──────────────────>│
 │                     │                     │                   │                    │
 │                     │                     │                   │  UPDATE node      │
 │                     │                     │                   ├──────────────────>│
 │                     │                     │                   │                    │
 │                     │                     │                   │  INSERT audit_log │
 │                     │                     │                   ├──────────────────>│
 │                     │                     │                   │                    │
 │                     │                     │                   │  COMMIT           │
 │                     │                     │                   ├──────────────────>│
 │                     │                     │                   │                    │
 │                     │                     │  Return Success   │                    │
 │                     │                     │<──────────────────┤                    │
 │                     │                     │                   │                    │
 │                     │  200 OK + Updated Node                  │                    │
 │                     │<────────────────────┤                   │                    │
 │                     │                     │                   │                    │
 │                     │  Update State       │                   │                    │
 │                     │  (Confirm Update)   │                   │                    │
 │                     ├────────────────────┤                   │                    │
 │                     │                     │                   │                    │
 │  Show Success      │                     │                   │                    │
 │<───────────────────┤                     │                   │                    │
\`\`\`

### 2.2 Batch Update Flow

\`\`\`
User                Frontend              API Layer           Backend              Database
 │                     │                     │                   │                    │
 │  Select Multiple   │                     │                   │                    │
 │  Nodes             │                     │                   │                    │
 ├───────────────────>│                     │                   │                    │
 │                     │                     │                   │                    │
 │  Bulk Edit         │                     │                   │                    │
 ├───────────────────>│                     │                   │                    │
 │                     │                     │                   │                    │
 │  Click Save All    │                     │                   │                    │
 ├───────────────────>│                     │                   │                    │
 │                     │                     │                   │                    │
 │                     │  Optimistic Update │                   │                    │
 │                     │  (Update All UI)   │                   │                    │
 │                     ├────────────────────┤                   │                    │
 │                     │                     │                   │                    │
 │                     │  POST /api/nodes/batch                 │                    │
 │                     ├────────────────────>│                   │                    │
 │                     │                     │                   │                    │
 │                     │                     │  Authenticate     │                    │
 │                     │                     ├──────────────────>│                    │
 │                     │                     │                   │                    │
 │                     │                     │  Validate All     │                    │
 │                     │                     ├──────────────────>│                    │
 │                     │                     │                   │                    │
 │                     │                     │                   │  BEGIN TRANSACTION│
 │                     │                     │                   ├──────────────────>│
 │                     │                     │                   │                    │
 │                     │                     │  For Each Node:   │                    │
 │                     │                     │  - Check Version  │                    │
 │                     │                     │  - Sanitize       │                    │
 │                     │                     │  - Update         │                    │
 │                     │                     │  - Audit Log      │                    │
 │                     │                     ├──────────────────>│                    │
 │                     │                     │                   │                    │
 │                     │                     │                   │  COMMIT           │
 │                     │                     │                   ├──────────────────>│
 │                     │                     │                   │                    │
 │                     │  200 OK + All Updated Nodes             │                    │
 │                     │<────────────────────┤                   │                    │
 │                     │                     │                   │                    │
 │  Show Success      │                     │                   │                    │
 │<───────────────────┤                     │                   │                    │
\`\`\`

---

## 3. Frontend Implementation

### 3.1 Component Structure

#### NodeEditDialog Component
\`\`\`typescript
// Responsibilities:
// 1. Render form with current node data
// 2. Validate user input
// 3. Handle form submission
// 4. Display loading/error states

const NodeEditDialog = ({ node, onSave, onClose }) => {
  // Form state management
  const [formData, setFormData] = useState(node.data);
  const [errors, setErrors] = useState({});
  
  // Validation
  const validateForm = () => {
    // Client-side validation logic
  };
  
  // Submit handler
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      // Handle error
    }
  };
};
\`\`\`

### 3.2 State Management Hook

\`\`\`typescript
// useNodeConfiguration Hook
// Responsibilities:
// 1. Manage node state
// 2. Handle optimistic updates
// 3. Track pending changes
// 4. Sync with backend

const useNodeConfiguration = () => {
  const [nodes, setNodes] = useState([]);
  const [pendingChanges, setPendingChanges] = useState(new Map());
  
  // Optimistic update
  const updateNode = async (nodeId, updates) => {
    // 1. Store original state
    const originalNode = nodes.find(n => n.id === nodeId);
    
    // 2. Apply optimistic update
    setNodes(prev => prev.map(n => 
      n.id === nodeId ? { ...n, data: { ...n.data, ...updates } } : n
    ));
    
    // 3. Mark as pending
    setPendingChanges(prev => new Map(prev).set(nodeId, originalNode));
    
    try {
      // 4. Send to backend
      const updated = await nodeConfigurationApi.updateNode(nodeId, {
        ...updates,
        version: originalNode.data.version
      });
      
      // 5. Confirm update with server data
      setNodes(prev => prev.map(n => 
        n.id === nodeId ? updated : n
      ));
      
      // 6. Remove from pending
      setPendingChanges(prev => {
        const next = new Map(prev);
        next.delete(nodeId);
        return next;
      });
      
      return updated;
    } catch (error) {
      // 7. Rollback on error
      setNodes(prev => prev.map(n => 
        n.id === nodeId ? originalNode : n
      ));
      
      setPendingChanges(prev => {
        const next = new Map(prev);
        next.delete(nodeId);
        return next;
      });
      
      throw error;
    }
  };
  
  return { nodes, updateNode, pendingChanges };
};
\`\`\`

### 3.3 API Client

\`\`\`typescript
// node-configuration-api.ts
// Responsibilities:
// 1. Make HTTP requests
// 2. Handle request/response formatting
// 3. Manage authentication headers
// 4. Handle network errors

export const nodeConfigurationApi = {
  updateNode: async (nodeId: string, updates: NodeUpdate) => {
    const response = await fetch(`/api/nodes/${nodeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(updates)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new ApiError(error.message, error.code);
    }
    
    return response.json();
  }
};
\`\`\`

---

## 4. Backend Implementation

### 4.1 API Route Handler (Next.js App Router)

\`\`\`typescript
// app/api/nodes/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { db } from '@/lib/database';
import { sanitizeHtml } from '@/lib/security';

// Validation schema
const NodeUpdateSchema = z.object({
  label: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  metrics: z.object({
    totalTransactions: z.number().int().min(0).optional(),
    successRate: z.number().min(0).max(100).optional(),
    avgProcessingTime: z.number().min(0).optional(),
  }).optional(),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }).optional(),
  version: z.number().int().min(0),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. AUTHENTICATION
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized', code: 'AUTH_REQUIRED' },
        { status: 401 }
      );
    }

    // 2. AUTHORIZATION
    const hasPermission = await checkUserPermission(
      session.user.id,
      'nodes:update'
    );
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Forbidden', code: 'INSUFFICIENT_PERMISSIONS' },
        { status: 403 }
      );
    }

    // 3. PARSE & VALIDATE REQUEST BODY
    const body = await request.json();
    const validationResult = NodeUpdateSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: validationResult.error.errors
        },
        { status: 400 }
      );
    }

    const updates = validationResult.data;
    const nodeId = params.id;

    // 4. SANITIZE INPUT
    const sanitizedUpdates = {
      ...updates,
      label: sanitizeHtml(updates.label),
      description: updates.description 
        ? sanitizeHtml(updates.description) 
        : undefined,
    };

    // 5. DATABASE TRANSACTION
    const result = await db.transaction(async (tx) => {
      // 5a. Check if node exists
      const existingNode = await tx
        .select()
        .from('nodes')
        .where('id', nodeId)
        .first();

      if (!existingNode) {
        throw new Error('Node not found');
      }

      // 5b. OPTIMISTIC LOCKING - Check version
      if (existingNode.version !== updates.version) {
        throw new Error('Version conflict - node was modified by another user');
      }

      // 5c. Update node
      const updatedNode = await tx
        .update('nodes')
        .set({
          ...sanitizedUpdates,
          version: existingNode.version + 1,
          updated_at: new Date(),
          updated_by: session.user.id,
        })
        .where('id', nodeId)
        .returning();

      // 5d. Create audit log entry
      await tx.insert('audit_logs').values({
        id: generateId(),
        entity_type: 'node',
        entity_id: nodeId,
        action: 'update',
        user_id: session.user.id,
        changes: JSON.stringify({
          before: existingNode,
          after: updatedNode[0],
        }),
        timestamp: new Date(),
        ip_address: request.headers.get('x-forwarded-for') || 'unknown',
        user_agent: request.headers.get('user-agent') || 'unknown',
      });

      return updatedNode[0];
    });

    // 6. RETURN SUCCESS RESPONSE
    return NextResponse.json({
      success: true,
      data: result,
    });

  } catch (error) {
    // 7. ERROR HANDLING
    console.error('[API] Node update error:', error);

    if (error.message === 'Node not found') {
      return NextResponse.json(
        { error: 'Node not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    if (error.message.includes('Version conflict')) {
      return NextResponse.json(
        { error: error.message, code: 'VERSION_CONFLICT' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
\`\`\`

### 4.2 Batch Update Handler

\`\`\`typescript
// app/api/nodes/batch/route.ts

export async function POST(request: NextRequest) {
  try {
    // 1. Authentication & Authorization
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse request
    const { updates } = await request.json();
    
    if (!Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request - updates must be a non-empty array' },
        { status: 400 }
      );
    }

    // 3. Validate all updates
    const validatedUpdates = [];
    for (const update of updates) {
      const result = NodeUpdateSchema.safeParse(update);
      if (!result.success) {
        return NextResponse.json(
          {
            error: `Validation failed for node ${update.id}`,
            details: result.error.errors
          },
          { status: 400 }
        );
      }
      validatedUpdates.push(result.data);
    }

    // 4. Execute batch update in transaction
    const results = await db.transaction(async (tx) => {
      const updatedNodes = [];

      for (const update of validatedUpdates) {
        // Check version
        const existing = await tx
          .select()
          .from('nodes')
          .where('id', update.id)
          .first();

        if (!existing) {
          throw new Error(`Node ${update.id} not found`);
        }

        if (existing.version !== update.version) {
          throw new Error(`Version conflict for node ${update.id}`);
        }

        // Sanitize
        const sanitized = {
          ...update,
          label: sanitizeHtml(update.label),
          description: update.description 
            ? sanitizeHtml(update.description) 
            : undefined,
        };

        // Update
        const updated = await tx
          .update('nodes')
          .set({
            ...sanitized,
            version: existing.version + 1,
            updated_at: new Date(),
            updated_by: session.user.id,
          })
          .where('id', update.id)
          .returning();

        // Audit log
        await tx.insert('audit_logs').values({
          id: generateId(),
          entity_type: 'node',
          entity_id: update.id,
          action: 'batch_update',
          user_id: session.user.id,
          changes: JSON.stringify({
            before: existing,
            after: updated[0],
          }),
          timestamp: new Date(),
        });

        updatedNodes.push(updated[0]);
      }

      return updatedNodes;
    });

    return NextResponse.json({
      success: true,
      data: results,
    });

  } catch (error) {
    console.error('[API] Batch update error:', error);
    
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
\`\`\`

---

## 5. Database Schema

### 5.1 Nodes Table

\`\`\`sql
CREATE TABLE nodes (
  -- Primary Key
  id VARCHAR(50) PRIMARY KEY,
  
  -- Node Configuration
  label VARCHAR(100) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL,
  
  -- Position
  position_x DECIMAL(10, 2) NOT NULL,
  position_y DECIMAL(10, 2) NOT NULL,
  
  -- Metrics (stored as JSONB for flexibility)
  metrics JSONB DEFAULT '{}',
  
  -- Versioning (for optimistic locking)
  version INTEGER NOT NULL DEFAULT 0,
  
  -- Audit Fields
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(50) NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_by VARCHAR(50) NOT NULL,
  
  -- Soft Delete
  deleted_at TIMESTAMP NULL,
  
  -- Indexes
  INDEX idx_nodes_type (type),
  INDEX idx_nodes_updated_at (updated_at),
  INDEX idx_nodes_deleted_at (deleted_at)
);
\`\`\`

### 5.2 Audit Logs Table

\`\`\`sql
CREATE TABLE audit_logs (
  -- Primary Key
  id VARCHAR(50) PRIMARY KEY,
  
  -- Entity Information
  entity_type VARCHAR(50) NOT NULL,
  entity_id VARCHAR(50) NOT NULL,
  
  -- Action
  action VARCHAR(50) NOT NULL, -- 'create', 'update', 'delete', 'batch_update'
  
  -- User Information
  user_id VARCHAR(50) NOT NULL,
  user_email VARCHAR(255),
  
  -- Changes (stored as JSONB)
  changes JSONB NOT NULL,
  
  -- Request Metadata
  ip_address VARCHAR(45),
  user_agent TEXT,
  
  -- Timestamp
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  -- Indexes
  INDEX idx_audit_entity (entity_type, entity_id),
  INDEX idx_audit_user (user_id),
  INDEX idx_audit_timestamp (timestamp),
  INDEX idx_audit_action (action)
);
\`\`\`

### 5.3 Node Versions Table (Optional - for full history)

\`\`\`sql
CREATE TABLE node_versions (
  -- Primary Key
  id VARCHAR(50) PRIMARY KEY,
  
  -- Reference to node
  node_id VARCHAR(50) NOT NULL,
  
  -- Version number
  version INTEGER NOT NULL,
  
  -- Full snapshot of node data
  data JSONB NOT NULL,
  
  -- Audit
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(50) NOT NULL,
  
  -- Indexes
  INDEX idx_node_versions_node_id (node_id),
  INDEX idx_node_versions_version (node_id, version),
  
  -- Foreign Key
  FOREIGN KEY (node_id) REFERENCES nodes(id) ON DELETE CASCADE,
  
  -- Unique constraint
  UNIQUE (node_id, version)
);
\`\`\`

---

## 6. Validation & Security

### 6.1 Input Validation

#### Frontend Validation
\`\`\`typescript
const validateNodeUpdate = (data: NodeUpdate): ValidationResult => {
  const errors: Record<string, string> = {};
  
  // Label validation
  if (!data.label || data.label.trim().length === 0) {
    errors.label = 'Label is required';
  } else if (data.label.length > 100) {
    errors.label = 'Label must be 100 characters or less';
  }
  
  // Description validation
  if (data.description && data.description.length > 500) {
    errors.description = 'Description must be 500 characters or less';
  }
  
  // Metrics validation
  if (data.metrics) {
    if (data.metrics.successRate !== undefined) {
      if (data.metrics.successRate < 0 || data.metrics.successRate > 100) {
        errors.successRate = 'Success rate must be between 0 and 100';
      }
    }
    
    if (data.metrics.totalTransactions !== undefined) {
      if (data.metrics.totalTransactions < 0) {
        errors.totalTransactions = 'Total transactions cannot be negative';
      }
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
\`\`\`

#### Backend Validation
\`\`\`typescript
import { z } from 'zod';

// Comprehensive validation schema
const NodeUpdateSchema = z.object({
  label: z.string()
    .min(1, 'Label is required')
    .max(100, 'Label must be 100 characters or less')
    .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Label contains invalid characters'),
    
  description: z.string()
    .max(500, 'Description must be 500 characters or less')
    .optional(),
    
  metrics: z.object({
    totalTransactions: z.number()
      .int('Total transactions must be an integer')
      .min(0, 'Total transactions cannot be negative')
      .optional(),
      
    successRate: z.number()
      .min(0, 'Success rate must be at least 0')
      .max(100, 'Success rate cannot exceed 100')
      .optional(),
      
    avgProcessingTime: z.number()
      .min(0, 'Processing time cannot be negative')
      .optional(),
  }).optional(),
  
  position: z.object({
    x: z.number(),
    y: z.number(),
  }).optional(),
  
  version: z.number()
    .int('Version must be an integer')
    .min(0, 'Version cannot be negative'),
});
\`\`\`

### 6.2 Input Sanitization

\`\`\`typescript
import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize HTML to prevent XSS attacks
 */
export function sanitizeHtml(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // No HTML tags allowed
    ALLOWED_ATTR: [],
  });
}

/**
 * Sanitize SQL input (use parameterized queries instead)
 */
export function sanitizeSql(input: string): string {
  // This is a backup - always use parameterized queries
  return input.replace(/['";\\]/g, '');
}

/**
 * Sanitize JSON input
 */
export function sanitizeJson(input: any): any {
  const str = JSON.stringify(input);
  // Remove any potential script tags or dangerous content
  const sanitized = str.replace(/<script[^>]*>.*?<\/script>/gi, '');
  return JSON.parse(sanitized);
}
\`\`\`

### 6.3 Authentication & Authorization

\`\`\`typescript
/**
 * Check if user has permission to update nodes
 */
async function checkUserPermission(
  userId: string,
  permission: string
): Promise<boolean> {
  const user = await db
    .select()
    .from('users')
    .where('id', userId)
    .first();
    
  if (!user) return false;
  
  // Check role-based permissions
  const role = await db
    .select()
    .from('roles')
    .where('id', user.role_id)
    .first();
    
  if (!role) return false;
  
  // Check if role has the required permission
  const hasPermission = await db
    .select()
    .from('role_permissions')
    .where('role_id', role.id)
    .where('permission', permission)
    .first();
    
  return !!hasPermission;
}
\`\`\`

### 6.4 Rate Limiting

\`\`\`typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 requests per 10 seconds
});

export async function checkRateLimit(userId: string): Promise<boolean> {
  const { success } = await ratelimit.limit(userId);
  return success;
}

// Usage in API route
export async function PUT(request: NextRequest) {
  const session = await getServerSession();
  
  const allowed = await checkRateLimit(session.user.id);
  if (!allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    );
  }
  
  // Continue with request handling...
}
\`\`\`

---

## 7. Error Handling

### 7.1 Error Types

\`\`\`typescript
export class ApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', 400, details);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends ApiError {
  constructor(message: string = 'Authentication required') {
    super(message, 'AUTH_REQUIRED', 401);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends ApiError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 'INSUFFICIENT_PERMISSIONS', 403);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = 'Resource not found') {
    super(message, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends ApiError {
  constructor(message: string = 'Resource conflict') {
    super(message, 'CONFLICT', 409);
    this.name = 'ConflictError';
  }
}
\`\`\`

### 7.2 Frontend Error Handling

\`\`\`typescript
const handleNodeUpdate = async (nodeId: string, updates: NodeUpdate) => {
  try {
    const result = await nodeConfigurationApi.updateNode(nodeId, updates);
    
    // Success
    toast.success('Node updated successfully');
    return result;
    
  } catch (error) {
    if (error instanceof ApiError) {
      switch (error.code) {
        case 'VERSION_CONFLICT':
          // Handle version conflict
          toast.error('This node was modified by another user. Please refresh and try again.');
          // Optionally: fetch latest version and show merge UI
          break;
          
        case 'VALIDATION_ERROR':
          // Handle validation errors
          toast.error('Invalid input: ' + error.message);
          // Show field-specific errors
          break;
          
        case 'AUTH_REQUIRED':
          // Handle authentication error
          toast.error('Please log in to continue');
          router.push('/login');
          break;
          
        case 'INSUFFICIENT_PERMISSIONS':
          // Handle authorization error
          toast.error('You do not have permission to edit nodes');
          break;
          
        case 'NOT_FOUND':
          // Handle not found
          toast.error('Node not found');
          break;
          
        default:
          toast.error('An error occurred: ' + error.message);
      }
    } else {
      // Network or unknown error
      toast.error('Network error. Please check your connection and try again.');
    }
    
    throw error;
  }
};
\`\`\`

### 7.3 Backend Error Handling

\`\`\`typescript
export async function PUT(request: NextRequest) {
  try {
    // ... request handling ...
    
  } catch (error) {
    console.error('[API] Error:', error);
    
    // Log error for monitoring
    await logError({
      error,
      request: {
        url: request.url,
        method: request.method,
        headers: Object.fromEntries(request.headers),
      },
      user: session?.user,
    });
    
    // Return appropriate error response
    if (error instanceof ValidationError) {
      return NextResponse.json(
        {
          error: error.message,
          code: error.code,
          details: error.details,
        },
        { status: error.statusCode }
      );
    }
    
    if (error instanceof AuthenticationError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 401 }
      );
    }
    
    if (error instanceof AuthorizationError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 403 }
      );
    }
    
    if (error instanceof NotFoundError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 404 }
      );
    }
    
    if (error instanceof ConflictError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 409 }
      );
    }
    
    // Generic error
    return NextResponse.json(
      {
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    );
  }
}
\`\`\`

---

## 8. Synchronization Strategy

### 8.1 Optimistic Locking

\`\`\`typescript
/**
 * Optimistic locking prevents lost updates when multiple users
 * edit the same node simultaneously.
 */

// Frontend: Include version in update request
const updateNode = async (nodeId: string, updates: Partial<NodeData>) => {
  const currentNode = nodes.find(n => n.id === nodeId);
  
  const response = await fetch(`/api/nodes/${nodeId}`, {
    method: 'PUT',
    body: JSON.stringify({
      ...updates,
      version: currentNode.data.version, // Include current version
    }),
  });
  
  if (response.status === 409) {
    // Version conflict - node was modified by another user
    throw new ConflictError('Node was modified by another user');
  }
  
  return response.json();
};

// Backend: Check version before update
const existingNode = await db.select().from('nodes').where('id', nodeId).first();

if (existingNode.version !== requestedVersion) {
  throw new ConflictError('Version mismatch - node was modified');
}

// Update with incremented version
await db.update('nodes')
  .set({
    ...updates,
    version: existingNode.version + 1,
  })
  .where('id', nodeId);
\`\`\`

### 8.2 Real-time Synchronization (Optional)

\`\`\`typescript
/**
 * Use WebSockets or Server-Sent Events for real-time updates
 */

// Frontend: Subscribe to node updates
useEffect(() => {
  const ws = new WebSocket('ws://localhost:3000/api/nodes/subscribe');
  
  ws.onmessage = (event) => {
    const update = JSON.parse(event.data);
    
    if (update.type === 'node_updated') {
      // Update local state with server data
      setNodes(prev => prev.map(n => 
        n.id === update.nodeId ? update.node : n
      ));
      
      // Show notification if another user made the change
      if (update.userId !== currentUserId) {
        toast.info(`Node "${update.node.data.label}" was updated by ${update.userName}`);
      }
    }
  };
  
  return () => ws.close();
}, []);

// Backend: Broadcast updates to all connected clients
async function broadcastNodeUpdate(nodeId: string, node: Node, userId: string) {
  const message = JSON.stringify({
    type: 'node_updated',
    nodeId,
    node,
    userId,
    userName: await getUserName(userId),
    timestamp: new Date().toISOString(),
  });
  
  // Send to all connected WebSocket clients
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}
\`\`\`

### 8.3 Conflict Resolution

\`\`\`typescript
/**
 * Handle version conflicts gracefully
 */

const handleVersionConflict = async (
  nodeId: string,
  localChanges: Partial<NodeData>,
  localVersion: number
) => {
  // 1. Fetch latest version from server
  const latestNode = await nodeConfigurationApi.getNode(nodeId);
  
  // 2. Show merge UI to user
  const resolution = await showMergeDialog({
    local: localChanges,
    remote: latestNode.data,
    localVersion,
    remoteVersion: latestNode.data.version,
  });
  
  // 3. Apply resolved changes
  if (resolution.action === 'use_remote') {
    // Discard local changes, use server version
    return latestNode;
  } else if (resolution.action === 'use_local') {
    // Retry with latest version
    return nodeConfigurationApi.updateNode(nodeId, {
      ...localChanges,
      version: latestNode.data.version,
    });
  } else if (resolution.action === 'merge') {
    // Apply merged changes
    return nodeConfigurationApi.updateNode(nodeId, {
      ...resolution.mergedData,
      version: latestNode.data.version,
    });
  }
};
\`\`\`

---

## 9. Testing Guidelines

### 9.1 Frontend Tests

\`\`\`typescript
// NodeEditDialog.test.tsx
describe('NodeEditDialog', () => {
  it('should validate form input', () => {
    const { getByLabelText, getByText } = render(
      <NodeEditDialog node={mockNode} onSave={jest.fn()} onClose={jest.fn()} />
    );
    
    const labelInput = getByLabelText('Label');
    fireEvent.change(labelInput, { target: { value: '' } });
    fireEvent.blur(labelInput);
    
    expect(getByText('Label is required')).toBeInTheDocument();
  });
  
  it('should call onSave with updated data', async () => {
    const onSave = jest.fn();
    const { getByLabelText, getByText } = render(
      <NodeEditDialog node={mockNode} onSave={onSave} onClose={jest.fn()} />
    );
    
    fireEvent.change(getByLabelText('Label'), {
      target: { value: 'Updated Label' }
    });
    
    fireEvent.click(getByText('Save'));
    
    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({ label: 'Updated Label' })
      );
    });
  });
  
  it('should handle API errors', async () => {
    const onSave = jest.fn().mockRejectedValue(
      new ApiError('Network error', 'NETWORK_ERROR')
    );
    
    const { getByText } = render(
      <NodeEditDialog node={mockNode} onSave={onSave} onClose={jest.fn()} />
    );
    
    fireEvent.click(getByText('Save'));
    
    await waitFor(() => {
      expect(getByText('Network error')).toBeInTheDocument();
    });
  });
});
\`\`\`

### 9.2 Backend Tests

\`\`\`typescript
// app/api/nodes/[id]/route.test.ts
describe('PUT /api/nodes/:id', () => {
  it('should update node successfully', async () => {
    const response = await PUT(
      new NextRequest('http://localhost/api/nodes/node-1', {
        method: 'PUT',
        body: JSON.stringify({
          label: 'Updated Label',
          version: 0,
        }),
      }),
      { params: { id: 'node-1' } }
    );
    
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.label).toBe('Updated Label');
    expect(data.data.version).toBe(1);
  });
  
  it('should return 401 for unauthenticated requests', async () => {
    // Mock unauthenticated session
    jest.spyOn(auth, 'getServerSession').mockResolvedValue(null);
    
    const response = await PUT(
      new NextRequest('http://localhost/api/nodes/node-1', {
        method: 'PUT',
        body: JSON.stringify({ label: 'Test' }),
      }),
      { params: { id: 'node-1' } }
    );
    
    expect(response.status).toBe(401);
  });
  
  it('should return 409 for version conflicts', async () => {
    const response = await PUT(
      new NextRequest('http://localhost/api/nodes/node-1', {
        method: 'PUT',
        body: JSON.stringify({
          label: 'Updated Label',
          version: 0, // Outdated version
        }),
      }),
      { params: { id: 'node-1' } }
    );
    
    expect(response.status).toBe(409);
    const data = await response.json();
    expect(data.code).toBe('VERSION_CONFLICT');
  });
  
  it('should sanitize input', async () => {
    const response = await PUT(
      new NextRequest('http://localhost/api/nodes/node-1', {
        method: 'PUT',
        body: JSON.stringify({
          label: '<script>alert("xss")</script>Test',
          version: 0,
        }),
      }),
      { params: { id: 'node-1' } }
    );
    
    const data = await response.json();
    expect(data.data.label).not.toContain('<script>');
  });
});
\`\`\`

### 9.3 Integration Tests

\`\`\`typescript
// integration/node-update-flow.test.ts
describe('Node Update Flow', () => {
  it('should complete full update flow', async () => {
    // 1. User opens edit dialog
    const { getByText, getByLabelText } = render(<FlowDiagram />);
    fireEvent.click(getByText('Edit'));
    
    // 2. User modifies node
    fireEvent.change(getByLabelText('Label'), {
      target: { value: 'New Label' }
    });
    
    // 3. User saves
    fireEvent.click(getByText('Save'));
    
    // 4. Verify optimistic update
    await waitFor(() => {
      expect(getByText('New Label')).toBeInTheDocument();
    });
    
    // 5. Verify API call
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/nodes/'),
        expect.objectContaining({ method: 'PUT' })
      );
    });
    
    // 6. Verify database update
    const node = await db.select().from('nodes').where('id', 'node-1').first();
    expect(node.label).toBe('New Label');
    expect(node.version).toBe(1);
    
    // 7. Verify audit log
    const auditLog = await db
      .select()
      .from('audit_logs')
      .where('entity_id', 'node-1')
      .orderBy('timestamp', 'desc')
      .first();
    expect(auditLog.action).toBe('update');
  });
});
\`\`\`

---

## Summary

This data flow documentation provides a complete guide for implementing node configuration updates with:

1. **Clear Architecture**: Component hierarchy and responsibilities
2. **Detailed Sequences**: Step-by-step flow diagrams
3. **Implementation Examples**: Production-ready code samples
4. **Database Design**: Optimized schema with proper indexing
5. **Security**: Input validation, sanitization, authentication, authorization
6. **Data Integrity**: Optimistic locking, transactions, audit trails
7. **Error Handling**: Comprehensive error types and recovery strategies
8. **Synchronization**: Conflict resolution and real-time updates
9. **Testing**: Unit, integration, and end-to-end test examples

Backend developers should follow this guide to implement a robust, secure, and maintainable node configuration system.
