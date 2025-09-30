"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, RefreshCw } from "lucide-react"

export interface SplunkTableProps {
  aitNum: string
  action: string
  onBack: () => void
}

// Minimal Splunk table component
export default function SplunkTableUsWires({ aitNum, action, onBack }: SplunkTableProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleRefresh = () => {
    setIsLoading(true)
    // Simulate data refresh
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  // Mock data for demonstration
  const mockData = [
    {
      id: "1",
      timestamp: new Date().toISOString(),
      aitNum: aitNum,
      status: "completed",
      amount: 1000,
      currency: "USD",
      source: "wire_transfer",
    },
    {
      id: "2",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      aitNum: aitNum,
      status: "pending",
      amount: 2500,
      currency: "USD",
      source: "wire_transfer",
    },
    {
      id: "3",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      aitNum: aitNum,
      status: "failed",
      amount: 500,
      currency: "USD",
      source: "wire_transfer",
    },
  ]

  return (
    <div className="p-6 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button onClick={onBack} variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
            <ArrowLeft className="h-4 w-4" />
            Back to Flow
          </Button>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Splunk Data - AIT {aitNum}</h2>
            <p className="text-sm text-gray-600">Action: {action}</p>
          </div>
        </div>
        <Button
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          disabled={isLoading}
          className="flex items-center gap-2 bg-transparent"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  AIT Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockData.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(row.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.aitNum}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        row.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : row.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: row.currency,
                    }).format(row.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
        <span>Showing {mockData.length} transactions</span>
        <span>Last updated: {new Date().toLocaleTimeString()}</span>
      </div>
    </div>
  )
}
