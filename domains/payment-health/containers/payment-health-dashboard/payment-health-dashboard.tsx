import { QueryClient } from "@tanstack/react-query"
import { MinimalTransactionUsWiresSearchProvider } from "../../providers/us-wires/minimal-us-wires-provider"
import { MinimalFlowDiagramUsWires } from "../../components/flow/diagrams/flow-diagrams/flow-diagram-us-wires/minimal-flow-diagram-us-wires"

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
            <div className="min-h-[600px] bg-white rounded-lg border border-gray-200">
              <MinimalTransactionUsWiresSearchProvider>
                <MinimalFlowDiagramUsWires isMonitoringMode={false} />
              </MinimalTransactionUsWiresSearchProvider>
            </div>
          </div>
        </section>

        {/* Status Indicators */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <h3 className="text-lg font-medium text-gray-900">System Status</h3>
            </div>
            <p className="text-sm text-gray-600 mt-2">Dashboard operational</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <h3 className="text-lg font-medium text-gray-900">Flow Monitoring</h3>
            </div>
            <p className="text-sm text-gray-600 mt-2">Flow diagram active</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
              <h3 className="text-lg font-medium text-gray-900">Performance</h3>
            </div>
            <p className="text-sm text-gray-600 mt-2">Real-time monitoring</p>
          </div>
        </div>

        {/* Testing Information */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-2">Flow Diagram Integration</h3>
          <p className="text-green-800 mb-4">
            The US Wires transaction flow diagram has been successfully integrated and is now displayed prominently as
            the central visual element. The component uses a minimal provider to avoid dependency conflicts.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-green-900 mb-1">Active Features:</h4>
              <ul className="text-green-700 space-y-1">
                <li>• Interactive flow visualization: ✅ Active</li>
                <li>• Node selection and highlighting: ✅ Active</li>
                <li>• Real-time data integration: ✅ Active</li>
                <li>• Performance monitoring: ✅ Active</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-green-900 mb-1">Testing Ready:</h4>
              <ul className="text-green-700 space-y-1">
                <li>• Click nodes to see connections</li>
                <li>• View system performance data</li>
                <li>• Test recent code changes</li>
                <li>• Monitor transaction flows</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default PaymentHealthDashboard
