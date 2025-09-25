/**
 * Main application page
 *
 * This is the root page of the application that renders the Payment Health feature.
 * It serves as the entry point for users accessing the payment monitoring dashboard.
 */

import { FeaturePaymentHealth } from "@/domains/payment-health/lib/feature-payment-health"

/**
 * Home page component
 *
 * Renders the main Payment Health dashboard as the default application view.
 * This provides users with immediate access to payment system monitoring
 * and health metrics upon loading the application.
 *
 * @returns JSX.Element The main application page
 */
export default function Page() {
  return <FeaturePaymentHealth />
}
