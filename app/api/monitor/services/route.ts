import { NextResponse } from "next/server"

// Mock data for services
const mockServices = [
  {
    id: "1",
    service: "Payment Gateway",
    statuses: {
      "26 Sep": "✅",
      "25 Sep": "✅",
      "24 Sep": "❌",
      "23 Sep": "✅",
      "22 Sep": "✅",
      "21 Sep": "✅",
      "20 Sep": "✅",
    },
    currentHourlyAverage: "99.2%",
    averagePerDay: "98.7%",
  },
  {
    id: "2",
    service: "Transaction Processing",
    statuses: {
      "26 Sep": "✅",
      "25 Sep": "✅",
      "24 Sep": "✅",
      "23 Sep": "✅",
      "22 Sep": "❌",
      "21 Sep": "✅",
      "20 Sep": "✅",
    },
    currentHourlyAverage: "97.8%",
    averagePerDay: "99.1%",
  },
  {
    id: "3",
    service: "Fraud Detection",
    statuses: {
      "26 Sep": "✅",
      "25 Sep": "✅",
      "24 Sep": "✅",
      "23 Sep": "✅",
      "22 Sep": "✅",
      "21 Sep": "✅",
      "20 Sep": "❌",
    },
    currentHourlyAverage: "99.9%",
    averagePerDay: "98.2%",
  },
  {
    id: "4",
    service: "Notification Service",
    statuses: {
      "26 Sep": "✅",
      "25 Sep": "❌",
      "24 Sep": "✅",
      "23 Sep": "✅",
      "22 Sep": "✅",
      "21 Sep": "✅",
      "20 Sep": "✅",
    },
    currentHourlyAverage: "96.5%",
    averagePerDay: "97.8%",
  },
  {
    id: "5",
    service: "Database Cluster",
    statuses: {
      "26 Sep": "✅",
      "25 Sep": "✅",
      "24 Sep": "✅",
      "23 Sep": "✅",
      "22 Sep": "✅",
      "21 Sep": "✅",
      "20 Sep": "✅",
    },
    currentHourlyAverage: "99.8%",
    averagePerDay: "99.9%",
  },
]

export async function GET() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return NextResponse.json(mockServices)
}
