import { QueryClient } from "@tanstack/react-query"
import { FlowDiagramUsWires } from "@/domains/payment-health/components/flow/diagrams/flow-diagrams/flow-diagram-us-wires/flow-diagram-us-wires"
import { TransactionUsWiresSearchProvider } from "@/domains/payment-health/providers/us-wires/us-wires-transaction-search-provider"
import { HelpButton } from "@/components/pdf-viewer/help-button"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 3,
    },
  },
})

function PaymentHealthDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header Section */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1" />
            <HelpButton
              pdfUrl="/documentation/application-guide.pdf"
              title="Payment Health Application Guide"
              variant="button"
            />
          </div>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Health Dashboard</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Monitor and visualize your payment system flows in real-time. Track transaction health, identify
              bottlenecks, and ensure optimal performance.
            </p>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Flow Diagram Section - Central Visual Element */}
        <section className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">US Wires Transaction Flow</h2>
            <p className="text-sm text-gray-600 mt-1">
              Interactive visualization of payment processing stages and system health
            </p>
          </div>

          <div className="p-6">
            <TransactionUsWiresSearchProvider>
              <div className="min-h-[600px] bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 overflow-hidden">
                <FlowDiagramUsWires isMonitoringMode={false} />
              </div>
            </TransactionUsWiresSearchProvider>
          </div>
        </section>

        {/* Status Indicators */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <h3 className="text-lg font-medium text-gray-900">System Status</h3>
            </div>
            <p className="text-sm text-gray-600 mt-2">All systems operational</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
              <h3 className="text-lg font-medium text-gray-900">Flow Monitoring</h3>
            </div>
            <p className="text-sm text-gray-600 mt-2">Real-time transaction tracking</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
              <h3 className="text-lg font-medium text-gray-900">Performance</h3>
            </div>
            <p className="text-sm text-gray-600 mt-2">Optimized processing speeds</p>
          </div>
        </div>

        {/* Testing Information */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Testing & Validation</h3>
          <p className="text-blue-800 mb-4">
            This flow diagram serves as the central testing interface for all recent code changes. Use the interactive
            elements to validate functionality and monitor system behavior.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Interactive Features:</h4>
              <ul className="text-blue-700 space-y-1">
                <li>• Click nodes to view detailed information</li>
                <li>• Use search functionality to test queries</li>
                <li>• Monitor real-time status updates</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Recent Updates:</h4>
              <ul className="text-blue-700 space-y-1">
                <li>• Enhanced section background nodes</li>
                <li>• Improved duration badge display</li>
                <li>• Optimized loading states</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default PaymentHealthDashboard
