// checked
import { Skeleton } from "@/components/ui/skeleton"

interface LoadingSkeletonProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function ButtonLoadingSkeleton({ className }: LoadingSkeletonProps) {
  return (
    <div className={`flex space-x-1 ${className}`}>
      <Skeleton className="h-6 w-12 rounded" />
      <Skeleton className="h-6 w-12 rounded" />
      <Skeleton className="h-6 w-16 rounded" />
    </div>
  )
}

export function CardLoadingSkeleton({ className, size = "md" }: LoadingSkeletonProps) {
  const sizeStyles = {
    sm: {
      container: "p-2",
      titleHeight: "h-3",
      titleWidth: "w-20",
      subtitleHeight: "h-2",
      subtitleWidth: "w-16",
      buttonHeight: "h-5",
      buttonWidths: ["w-12", "w-12", "w-14"],
      spacing: "space-y-2",
    },
    md: {
      container: "p-4",
      titleHeight: "h-4",
      titleWidth: "w-32",
      subtitleHeight: "h-3",
      subtitleWidth: "w-24",
      buttonHeight: "h-7",
      buttonWidths: ["w-16", "w-16", "w-20"],
      spacing: "space-y-3",
    },
    lg: {
      container: "p-6",
      titleHeight: "h-5",
      titleWidth: "w-40",
      subtitleHeight: "h-4",
      subtitleWidth: "w-32",
      buttonHeight: "h-8",
      buttonWidths: ["w-20", "w-20", "w-24"],
      spacing: "space-y-4",
    },
  }

  const styles = sizeStyles[size]

  return (
    <div className={`animate-pulse rounded-lg border-2 border-gray-300 bg-white shadow-md ${className}`}>
      <div className={`${styles.spacing} ${styles.container}`}>
        <Skeleton className={`${styles.titleHeight} ${styles.titleWidth} bg-gray-300`} />
        <Skeleton className={`${styles.subtitleHeight} ${styles.subtitleWidth} bg-gray-200`} />
      </div>
      <div className={`border-t border-gray-200 ${styles.container} pt-3`}>
        <div className="flex space-x-2">
          <Skeleton className={`${styles.buttonHeight} ${styles.buttonWidths[0]} rounded bg-gray-300`} />
          <Skeleton className={`${styles.buttonHeight} ${styles.buttonWidths[1]} rounded bg-gray-300`} />
          <Skeleton className={`${styles.buttonHeight} ${styles.buttonWidths[2]} rounded bg-gray-300`} />
        </div>
      </div>
    </div>
  )
}
