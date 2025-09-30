"use client"
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw, Download, Filter } from "lucide-react"

// Mock transaction data interface
interface TransactionDetail {
  id: string
  transactionId: string
  timestamp: string
  amount: number
  currency: string
  status: "completed" | "pending" | "failed" | "processing"
  sourceAccount: string
  targetAccount: string
  reference: string
  fees: number
  exchangeRate?: number
}

// Minimal AG Grid-style table component
export function TransactionDetailsTableAgGrid() {
  const [isLoading, setIsLoading] = useState(false)
  const [filterText, setFilterText] = useState("")

  // Mock transaction data
  const mockTransactions: TransactionDetail[] = useMemo(
    () => [
      {
        id: "1",
        transactionId: "TXN-001-2024",
        timestamp: new Date().toISOString(),
        amount: 10000,
        currency: "USD",
        status: "completed",
        sourceAccount: "ACC-12345",
        targetAccount: "ACC-67890",
        reference: "Wire Transfer - Invoice #INV-001",
        fees: 25.0,
      },
      {
        id: "2",
        transactionId: "TXN-002-2024",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        amount: 25000,
        currency: "USD",
        status: "processing",
        sourceAccount: "ACC-11111",
        targetAccount: "ACC-22222",
        reference: "Wire Transfer - Contract Payment",
        fees: 50.0,
      },
      {
        id: "3",
        transactionId: "TXN-003-2024",
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        amount: 5000,
        currency: "EUR",
        status: "failed",
        sourceAccount: "ACC-33333",
        targetAccount: "ACC-44444",
        reference: "International Wire Transfer",
        fees: 35.0,
        exchangeRate: 1.08,
      },
      {
        id: "4",
        transactionId: "TXN-004-2024",
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        amount: 75000,
        currency: "USD",
        status: "pending",
        sourceAccount: "ACC-55555",
        targetAccount: "ACC-66666",
        reference: "Large Wire Transfer - Real Estate",
        fees: 100.0,
      },
    ],
    [],
  )

  // Filter transactions based on search text
  const filteredTransactions = useMemo(() => {
    if (!filterText) return mockTransactions

    return mockTransactions.filter((transaction) =>
      Object.values(transaction).some((value) => value?.toString().toLowerCase().includes(filterText.toLowerCase())),
    )
  }, [mockTransactions, filterText])

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  const handleExport = () => {
    // Mock export functionality
    console.log("Exporting transactions...", filteredTransactions)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-6 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Transaction Details</h2>
          <p className="text-sm text-gray-600 mt-1">Detailed view of all wire transfer transactions</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleExport} variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Export
          </Button>
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
      </div>

      {/* Filters */}
      <div className="mb-4 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <span className="text-sm text-gray-500">
          {filteredTransactions.length} of {mockTransactions.length} transactions
        </span>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source Account
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Target Account
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fees</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reference
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transaction.transactionId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(transaction.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: transaction.currency,
                    }).format(transaction.amount)}
                    {transaction.exchangeRate && (
                      <div className="text-xs text-gray-500">Rate: {transaction.exchangeRate}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.sourceAccount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.targetAccount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: transaction.currency,
                    }).format(transaction.fees)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{transaction.reference}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
        <span>Showing {filteredTransactions.length} transactions</span>
        <span>Last updated: {new Date().toLocaleTimeString()}</span>
      </div>
    </div>
  )
}
