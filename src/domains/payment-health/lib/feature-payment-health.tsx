/**
 * Main feature component for Payment Health domain
 *
 * This component serves as the entry point for the Payment Health feature,
 * providing a comprehensive dashboard for monitoring payment system health,
 * transaction flows, and system performance metrics.
 */

import PaymentHealthDashboard from "@/domains/payment-health/containers/payment-health-dashboard/payment-health-dashboard"

/**
 * FeaturePaymentHealth - Main component for the Payment Health feature
 *
 * This component renders the complete Payment Health dashboard including:
 * - Service status monitoring
 * - Transaction flow visualization
 * - System health metrics
 * - Performance analytics
 *
 * @returns JSX.Element The complete Payment Health feature interface
 */
export function FeaturePaymentHealth() {
  return <PaymentHealthDashboard />
}

// Default export for convenience
export default FeaturePaymentHealth
