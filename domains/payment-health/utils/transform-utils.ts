// Minimal transform utilities
export interface TransformOptions {
  format?: string
  precision?: number
  currency?: string
}

export function transformData(data: any, options: TransformOptions = {}): any {
  if (!data) return data

  // Basic data transformation logic
  if (Array.isArray(data)) {
    return data.map((item) => transformSingleItem(item, options))
  }

  return transformSingleItem(data, options)
}

function transformSingleItem(item: any, options: TransformOptions): any {
  if (!item || typeof item !== "object") return item

  const transformed = { ...item }

  // Transform numeric values if precision is specified
  if (options.precision !== undefined) {
    Object.keys(transformed).forEach((key) => {
      if (typeof transformed[key] === "number") {
        transformed[key] = Number(transformed[key].toFixed(options.precision))
      }
    })
  }

  // Add currency formatting if specified
  if (options.currency && transformed.amount) {
    transformed.formattedAmount = `${options.currency} ${transformed.amount}`
  }

  return transformed
}

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount)
}

export function formatTimestamp(timestamp: string | Date): string {
  const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp
  return date.toLocaleString()
}

export function normalizeData(data: any[]): any[] {
  if (!Array.isArray(data)) return []

  return data
    .filter((item) => item != null)
    .map((item) => ({
      ...item,
      id: item.id || Math.random().toString(36).substr(2, 9),
      timestamp: item.timestamp || new Date().toISOString(),
    }))
}
