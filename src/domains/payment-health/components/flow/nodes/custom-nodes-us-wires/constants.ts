export const NODE_HEIGHT = 100

export const HANDLE_POSITIONS = ["left", "right", "top", "bottom"] as const

export const BUTTON_CLASSES = {
  base: "h-6 min-w-0 flex-1 px-2 text-[10px] shadow-sm",
  primary: "border-blue-600 bg-blue-600 text-white hover:bg-blue-700 hover:text-white",
  disabled: "cursor-not-allowed border-gray-300 bg-gray-300 text-gray-500",
  loading: "border-blue-600 bg-blue-600 text-white",
} as const

export const LOADING_DELAY = 500
