# Freelancer CRM — Project Guidelines

## Stack

- **Next.js 16** with App Router — route groups `(shell)` wrap all authenticated pages
- **Tailwind CSS v4** — `@theme` inline syntax, no `tailwind.config.ts`
- **TypeScript** — strict mode
- **Radix UI** primitives — dropdown-menu, tabs, tooltip, avatar
- **localStorage** for all data persistence (key: `freelancer-crm-data`)

## Architecture

- `src/lib/data-context.tsx` — single source of truth; all CRUD ops, seed data, `useData` hook
- `src/lib/toast-context.tsx` — toast notifications; `useToast` hook
- `src/components/sidebar.tsx` — collapsible sidebar; active route indicators; dark mode toggle
- `src/components/ui/` — reusable UI primitives (button, badge, input, dialog, tabs, etc.)

## Routes

| Route | Purpose |
|-------|---------|
| `/` | Redirects to `/dashboard` |
| `/dashboard` | Metrics, active projects, pending proposals, recent invoices |
| `/clients` | Client list with search, filters, table/card views |
| `/clients/new` | New client form |
| `/clients/[id]` | Client detail with tabs (Projects, Invoices, Proposals, Contracts, Payments, Messages) |
| `/projects` | Project list with status filters |
| `/projects/new` | New project form (accepts `?client=` query param for pre-selection) |
| `/projects/[id]` | Project detail |
| `/invoices` | Invoice list with status filters and stats |
| `/invoices/new` | New invoice form (accepts `?client=` and `?project=` query params) |
| `/invoices/[id]` | Invoice detail with line items, payment history, record payment dialog |
| `/proposals` | Proposal list |
| `/proposals/new` | New proposal form (accepts `?client=` query param) |
| `/proposals/[id]` | Proposal detail |
| `/contracts` | Contract list |
| `/contracts/new` | New contract form (accepts `?client=` query param) |
| `/contracts/[id]` | Contract detail |
| `/settings` | Profile, business details, notifications, data export/clear |

## Client Health Scoring

- `healthy` (≥75) — active project, recent communication, invoices paid on time
- `attention` (45–74) — some concerns, needs follow-up
- `at-risk` (<45) — overdue invoices, no recent communication

## Smart Navigation

All "New X" buttons pre-select the parent context when launched from a detail page:
- **Message** client → pre-fills client context
- **New Invoice** → `?client=<id>`
- **New Proposal** → `?client=<id>`
- **New Project** → `?client=<id>`
- **New Contract** → `?client=<id>`

## Adding New Routes

1. Create the page under `src/app/(shell)/<resource>/`
2. Use `useData()` for all data operations
3. Use `useToast()` for user feedback
4. Use `Dialog` or `ConfirmDialog` for destructive confirmations
5. Follow existing page patterns for form layouts and breadcrumbs

## Styling Conventions

- Card sections: `rounded-xl border bg-card p-5`
- Page headers: `text-2xl font-bold`
- Mutted text: `text-sm text-muted-foreground`
- Tables: spacious rows with `hover:bg-muted/50` transitions
- Buttons: use `Button` component with `variant`, `size` props

## Data Export

Settings → Data Management → Export downloads a JSON snapshot of all localStorage data.
