// Minimal shared mappings utility
export const sharedMappings = {
  // Add any shared mapping constants here
  defaultMapping: "default",
}

export function getSharedMapping(key: string): string {
  return sharedMappings[key as keyof typeof sharedMappings] || "unknown"
}

export default sharedMappings
