"use client"

import { useCallback, useMemo, useState } from "react"
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  type Edge,
  type EdgeChange,
  MarkerType,
  type Node,
  type NodeChange,
  type NodeTypes,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
  ReactFlow,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import SystemArchitectureNode from "./system-architecture-node"
import { Button } from "@/components/ui/button"

const initialNodes: Node[] = [
  // External Systems - Left Side
  {
    id: "cashpro",
    type: "systemNode",
    position: { x: 50, y: 100 },
    data: {
      title: "CashPro",
      icon: "laptop",
      category: "external",
      features: [
        "Authentication",
        "Notifications",
        "Entitlements Admin",
        "Approvals",
        "Statements & Reporting",
        "Payments",
        "API Gateway",
        "Mobile",
      ],
    },
  },
  {
    id: "b2bi",
    type: "systemNode",
    position: { x: 50, y: 400 },
    data: {
      title: "B2Bi",
      icon: "network",
      category: "external",
      features: ["Authentication", "Transformation", "Routing"],
    },
  },
  {
    id: "loaniq",
    type: "systemNode",
    position: { x: 50, y: 580 },
    data: {
      title: "LoanIQ",
      icon: "database",
      category: "external",
      features: ["Syndicate Loans"],
    },
  },
  {
    id: "swift-external",
    type: "systemNode",
    position: { x: 50, y: 720 },
    data: {
      title: "SWIFT",
      icon: "globe",
      category: "external",
      features: ["SWIFT FIN Authentication"],
    },
  },

  // Top Layer - Fraud Detection
  {
    id: "gfd-pfd-top",
    type: "systemNode",
    position: { x: 350, y: 20 },
    data: {
      title: "GFD/PFD",
      icon: "shield",
      category: "processing",
      features: ["Fraud Scoring", "Case Management"],
    },
  },

  // Central Processing Layer
  {
    id: "cashpro-payments",
    type: "systemNode",
    position: { x: 350, y: 180 },
    data: {
      title: "CashPro Payments",
      icon: "server",
      category: "processing",
      features: ["Payment Entry", "Payment Reporting", "Payment Validation", "Entitlement Validation", "Enrichment"],
    },
  },
  {
    id: "psh",
    type: "systemNode",
    position: { x: 500, y: 340 },
    data: {
      title: "PSH",
      icon: "server",
      category: "processing",
      features: ["Validation", "Calendar Service", "Release Gateway", "TX"],
    },
  },
  {
    id: "ecs",
    type: "systemNode",
    position: { x: 350, y: 480 },
    data: {
      title: "ECS",
      icon: "server",
      category: "processing",
      features: ["Payment Validation", "Transformation", "Acknowledgements"],
    },
  },
  {
    id: "swift-alliance",
    type: "systemNode",
    position: { x: 350, y: 700 },
    data: {
      title: "SWIFT Alliance",
      icon: "globe",
      category: "processing",
      features: ["SAA & SAG", "Transform and route"],
    },
  },

  // Middle Layer - DDA Container
  {
    id: "glfs-gl",
    type: "systemNode",
    position: { x: 680, y: 200 },
    data: {
      title: "GLFS GL",
      icon: "database",
      category: "processing",
      features: [],
    },
  },
  {
    id: "trx",
    type: "systemNode",
    position: { x: 680, y: 310 },
    data: {
      title: "TrX",
      icon: "file",
      category: "processing",
      features: ["Memo/Hard Posting", "GL Entries"],
    },
  },
  {
    id: "mft",
    type: "systemNode",
    position: { x: 680, y: 440 },
    data: {
      title: "MFT",
      icon: "server",
      category: "processing",
      features: ["Offline Wire Processing", "Wire Fee/Pricing"],
    },
  },
  {
    id: "impacts-dda",
    type: "systemNode",
    position: { x: 750, y: 190 },
    data: {
      title: "ImpactS DDA",
      icon: "database",
      category: "processing",
      features: [],
    },
  },
  {
    id: "ids-dda",
    type: "systemNode",
    position: { x: 820, y: 190 },
    data: {
      title: "IDS DDA",
      icon: "database",
      category: "processing",
      features: [],
    },
  },
  {
    id: "wbs-dda",
    type: "systemNode",
    position: { x: 890, y: 190 },
    data: {
      title: "WBS DDA",
      icon: "database",
      category: "processing",
      features: [],
    },
  },

  // Core System - WTX
  {
    id: "wtx",
    type: "systemNode",
    position: { x: 750, y: 560 },
    data: {
      title: "WTX",
      icon: "building",
      category: "core",
      features: [
        "Clearing & Settlement",
        "Operations Support Functions",
        "Client Reporting",
        "Wire Repair",
        "Wire Arrival, Collection, Warehousing, Distribution",
        "Routing (ex. On-Us)",
        "Cut-off Management",
      ],
    },
  },

  // Right Side - Compliance & Clearing
  {
    id: "aml",
    type: "systemNode",
    position: { x: 1050, y: 300 },
    data: {
      title: "AML",
      icon: "shield",
      category: "compliance",
      features: ["Financial Crimes Monitoring"],
    },
  },
  {
    id: "gin",
    type: "systemNode",
    position: { x: 1200, y: 300 },
    data: {
      title: "GIN",
      icon: "search",
      category: "compliance",
      features: ["Global Investigations", "Case Management", "Payment Research"],
    },
  },
  {
    id: "rgw-trads",
    type: "systemNode",
    position: { x: 1050, y: 430 },
    data: {
      title: "RGW / TraDS",
      icon: "database",
      category: "compliance",
      features: ["Operations Reporting", "Authorized Data Store", "Data Provisioning"],
    },
  },
  {
    id: "fedwire",
    type: "systemNode",
    position: { x: 1200, y: 530 },
    data: {
      title: "Fed/Wire",
      subtitle: "CLEARING",
      icon: "building",
      category: "clearing",
      features: [],
    },
  },
  {
    id: "chips",
    type: "systemNode",
    position: { x: 1200, y: 650 },
    data: {
      title: "CHIPS",
      subtitle: "CLEARING",
      icon: "building",
      category: "clearing",
      features: [],
    },
  },

  // Bottom Layer - Limits, FT, Examinations
  {
    id: "gfd-pfd-bottom",
    type: "systemNode",
    position: { x: 650, y: 800 },
    data: {
      title: "GFD/PFD",
      icon: "shield",
      category: "limits",
      features: ["Fraud Scoring", "Case Management"],
    },
  },
  {
    id: "ets",
    type: "systemNode",
    position: { x: 820, y: 800 },
    data: {
      title: "ETS",
      icon: "lock",
      category: "limits",
      features: ["Sanctions Screening", "Case Management"],
    },
  },
  {
    id: "gtms",
    type: "systemNode",
    position: { x: 990, y: 800 },
    data: {
      title: "GTMS",
      icon: "shield",
      category: "limits",
      features: ["Account Balance Exposure Limits"],
    },
  },
]

const initialEdges: Edge[] = [
  // CashPro connections
  { id: "e1", source: "cashpro", target: "cashpro-payments", type: "smoothstep", label: "TRP" },
  { id: "e2", source: "cashpro", target: "gfd-pfd-top", type: "smoothstep" },

  // B2Bi connections
  { id: "e3", source: "b2bi", target: "ecs", type: "smoothstep", label: "TRP" },

  // CashPro Payments connections
  { id: "e4", source: "cashpro-payments", target: "psh", type: "smoothstep", label: "mRP" },

  // PSH connections
  { id: "e5", source: "psh", target: "ecs", type: "smoothstep", label: "RPI" },
  { id: "e6", source: "psh", target: "trx", type: "smoothstep", label: "mRRP" },

  // ECS connections
  { id: "e7", source: "ecs", target: "wtx", type: "smoothstep", label: "RPI" },
  { id: "e8", source: "ecs", target: "b2bi", type: "smoothstep" },

  // SWIFT connections
  { id: "e9", source: "swift-external", target: "swift-alliance", type: "smoothstep" },
  { id: "e10", source: "swift-alliance", target: "wtx", type: "smoothstep" },

  // LoanIQ connections
  { id: "e11", source: "loaniq", target: "wtx", type: "smoothstep" },

  // GLFS GL connections
  { id: "e12", source: "glfs-gl", target: "trx", type: "smoothstep" },

  // TrX connections
  { id: "e13", source: "trx", target: "mft", type: "smoothstep" },

  // MFT connections
  { id: "e14", source: "mft", target: "wtx", type: "smoothstep" },

  // DDA connections
  { id: "e15", source: "impacts-dda", target: "wtx", type: "smoothstep", label: "RPI" },
  { id: "e16", source: "ids-dda", target: "wtx", type: "smoothstep", label: "RPI" },
  { id: "e17", source: "wbs-dda", target: "wtx", type: "smoothstep" },

  // WTX to compliance systems
  { id: "e18", source: "wtx", target: "aml", type: "smoothstep" },
  { id: "e19", source: "wtx", target: "rgw-trads", type: "smoothstep" },

  // Compliance to clearing
  { id: "e20", source: "aml", target: "gin", type: "smoothstep" },
  { id: "e21", source: "gin", target: "rgw-trads", type: "smoothstep" },
  { id: "e22", source: "rgw-trads", target: "fedwire", type: "smoothstep" },
  { id: "e23", source: "rgw-trads", target: "chips", type: "smoothstep" },

  // WTX to clearing
  { id: "e24", source: "wtx", target: "fedwire", type: "smoothstep" },
  { id: "e25", source: "wtx", target: "chips", type: "smoothstep" },

  // WTX to limits layer
  { id: "e26", source: "wtx", target: "gfd-pfd-bottom", type: "smoothstep", label: "RPI" },
  { id: "e27", source: "wtx", target: "ets", type: "smoothstep", label: "RPI" },
  { id: "e28", source: "wtx", target: "gtms", type: "smoothstep", label: "RPI" },

  // Fedwire to limits
  { id: "e29", source: "fedwire", target: "gtms", type: "smoothstep" },

  // CHIPS to limits
  { id: "e30", source: "chips", target: "gtms", type: "smoothstep" },
]

export function FlowSystemArchitecture() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes)
  const [edges, setEdges] = useState<Edge[]>(initialEdges)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [connectedNodeIds, setConnectedNodeIds] = useState<Set<string>>(new Set())
  const [connectedEdgeIds, setConnectedEdgeIds] = useState<Set<string>>(new Set())

  const nodeTypes: NodeTypes = useMemo(
    () => ({
      systemNode: SystemArchitectureNode,
    }),
    [],
  )

  const findConnections = useCallback(
    (nodeId: string) => {
      const connectedNodes = new Set<string>()
      const connectedEdges = new Set<string>()

      edges.forEach((edge) => {
        if (edge.source === nodeId || edge.target === nodeId) {
          connectedEdges.add(edge.id)
          if (edge.source === nodeId) {
            connectedNodes.add(edge.target)
          }
          if (edge.target === nodeId) {
            connectedNodes.add(edge.source)
          }
        }
      })

      return { connectedNodes, connectedEdges }
    },
    [edges],
  )

  const handleNodeClick = useCallback(
    (nodeId: string) => {
      if (selectedNodeId === nodeId) {
        setSelectedNodeId(null)
        setConnectedNodeIds(new Set())
        setConnectedEdgeIds(new Set())
      } else {
        const { connectedNodes, connectedEdges } = findConnections(nodeId)
        setSelectedNodeId(nodeId)
        setConnectedNodeIds(connectedNodes)
        setConnectedEdgeIds(connectedEdges)
      }
    },
    [selectedNodeId, findConnections],
  )

  const nodesForFlow = useMemo(() => {
    return nodes.map((node) => {
      const isSelected = selectedNodeId === node.id
      const isConnected = connectedNodeIds.has(node.id)
      const isDimmed = selectedNodeId && !isSelected && !isConnected

      return {
        ...node,
        data: {
          ...node.data,
          isSelected,
          isConnected,
          isDimmed,
          onClick: handleNodeClick,
        },
      }
    })
  }, [nodes, selectedNodeId, connectedNodeIds, handleNodeClick])

  const edgesForFlow = useMemo(() => {
    return edges.map((edge) => {
      const isConnected = connectedEdgeIds.has(edge.id)
      const isDimmed = selectedNodeId && !isConnected

      return {
        ...edge,
        style: {
          strokeWidth: isConnected ? 3 : 2,
          stroke: isConnected ? "#3b82f6" : isDimmed ? "#d1d5db" : "#6b7280",
          opacity: isDimmed ? 0.3 : 1,
        },
        animated: isConnected,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: isConnected ? "#3b82f6" : isDimmed ? "#d1d5db" : "#6b7280",
        },
      }
    })
  }, [edges, connectedEdgeIds, selectedNodeId])

  const onNodesChange: OnNodesChange = useCallback(
    (changes: NodeChange<Node>[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  )

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes: EdgeChange<Edge>[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  )

  const onConnect: OnConnect = useCallback(
    (connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            type: "smoothstep",
            markerEnd: { type: MarkerType.ArrowClosed, color: "#6b7280" },
            style: { strokeWidth: 2, stroke: "#6b7280" },
          },
          eds,
        ),
      ),
    [],
  )

  console.log("[v0] FlowSystemArchitecture rendering with", initialNodes.length, "nodes")

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodesForFlow}
        edges={edgesForFlow}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
        className="bg-[#1a2332]"
      >
        <Controls />
        <Background gap={16} size={1} color="#2a3f5f" />
      </ReactFlow>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 rounded-lg border bg-white p-4 shadow-lg">
        <h3 className="mb-2 text-sm font-semibold">System Categories</h3>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded border-2 border-[#d4c4a8] bg-[#e8dcc8]" />
            <span>External Systems</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded border-2 border-[#d4c4a8] bg-[#e8dcc8]" />
            <span>Processing Layer</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded border-2 border-[#d4c4a8] bg-[#e8dcc8]" />
            <span>Core System (WTX)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded border-2 border-[#1a2f4f] bg-[#2a3f5f]" />
            <span>Limits & Examinations</span>
          </div>
        </div>
      </div>

      {/* Selection info */}
      {selectedNodeId && (
        <div className="absolute top-4 left-4 max-w-sm rounded-lg border bg-white p-4 shadow-lg">
          <h3 className="mb-2 text-sm font-semibold">
            Selected: {nodes.find((n) => n.id === selectedNodeId)?.data.title}
          </h3>
          <p className="text-xs text-gray-600">Connected to {connectedNodeIds.size} systems</p>
          <Button
            onClick={() => handleNodeClick(selectedNodeId)}
            size="sm"
            variant="outline"
            className="mt-2 w-full text-xs"
          >
            Clear Selection
          </Button>
        </div>
      )}
    </div>
  )
}
