import type { NodeEditData } from "../components/flow/nodes/custom-nodes-us-wires/components/NodeEditDialog"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api/v2"

/**
 * Request payload for updating node configuration
 */
export interface UpdateNodeConfigRequest {
  nodeId: string
  title: string
  aitNumber: string
  averageThruputTime30?: number
  currentThruputTime30?: number
  position?: {
    x: number
    y: number
  }
  metadata?: Record<string, any>
  updatedBy?: string
  timestamp: string
}

/**
 * Response from node configuration update
 */
export interface UpdateNodeConfigResponse {
  success: boolean
  nodeId: string
  version: number
  updatedAt: string
  message?: string
}

/**
 * Error response structure
 */
export interface ApiErrorResponse {
  error: string
  message: string
  statusCode: number
  details?: Record<string, any>
}

/**
 * Update a node's configuration in the database
 *
 * @param nodeData - The node data to update
 * @returns Promise with the update response
 * @throws Error if the API request fails
 */
export async function updateNodeConfiguration(nodeData: NodeEditData): Promise<UpdateNodeConfigResponse> {
  console.log("[v0] API: Updating node configuration", nodeData)

  const payload: UpdateNodeConfigRequest = {
    nodeId: nodeData.id,
    title: nodeData.title.trim(),
    aitNumber: nodeData.subtext.trim(),
    averageThruputTime30: nodeData.averageThruputTime30,
    currentThruputTime30: nodeData.currentThruputTime30,
    position: nodeData.position,
    metadata: nodeData.metadata,
    timestamp: new Date().toISOString(),
  }

  if (!payload.title || payload.title.length === 0) {
    throw new Error("Node title is required")
  }

  if (!payload.aitNumber || payload.aitNumber.length === 0) {
    throw new Error("AIT number is required")
  }

  try {
    const response = await fetch(`${API_BASE_URL}/flow/nodes/${nodeData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        // Add authentication headers if needed
        // "Authorization": `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify(payload),
    })

    console.log("[v0] API: Response status", response.status)

    if (!response.ok) {
      const errorData: ApiErrorResponse = await response.json()
      console.error("[v0] API: Error response", errorData)
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
    }

    const data: UpdateNodeConfigResponse = await response.json()
    console.log("[v0] API: Update successful", data)

    return data
  } catch (error) {
    console.error("[v0] API: Request failed", error)

    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error("Network error: Unable to reach the server")
    }

    throw error
  }
}

/**
 * Batch update multiple nodes
 *
 * @param nodes - Array of node data to update
 * @returns Promise with array of update responses
 */
export async function batchUpdateNodeConfigurations(nodes: NodeEditData[]): Promise<UpdateNodeConfigResponse[]> {
  console.log("[v0] API: Batch updating nodes", nodes.length)

  const payload = {
    nodes: nodes.map((node) => ({
      nodeId: node.id,
      title: node.title.trim(),
      aitNumber: node.subtext.trim(),
      averageThruputTime30: node.averageThruputTime30,
      currentThruputTime30: node.currentThruputTime30,
      position: node.position,
      metadata: node.metadata,
    })),
    timestamp: new Date().toISOString(),
  }

  try {
    const response = await fetch(`${API_BASE_URL}/flow/nodes/batch`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorData: ApiErrorResponse = await response.json()
      throw new Error(errorData.message || `HTTP ${response.status}`)
    }

    const data: { results: UpdateNodeConfigResponse[] } = await response.json()
    return data.results
  } catch (error) {
    console.error("[v0] API: Batch update failed", error)
    throw error
  }
}

/**
 * Get node configuration history
 *
 * @param nodeId - The node ID to get history for
 * @returns Promise with array of historical configurations
 */
export async function getNodeConfigurationHistory(nodeId: string) {
  console.log("[v0] API: Fetching node history", nodeId)

  try {
    const response = await fetch(`${API_BASE_URL}/flow/nodes/${nodeId}/history`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("[v0] API: Failed to fetch history", error)
    throw error
  }
}
