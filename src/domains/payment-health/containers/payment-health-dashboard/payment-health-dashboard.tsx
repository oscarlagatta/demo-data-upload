import { QueryClient } from "@tanstack/react-query"
import { FlowDiagramUsWires } from "@/domains/payment-health/components/flow/diagrams/flow-diagrams/flow-diagram-us-wires/flow-diagram-us-wires"
import { FlowSystemArchitecture } from "@/domains/payment-health/components/flow/diagrams/flow-diagrams/flow-diagram-system-architecture"
import { TransactionUsWiresSearchProvider } from "@/domains/payment-health/providers/us-wires/us-wires-transaction-search-provider"
import { FloatingHelpButton } from "@/components/pdf-viewer/floating-help-button"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 3,
    },
  },
})

function PaymentHealthDashboard() {
  console.log("[v0] PaymentHealthDashboard rendering")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <FloatingHelpButton pdfUrl="/documentation/application-guide.pdf" title="Payment Health Application Guide" />

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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* System Architecture Overview section as the primary visual element */}
        <section className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">System Architecture Overview</h2>
            <p className="text-sm text-gray-700 mt-2">
              Complete payment processing ecosystem showing all integrated systems, data flows, and compliance layers
            </p>
          </div>

          <div className="p-6 bg-slate-900">
            <div className="h-[700px] rounded-lg overflow-hidden">
              <FlowSystemArchitecture />
            </div>
          </div>

          {/* Architecture Legend */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-amber-100 border-2 border-amber-300 rounded"></div>
                <span className="text-gray-700">External Systems</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-amber-100 border-2 border-amber-300 rounded"></div>
                <span className="text-gray-700">Processing Layer</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-slate-800 border-2 border-blue-400 rounded"></div>
                <span className="text-gray-700">Compliance & Limits</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-amber-100 border-2 border-amber-300 rounded"></div>
                <span className="text-gray-700">Clearing Systems</span>
              </div>
            </div>
          </div>
        </section>

        <TransactionUsWiresSearchProvider>
          <section className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">US Wires Transaction Flow</h2>
              <p className="text-sm text-gray-700 mt-2">
                Detailed view of US wire transfer processing stages and transaction monitoring
              </p>
            </div>

            <div className="p-6">
              <FlowDiagramUsWires queryClient={queryClient} />
            </div>
          </section>
        </TransactionUsWiresSearchProvider>
      </main>
    </div>
  )
}

export default PaymentHealthDashboard
