# Visual Wireflow Guide - US Wire Transfer System

## Overview
This document provides visual guidance for implementing the US Wire Transfer Processing System wireflow with US-specific design patterns and cultural considerations.

---

## Screen-by-Screen Wireflow

### 1. Login & Authentication Screen (AIT-001)

\`\`\`
┌─────────────────────────────────────────────────────────┐
│  [Bank Logo]                    [Help] [Settings]       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│              Welcome to Wire Transfer Portal            │
│                                                          │
│         ┌────────────────────────────────────┐         │
│         │  Username                          │         │
│         │  [________________]                │         │
│         │                                    │         │
│         │  Password                          │         │
│         │  [________________]  [👁]          │         │
│         │                                    │         │
│         │  [ ] Remember me                   │         │
│         │                                    │         │
│         │  [    Sign In Securely    ]        │         │
│         │                                    │         │
│         │  Forgot password? | Need help?     │         │
│         └────────────────────────────────────┘         │
│                                                          │
│  🔒 Your connection is secure and encrypted             │
│                                                          │
└─────────────────────────────────────────────────────────┘
\`\`\`

**US Design Elements:**
- Large, clear "Sign In" button (not "Login" or "Submit")
- Password visibility toggle (eye icon)
- "Remember me" checkbox (common US pattern)
- Security indicator at bottom
- Help link prominently displayed

---

### 2. Dashboard / Home Screen (AIT-001)

\`\`\`
┌─────────────────────────────────────────────────────────────────────┐
│  [Logo]  Dashboard  Payments  Reports  Settings    [User] [Logout]  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Welcome back, John Smith                    Last login: 01/25/2025 │
│                                                                      │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐ │
│  │ Available Balance│  │ Pending Wires    │  │ Today's Activity │ │
│  │                  │  │                  │  │                  │ │
│  │  $1,234,567.89  │  │        3         │  │       12         │ │
│  │                  │  │                  │  │                  │ │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘ │
│                                                                      │
│  Quick Actions                                                       │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  [💸 Send Wire Transfer]  [📊 View Reports]  [⚙️ Manage]    │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  Recent Transactions                                [View All]       │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │ 01/25  Wire to ABC Corp        $50,000.00    ✅ Completed   │  │
│  │ 01/25  Wire from XYZ Inc       $25,000.00    ✅ Received    │  │
│  │ 01/24  Wire to Supplier LLC    $10,000.00    ⏳ Pending     │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
\`\`\`

**US Design Elements:**
- Card-based layout for key metrics
- Dollar amounts prominently displayed with US formatting
- Clear status indicators (✅ ⏳)
- Action-oriented buttons with icons
- "Quick Actions" section for common tasks

---

### 3. Send Wire Transfer - Step 1: Beneficiary (AIT-005)

\`\`\`
┌─────────────────────────────────────────────────────────────────────┐
│  ← Back to Dashboard              Send Wire Transfer          [?]   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Step 1 of 4: Beneficiary Information                               │
│  ●━━━○━━━○━━━○                                                      │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  Beneficiary Type                                           │  │
│  │  ○ Domestic (US)    ● International                         │  │
│  │                                                              │  │
│  │  Beneficiary Name *                                          │  │
│  │  [_____________________________________________]             │  │
│  │                                                              │  │
│  │  Beneficiary Bank Name *                                     │  │
│  │  [_____________________________________________]             │  │
│  │                                                              │  │
│  │  Bank Routing Number (ABA) *                                 │  │
│  │  [_________]  ℹ️ 9-digit number                              │  │
│  │                                                              │  │
│  │  Beneficiary Account Number *                                │  │
│  │  [_____________________________________________]             │  │
│  │                                                              │  │
│  │  [ ] Save as template for future use                        │  │
│  │                                                              │  │
│  │  [Cancel]                              [Continue →]          │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  💡 Tip: Double-check account numbers to avoid delays               │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
\`\`\`

**US Design Elements:**
- Progress indicator (4 steps)
- Clear field labels with asterisks for required fields
- Helpful tooltips (ℹ️ icon)
- "Domestic vs International" toggle
- ABA routing number format guidance
- Save template option
- Helpful tip at bottom

---

### 4. Send Wire Transfer - Step 2: Amount & Purpose (AIT-005, AIT-006)

\`\`\`
┌─────────────────────────────────────────────────────────────────────┐
│  ← Back                          Send Wire Transfer          [?]    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Step 2 of 4: Amount & Purpose                                      │
│  ●━━━●━━━○━━━○                                                      │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  From Account *                                             │  │
│  │  [▼ Operating Account - ****1234  ($1,234,567.89)]         │  │
│  │                                                              │  │
│  │  Wire Amount *                                               │  │
│  │  $ [_____________]                                           │  │
│  │                                                              │  │
│  │  ┌────────────────────────────────────────────────────┐    │  │
│  │  │  Wire Fee:              $25.00                     │    │  │
│  │  │  Total Debit:           $[calculated]              │    │  │
│  │  └────────────────────────────────────────────────────┘    │  │
│  │                                                              │  │
│  │  Payment Purpose *                                           │  │
│  │  [▼ Select purpose]                                          │  │
│  │     - Invoice Payment                                        │  │
│  │     - Payroll                                                │  │
│  │     - Loan Payment                                           │  │
│  │     - Other                                                  │  │
│  │                                                              │  │
│  │  Reference / Invoice Number                                  │  │
│  │  [_____________________________________________]             │  │
│  │                                                              │  │
│  │  Additional Instructions (Optional)                          │  │
│  │  [_____________________________________________]             │  │
│  │  [_____________________________________________]             │  │
│  │                                                              │  │
│  │  [← Back]                              [Continue →]          │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ⚠️ Cut-off time: 5:00 PM ET for same-day processing                │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
\`\`\`

**US Design Elements:**
- Account selector with masked account number
- Dollar sign prefix for amount field
- Automatic fee calculation display
- Purpose dropdown with common US categories
- Cut-off time warning (important for US wires)
- Optional fields clearly marked

---

### 5. Send Wire Transfer - Step 3: Review & Confirm (AIT-004, AIT-017, AIT-020)

\`\`\`
┌─────────────────────────────────────────────────────────────────────┐
│  ← Back                          Send Wire Transfer          [?]    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Step 3 of 4: Review & Confirm                                      │
│  ●━━━●━━━●━━━○                                                      │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  Please review your wire transfer details                   │  │
│  │                                                              │  │
│  │  From Account                                                │  │
│  │  Operating Account - ****1234                                │  │
│  │                                                              │  │
│  │  Beneficiary                                                 │  │
│  │  ABC Corporation                                             │  │
│  │  First National Bank                                         │  │
│  │  ABA: 123456789                                              │  │
│  │  Account: ****5678                                           │  │
│  │                                                              │  │
│  │  Amount                                                      │  │
│  │  Wire Amount:           $50,000.00                           │  │
│  │  Wire Fee:              $25.00                               │  │
│  │  ─────────────────────────────────                           │  │
│  │  Total Debit:           $50,025.00                           │  │
│  │                                                              │  │
│  │  Purpose: Invoice Payment                                    │  │
│  │  Reference: INV-2025-001                                     │  │
│  │                                                              │  │
│  │  Expected Delivery: Same Day (by 6:00 PM ET)                │  │
│  │                                                              │  │
│  │  ⚠️ Important: Wire transfers cannot be cancelled once       │  │
│  │  submitted. Please verify all details are correct.           │  │
│  │                                                              │  │
│  │  [ ] I confirm the details above are correct                │  │
│  │                                                              │  │
│  │  [← Back]                    [Submit Wire Transfer]          │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  🔒 This transaction will be processed securely                     │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
\`\`\`

**US Design Elements:**
- Clear summary of all details
- Masked account numbers for security
- Total debit amount prominently displayed
- Expected delivery timeframe
- Warning about irreversibility (important for US users)
- Confirmation checkbox before submit
- Security indicator

---

### 6. Processing Screen (AIT-004, AIT-006, AIT-015, AIT-017, AIT-020)

\`\`\`
┌─────────────────────────────────────────────────────────────────────┐
│                          Send Wire Transfer                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│                                                                      │
│                         [⏳ Processing...]                           │
│                                                                      │
│                  Processing your wire transfer                       │
│                                                                      │
│                  ✅ Validating payment details                       │
│                  ✅ Fraud screening                                  │
│                  ✅ Compliance checks                                │
│                  ⏳ Submitting to clearing network                   │
│                                                                      │
│                  Please do not close this window                     │
│                                                                      │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
\`\`\`

**US Design Elements:**
- Clear progress indicators
- Step-by-step status updates
- Instruction not to close window
- Reassuring messaging

---

### 7. Confirmation Screen (AIT-015)

\`\`\`
┌─────────────────────────────────────────────────────────────────────┐
│                          Wire Transfer Sent                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│                         ✅ Success!                                  │
│                                                                      │
│              Your wire transfer has been submitted                   │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  Confirmation Number: WT-2025-012345                        │  │
│  │                                                              │  │
│  │  Amount:              $50,000.00                             │  │
│  │  Beneficiary:         ABC Corporation                        │  │
│  │  Expected Delivery:   Same Day (by 6:00 PM ET)              │  │
│  │                                                              │  │
│  │  Status: Processing                                          │  │
│  │                                                              │  │
│  │  [📧 Email Confirmation]  [🖨️ Print]  [📱 Share]            │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  What's Next?                                                        │
│  • You'll receive an email when the wire is completed                │
│  • Track status in the "Payments" section                           │
│  • Contact us if you need to make changes                           │
│                                                                      │
│  [Return to Dashboard]              [Send Another Wire]              │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
\`\`\`

**US Design Elements:**
- Large success indicator
- Confirmation number prominently displayed
- Clear next steps
- Multiple action options (email, print, share)
- Expected delivery timeframe
- Clear call-to-action buttons

---

### 8. Payment Status Tracking (AIT-015)

\`\`\`
┌─────────────────────────────────────────────────────────────────────┐
│  ← Back to Payments              Wire Transfer Details       [?]    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Confirmation #: WT-2025-012345                                      │
│                                                                      │
│  Status Timeline                                                     │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                                                              │  │
│  │  ✅ Submitted           01/25/2025  10:15 AM ET             │  │
│  │  │                                                           │  │
│  │  ✅ Fraud Check Passed  01/25/2025  10:15 AM ET             │  │
│  │  │                                                           │  │
│  │  ✅ Compliance Cleared  01/25/2025  10:16 AM ET             │  │
│  │  │                                                           │  │
│  │  ✅ Sent to Fed/Wire    01/25/2025  10:17 AM ET             │  │
│  │  │                                                           │  │
│  │  ⏳ In Transit          Expected: 01/25/2025  6:00 PM ET    │  │
│  │  │                                                           │  │
│  │  ○ Delivered            Pending                              │  │
│  │                                                              │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  Transaction Details                                                 │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  From:        Operating Account - ****1234                  │  │
│  │  To:          ABC Corporation                                │  │
│  │  Bank:        First National Bank (ABA: 123456789)          │  │
│  │  Amount:      $50,000.00                                     │  │
│  │  Fee:         $25.00                                         │  │
│  │  Purpose:     Invoice Payment                                │  │
│  │  Reference:   INV-2025-001                                   │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  [📧 Email Details]  [🖨️ Print]  [❓ Need Help?]                   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
\`\`\`

**US Design Elements:**
- Visual timeline with checkmarks
- Timestamps with ET timezone
- Expected delivery time
- Complete transaction details
- Help option readily available

---

## Mobile Wireflow (Responsive Design)

### Mobile: Dashboard

\`\`\`
┌─────────────────────────┐
│ ☰  Dashboard      [👤]  │
├─────────────────────────┤
│                         │
│ Welcome, John           │
│                         │
│ ┌─────────────────────┐ │
│ │ Available Balance   │ │
│ │  $1,234,567.89     │ │
│ └─────────────────────┘ │
│                         │
│ ┌─────────────────────┐ │
│ │ Pending: 3          │ │
│ │ Today: 12           │ │
│ └─────────────────────┘ │
│                         │
│ [💸 Send Wire]          │
│ [📊 View Reports]       │
│                         │
│ Recent Transactions     │
│ ┌─────────────────────┐ │
│ │ 01/25 ABC Corp      │ │
│ │ $50,000.00  ✅      │ │
│ ├─────────────────────┤ │
│ │ 01/25 XYZ Inc       │ │
│ │ $25,000.00  ✅      │ │
│ └─────────────────────┘ │
│                         │
│ [View All →]            │
│                         │
└─────────────────────────┘
\`\`\`

**Mobile Design Elements:**
- Hamburger menu for navigation
- Stacked card layout
- Large touch targets for buttons
- Simplified information display
- Swipe-friendly transaction list

---

## Accessibility Considerations (WCAG 2.1 AA Compliance)

### Color Contrast
- Text: Minimum 4.5:1 contrast ratio
- Large text: Minimum 3:1 contrast ratio
- Interactive elements: Clear focus indicators

### Keyboard Navigation
- All functions accessible via keyboard
- Logical tab order
- Skip navigation links
- Clear focus indicators

### Screen Reader Support
- Semantic HTML elements
- ARIA labels for complex interactions
- Alt text for all images
- Form field labels properly associated

### Visual Design
- Text resizable up to 200%
- No information conveyed by color alone
- Clear error messages
- Sufficient spacing between interactive elements

---

## Cultural Considerations for US Users

### Language & Tone
- **Direct and action-oriented:** "Send Wire" not "Initiate Transfer"
- **Clear and concise:** Avoid banking jargon
- **Friendly but professional:** Balance formality with approachability
- **Transparent:** Clear fee disclosure, no hidden costs

### Visual Preferences
- **Clean and minimal:** Avoid cluttered interfaces
- **Card-based layouts:** Popular in US design patterns
- **Bold call-to-action buttons:** Clear primary actions
- **Familiar iconography:** Standard US banking icons

### Trust Indicators
- **Security badges:** SSL, encryption indicators
- **Clear privacy policies:** GDPR-style transparency
- **Customer service access:** Phone numbers, chat support
- **Regulatory compliance:** FDIC, Federal Reserve logos

### Date & Number Formats
- **Dates:** MM/DD/YYYY format
- **Currency:** $1,234.56 format
- **Time:** 12-hour format with AM/PM
- **Phone:** (555) 123-4567 format

---

## Conclusion

This visual wireflow guide provides detailed screen-by-screen layouts for the US Wire Transfer Processing System, with careful attention to:

- **US user expectations:** Familiar patterns and terminology
- **Accessibility:** WCAG 2.1 AA compliance
- **Mobile responsiveness:** Touch-friendly interfaces
- **Cultural relevance:** US-specific design elements
- **Trust & security:** Clear indicators throughout

These wireframes serve as a blueprint for development teams to create a user-friendly, compliant, and culturally appropriate wire transfer system for US users.
