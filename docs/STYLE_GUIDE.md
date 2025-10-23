# Payment Health Dashboard - Design System & Style Guide

## Overview

This style guide documents the design system for the Payment Health Dashboard application, built with Next.js, Tailwind CSS v4, and Shadcn UI components. It provides a comprehensive reference for maintaining visual consistency across the application.

---

## Table of Contents

1. [Color Palette](#color-palette)
2. [Typography](#typography)
3. [Spacing & Layout](#spacing--layout)
4. [Components](#components)
5. [Patterns & Best Practices](#patterns--best-practices)

---

## Color Palette

### Design Tokens

The application uses CSS custom properties (design tokens) defined in `app/globals.css` for consistent theming across light and dark modes.

#### Light Mode Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `oklch(1 0 0)` | Main background color (white) |
| `--foreground` | `oklch(0.145 0 0)` | Primary text color (near black) |
| `--card` | `oklch(1 0 0)` | Card background (white) |
| `--card-foreground` | `oklch(0.145 0 0)` | Card text color |
| `--primary` | `oklch(0.205 0 0)` | Primary brand color (dark gray/black) |
| `--primary-foreground` | `oklch(0.985 0 0)` | Text on primary background |
| `--secondary` | `oklch(0.97 0 0)` | Secondary background (light gray) |
| `--muted` | `oklch(0.97 0 0)` | Muted background |
| `--muted-foreground` | `oklch(0.556 0 0)` | Muted text color |
| `--accent` | `oklch(0.97 0 0)` | Accent background |
| `--destructive` | `oklch(0.577 0.245 27.325)` | Error/destructive actions (red) |
| `--border` | `oklch(0.922 0 0)` | Border color (light gray) |
| `--input` | `oklch(0.922 0 0)` | Input border color |
| `--ring` | `oklch(0.708 0 0)` | Focus ring color |

#### Dark Mode Colors

Dark mode automatically applies when the `.dark` class is present on a parent element.

| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `oklch(0.145 0 0)` | Main background (dark) |
| `--foreground` | `oklch(0.985 0 0)` | Primary text (light) |
| `--primary` | `oklch(0.985 0 0)` | Primary brand (inverted) |
| `--secondary` | `oklch(0.269 0 0)` | Secondary background (dark gray) |
| `--muted` | `oklch(0.269 0 0)` | Muted background (dark gray) |
| `--muted-foreground` | `oklch(0.708 0 0)` | Muted text |
| `--border` | `oklch(0.269 0 0)` | Border color (dark gray) |

#### Semantic Colors

Used for status indicators and feedback:

\`\`\`css
/* Success/Healthy */
bg-green-500, text-green-600, border-green-200, bg-green-50

/* Warning/Degraded */
bg-yellow-500, text-yellow-600, bg-amber-50, text-amber-600

/* Error/Critical */
bg-red-500, text-red-600, border-red-200, bg-red-50

/* Info/Neutral */
bg-blue-500, text-blue-600, border-blue-200, bg-blue-50

/* Inactive/Unknown */
bg-gray-400, text-gray-600, bg-gray-50
\`\`\`

#### Chart Colors

Defined for data visualization consistency:

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `--chart-1` | `oklch(0.646 0.222 41.116)` | `oklch(0.488 0.243 264.376)` | Primary chart color |
| `--chart-2` | `oklch(0.6 0.118 184.704)` | `oklch(0.696 0.17 162.48)` | Secondary chart color |
| `--chart-3` | `oklch(0.398 0.07 227.392)` | `oklch(0.769 0.188 70.08)` | Tertiary chart color |
| `--chart-4` | `oklch(0.828 0.189 84.429)` | `oklch(0.627 0.265 303.9)` | Quaternary chart color |
| `--chart-5` | `oklch(0.769 0.188 70.08)` | `oklch(0.645 0.246 16.439)` | Quinary chart color |

### Usage Guidelines

**DO:**
- Use semantic design tokens (`bg-background`, `text-foreground`, etc.)
- Use semantic color classes for status indicators
- Maintain consistent color meanings across the app

**DON'T:**
- Use arbitrary color values like `bg-[#ffffff]`
- Mix semantic and direct color classes inconsistently
- Use colors that don't meet WCAG AA contrast requirements

---

## Typography

### Font Families

The application uses the Geist font family from Vercel:

\`\`\`typescript
// app/layout.tsx
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
\`\`\`

**Font Variables:**
- `--font-sans`: Geist Sans (default body font)
- `--font-mono`: Geist Mono (code and monospace text)

**Tailwind Classes:**
- `font-sans` - Apply Geist Sans
- `font-mono` - Apply Geist Mono

### Font Sizes

Tailwind's default scale is used with semantic sizing:

| Class | Size | Usage |
|-------|------|-------|
| `text-xs` | 0.75rem (12px) | Small labels, captions, metadata |
| `text-sm` | 0.875rem (14px) | Body text, descriptions, secondary content |
| `text-base` | 1rem (16px) | Default body text |
| `text-lg` | 1.125rem (18px) | Subheadings, emphasized text |
| `text-xl` | 1.25rem (20px) | Section headings |
| `text-2xl` | 1.5rem (24px) | Page headings, KPI values |
| `text-3xl` | 1.875rem (30px) | Main page titles |

### Font Weights

| Class | Weight | Usage |
|-------|--------|-------|
| `font-normal` | 400 | Body text |
| `font-medium` | 500 | Emphasized text, labels |
| `font-semibold` | 600 | Subheadings, card titles |
| `font-bold` | 700 | Headings, important metrics |

### Line Height

| Class | Value | Usage |
|-------|-------|-------|
| `leading-none` | 1 | Tight headings |
| `leading-tight` | 1.25 | Headings |
| `leading-normal` | 1.5 | Body text |
| `leading-relaxed` | 1.625 | Comfortable reading |

### Typography Patterns

**Page Titles:**
\`\`\`tsx
<h1 className="text-3xl font-bold text-gray-900">
  Payment Health Dashboard
</h1>
\`\`\`

**Section Headings:**
\`\`\`tsx
<h2 className="text-xl font-semibold text-gray-800">
  US Wires Transaction Flow
</h2>
\`\`\`

**Card Titles:**
\`\`\`tsx
<CardTitle className="text-sm font-medium">
  System Status
</CardTitle>
\`\`\`

**Body Text:**
\`\`\`tsx
<p className="text-sm text-gray-600">
  Monitor real-time payment processing
</p>
\`\`\`

**Muted Text:**
\`\`\`tsx
<span className="text-muted-foreground text-xs">
  Last updated: 2:30 PM
</span>
\`\`\`

---

## Spacing & Layout

### Spacing Scale

The application uses Tailwind's default spacing scale (4px base unit):

| Class | Value | Common Usage |
|-------|-------|--------------|
| `p-1`, `m-1` | 0.25rem (4px) | Tight spacing |
| `p-2`, `m-2` | 0.5rem (8px) | Small gaps |
| `p-3`, `m-3` | 0.75rem (12px) | Compact spacing |
| `p-4`, `m-4` | 1rem (16px) | Default spacing |
| `p-6`, `m-6` | 1.5rem (24px) | Card padding, section spacing |
| `p-8`, `m-8` | 2rem (32px) | Large spacing |
| `p-12`, `m-12` | 3rem (48px) | Section separation |

### Gap Utilities

For flexbox and grid layouts:

\`\`\`tsx
// Flex with gap
<div className="flex gap-2">...</div>
<div className="flex gap-4">...</div>
<div className="flex gap-6">...</div>

// Grid with gap
<div className="grid gap-4 md:grid-cols-2">...</div>
\`\`\`

### Border Radius

Defined by the `--radius` token (0.625rem = 10px):

| Class | Value | Usage |
|-------|-------|-------|
| `rounded-sm` | `calc(var(--radius) - 4px)` | Small radius (6px) |
| `rounded-md` | `calc(var(--radius) - 2px)` | Medium radius (8px) |
| `rounded-lg` | `var(--radius)` | Default radius (10px) |
| `rounded-xl` | `calc(var(--radius) + 4px)` | Large radius (14px) |
| `rounded-2xl` | 1rem (16px) | Extra large radius |
| `rounded-full` | 9999px | Circular elements |

### Layout Patterns

**Container:**
\`\`\`tsx
<div className="container mx-auto px-4 py-8">
  {/* Content */}
</div>
\`\`\`

**Card Layout:**
\`\`\`tsx
<Card className="p-6 gap-6">
  <CardHeader>...</CardHeader>
  <CardContent>...</CardContent>
</Card>
\`\`\`

**Grid Layout:**
\`\`\`tsx
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
  {/* Grid items */}
</div>
\`\`\`

**Flex Layout:**
\`\`\`tsx
<div className="flex items-center justify-between gap-4">
  {/* Flex items */}
</div>
\`\`\`

---

## Components

### Buttons

**Variants:**

\`\`\`tsx
// Default (Primary)
<Button variant="default">Primary Action</Button>

// Secondary
<Button variant="secondary">Secondary Action</Button>

// Outline
<Button variant="outline">Outline Button</Button>

// Destructive
<Button variant="destructive">Delete</Button>

// Ghost
<Button variant="ghost">Ghost Button</Button>

// Link
<Button variant="link">Link Button</Button>
\`\`\`

**Sizes:**

\`\`\`tsx
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Icon /></Button>
\`\`\`

**States:**
- Default: `bg-primary text-primary-foreground`
- Hover: `hover:bg-primary/90`
- Focus: `focus-visible:ring-ring/50 focus-visible:ring-[3px]`
- Disabled: `disabled:opacity-50 disabled:pointer-events-none`
- Invalid: `aria-invalid:border-destructive aria-invalid:ring-destructive/20`

### Cards

**Structure:**

\`\`\`tsx
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description text</CardDescription>
    <CardAction>
      {/* Optional action button */}
    </CardAction>
  </CardHeader>
  <CardContent>
    {/* Main content */}
  </CardContent>
  <CardFooter>
    {/* Footer actions */}
  </CardFooter>
</Card>
\`\`\`

**Styling:**
- Background: `bg-card`
- Border: `border rounded-xl`
- Shadow: `shadow-sm`
- Padding: `py-6` (vertical), `px-6` (horizontal in sections)
- Gap: `gap-6` (between sections)

### Inputs

**Basic Input:**

\`\`\`tsx
<Input
  type="text"
  placeholder="Enter text..."
  className="w-full"
/>
\`\`\`

**States:**
- Default: `border-input bg-transparent`
- Focus: `focus-visible:border-ring focus-visible:ring-ring/50`
- Invalid: `aria-invalid:border-destructive aria-invalid:ring-destructive/20`
- Disabled: `disabled:opacity-50 disabled:cursor-not-allowed`

**Styling:**
- Height: `h-9`
- Padding: `px-3 py-1`
- Border: `border rounded-md`
- Shadow: `shadow-xs`
- Text: `text-base md:text-sm`

### Status Indicators

**Color Coding:**

\`\`\`tsx
// Healthy/Success
<div className="flex items-center gap-2">
  <div className="h-3 w-3 rounded-full bg-green-500" />
  <span className="text-foreground">Healthy</span>
</div>

// Warning/Degraded
<div className="flex items-center gap-2">
  <div className="h-3 w-3 rounded-full bg-yellow-500" />
  <span className="text-foreground">Degraded</span>
</div>

// Error/Critical
<div className="flex items-center gap-2">
  <div className="h-3 w-3 rounded-full bg-red-500" />
  <span className="text-foreground">Critical</span>
</div>

// Unknown/Inactive
<div className="flex items-center gap-2">
  <div className="h-3 w-3 rounded-full bg-gray-400" />
  <span className="text-foreground">Unknown</span>
</div>
\`\`\`

### Badges

**Status Badges:**

\`\`\`tsx
<Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
  Active
</Badge>

<Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
  Warning
</Badge>

<Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
  Error
</Badge>
\`\`\`

### Loading States

**Spinner:**

\`\`\`tsx
<Loader2 className="h-4 w-4 animate-spin text-blue-500" />
\`\`\`

**Skeleton:**

\`\`\`tsx
<div className="animate-pulse">
  <div className="h-4 bg-gray-200 rounded w-3/4" />
  <div className="h-3 bg-gray-200 rounded w-1/2 mt-2" />
</div>
\`\`\`

---

## Patterns & Best Practices

### Responsive Design

**Mobile-First Approach:**

\`\`\`tsx
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
  {/* Responsive grid */}
</div>
\`\`\`

**Breakpoints:**
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Accessibility

**Focus States:**
- Always include visible focus indicators
- Use `focus-visible:ring-ring/50 focus-visible:ring-[3px]`

**ARIA Attributes:**
\`\`\`tsx
<button aria-label="Close dialog">
  <X className="h-4 w-4" />
</button>

<input aria-invalid={hasError} aria-describedby="error-message" />
\`\`\`

**Semantic HTML:**
- Use proper heading hierarchy (`h1` → `h2` → `h3`)
- Use `<button>` for actions, `<a>` for navigation
- Use semantic elements (`<nav>`, `<main>`, `<section>`, `<article>`)

### Shadow System

\`\`\`css
shadow-xs   /* Subtle elevation */
shadow-sm   /* Small elevation */
shadow-md   /* Medium elevation */
shadow-lg   /* Large elevation */
shadow-xl   /* Extra large elevation */
shadow-2xl  /* Maximum elevation */
\`\`\`

### Animation

**Transitions:**
\`\`\`tsx
className="transition-all duration-200"
className="transition-colors"
className="transition-transform hover:scale-105"
\`\`\`

**Animations:**
\`\`\`tsx
className="animate-pulse"    /* Pulsing effect */
className="animate-spin"     /* Spinning (loading) */
className="animate-in fade-in slide-in-from-top-2"  /* Enter animation */
\`\`\`

### Icon Usage

**Size Guidelines:**
- Small icons: `h-3 w-3` or `h-4 w-4`
- Default icons: `h-5 w-5`
- Large icons: `h-6 w-6` or `h-8 w-8`

**Color:**
- Match text color: `text-current`
- Semantic colors: `text-green-600`, `text-red-600`, etc.
- Muted: `text-muted-foreground`

### Form Validation

**Error States:**

\`\`\`tsx
<div>
  <Input
    aria-invalid={hasError}
    className={hasError ? 'border-red-500' : ''}
  />
  {hasError && (
    <p className="text-sm font-medium text-red-500 mt-1">
      {errorMessage}
    </p>
  )}
</div>
\`\`\`

### Data Visualization

**KPI Cards:**

\`\`\`tsx
<Card>
  <CardHeader>
    <CardTitle className="text-sm font-medium">Metric Name</CardTitle>
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
      <Icon className="h-4 w-4 text-green-600" />
    </div>
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">{value}</div>
    <p className="text-muted-foreground text-xs">Description</p>
  </CardContent>
</Card>
\`\`\`

**Status Colors:**
- Green: Healthy, success, positive metrics
- Yellow/Amber: Warning, degraded, attention needed
- Red: Critical, error, failure
- Blue: Info, neutral, processing
- Gray: Unknown, inactive, disabled

---

## File Structure

\`\`\`
src/
├── components/
│   ├── ui/              # Shadcn UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   └── ...
├── domains/
│   └── payment-health/
│       ├── components/  # Feature-specific components
│       ├── containers/  # Page-level containers
│       └── ...
├── lib/
│   └── utils.ts        # Utility functions (cn, etc.)
└── app/
    ├── globals.css     # Global styles & design tokens
    └── layout.tsx      # Root layout with fonts
\`\`\`

---

## Quick Reference

### Common Class Combinations

**Card with hover effect:**
\`\`\`tsx
className="rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md"
\`\`\`

**Flex center:**
\`\`\`tsx
className="flex items-center justify-center"
\`\`\`

**Flex between:**
\`\`\`tsx
className="flex items-center justify-between"
\`\`\`

**Grid responsive:**
\`\`\`tsx
className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
\`\`\`

**Text truncate:**
\`\`\`tsx
className="truncate"
className="line-clamp-2"
\`\`\`

**Absolute center:**
\`\`\`tsx
className="absolute inset-0 flex items-center justify-center"
\`\`\`

---

## Maintenance

This style guide should be updated when:
- New design tokens are added
- Component variants are created
- Design patterns evolve
- Accessibility requirements change

For questions or suggestions, please refer to the design system documentation or contact the design team.
