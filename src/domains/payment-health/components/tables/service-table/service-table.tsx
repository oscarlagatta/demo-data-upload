// This component was causing "ServiceStatus is not defined" errors and needs to be removed
// for debugging purposes to create a clean slate for diagnosis

/*
// checked
"use client"
import { useMemo, useState } from "react"
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model"
import { ModuleRegistry } from "@ag-grid-community/core"
import type { ColDef, ICellRendererParams } from "@ag-grid-community/core"
import { AgGridReact } from "@ag-grid-community/react"
import "@ag-grid-community/styles/ag-grid.css"
import "@ag-grid-community/styles/ag-theme-quartz.css"
import { MasterDetailModule } from "@ag-grid-enterprise/master-detail"

import { AlertTriangle } from 'lucide-react'

import { Skeleton } from "@/components/ui/skeleton"

import { useServices } from "@/src/domains/payment-health/hooks/hooks"
import SectionBackgroundNode from "@/src/domains/payment-health/components/flow/nodes/expandable-charts/section-background-node"
import StatusIndicator from "@/src/domains/payment-health/components/indicators/status-indicator/status-indicator"

interface ServiceStatus {
  id: string
  service: string
  statuses: Record<string, "✅" | "❌">
  currentHourlyAverage: string
  averagePerDay: string
}

// Register the required AG Grid modules
ModuleRegistry.registerModules([ClientSideRowModelModule, MasterDetailModule])

const StatusCellRenderer = (props: ICellRendererParams) => {
  if (!props.value) return null
  return (
    <div className="flex h-full items-center justify-center">
      <StatusIndicator status={props.value} />
    </div>
  )
}

const AverageWithWarningRenderer = (props: ICellRendererParams) => {
  if (!props.value) return null
  return (
    <div className="flex h-full items-center justify-center gap-2">
      <AlertTriangle className="h-4 w-4 text-amber-500" />
      <span>{props.value}</span>
    </div>
  )
}

const ServiceTable = () => {
  const { data: rowData, isLoading } = useServices()

  const [colDefs] = useState<ColDef<ServiceStatus>[]>([
    {
      field: "service" as keyof ServiceStatus,
      headerName: "Service",
      pinned: "left",
      cellRenderer: "agGroupCellRenderer",
      minWidth: 200,
      flex: 2,
      headerClass: "centered-header",
    },
    ...Array.from({ length: 7 }).map((_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const day = date.toLocaleDateString("en-US", { day: "numeric" })
      const month = date.toLocaleDateString("en-US", { month: "short" })
      const key = `${day} ${month}`
      return {
        field: `statuses.${key}` as keyof ServiceStatus,
        headerName: i === 0 ? "Today" : key,
        cellRenderer: StatusCellRenderer,
        minWidth: 100,
        flex: 1,
        headerClass: "text-center",
        cellStyle: {
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
      }
    }),
    {
      field: "currentHourlyAverage",
      headerName: "Current Hourly Average",
      minWidth: 180,
      flex: 1.5,
      headerClass: "centered-header",
      cellRenderer: AverageWithWarningRenderer,
      cellStyle: {
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
    },
    {
      field: "averagePerDay" as keyof ServiceStatus,
      headerName: "Average per day",
      minWidth: 150,
      flex: 1.5,
      headerClass: "centered-header",
      cellRenderer: AverageWithWarningRenderer,
      cellStyle: {
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
    },
  ])

  const detailCellRenderer = useMemo(() => {
    return SectionBackgroundNode
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  return (
    <div className="ag-theme-quartz ag-grid-centered-headers w-full shadow-sm">
      <AgGridReact<ServiceStatus>
        rowData={rowData}
        columnDefs={colDefs}
        masterDetail={true}
        detailCellRenderer={detailCellRenderer}
        detailRowHeight={400}
        domLayout="autoHeight"
        suppressColumnVirtualisation={true}
        pagination={true}
        paginationPageSize={10}
        paginationPageSizeSelector={[10, 20, 50]}
        animateRows={true}
      />
    </div>
  )
}

export default ServiceTable
*/

// This allows the application to continue running while the ServiceStatus error is being diagnosed
const ServiceTable = () => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-600">ServiceTable Temporarily Disabled</h2>
        <p className="text-sm text-gray-500 mt-2">Component removed for debugging ServiceStatus error</p>
      </div>
    </div>
  )
}

export default ServiceTable
