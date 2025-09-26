import { NextResponse } from "next/server"

// Mock data for KPIs
const mockKPIs = {
  totalTransactions: 125847,
  successRate: 98.7,
  averageResponseTime: 245,
  activeServices: 12,
  failedTransactions: 1638,
  systemUptime: 99.9,
}

export async function GET() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  return NextResponse.json(mockKPIs)
}
