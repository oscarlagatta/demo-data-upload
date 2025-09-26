import { NextResponse } from "next/server"

// Mock chart data generator
function generateChartData(serviceId: string) {
  const hours = Array.from({ length: 24 }, (_, i) => {
    const hour = new Date()
    hour.setHours(i, 0, 0, 0)
    return hour.toISOString()
  })

  return {
    serviceId,
    responseTime: hours.map((time, i) => ({
      timestamp: time,
      value: Math.floor(Math.random() * 500) + 100 + (i % 6) * 20,
    })),
    throughput: hours.map((time, i) => ({
      timestamp: time,
      value: Math.floor(Math.random() * 1000) + 500 + (i % 4) * 100,
    })),
    errorRate: hours.map((time, i) => ({
      timestamp: time,
      value: Math.random() * 5 + (i % 8 === 0 ? 10 : 0),
    })),
  }
}

export async function GET(request: Request, { params }: { params: { serviceId: string } }) {
  const { serviceId } = params

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 400))

  const chartData = generateChartData(serviceId)
  return NextResponse.json(chartData)
}
