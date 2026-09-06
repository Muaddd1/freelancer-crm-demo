# Freelancer CRM

<<<<<<< HEAD
> Premium client relationship management for freelancers and creative professionals.

**Live Demo:** [https://freelancer-crm-ivory.vercel.app](https://freelancer-crm-ivory.vercel.app)

---

## What is this?

A fully functional CRM built for freelancers — manage clients, projects, invoices, proposals, contracts, and payments from one place.

### Features

- **Dashboard** — Revenue overview, active projects, pending proposals, overdue invoice alerts
- **Clients** — Directory with health scoring, search, filters, and table/card views
- **Projects** — Status tracking, budgets, deadlines, client linking
- **Invoices** — Line items, payment history, record payments, status tracking
- **Proposals** — Dynamic line items, validity tracking
- **Contracts** — Draft → Sent → Signed workflow
- **Settings** — Data export (JSON), dark mode, notification preferences

### Tech Stack

Next.js · Tailwind CSS v4 · Radix UI · React Context · localStorage

---

## Screenshots

### Dashboard
![Dashboard](screenshots/01-dashboard.png)

### Clients
![Clients](screenshots/02-clients.png)

### Client Detail
![Client Detail](screenshots/03-client-detail.png)

### Invoices
![Invoices](screenshots/04-invoices.png)

### Settings
![Settings](screenshots/05-settings.png)

---

## Status

Production-ready. Every button, link, form, and interaction is fully wired.

---

*Built with Next.js, Tailwind CSS, and Radix UI.*
=======
A premium client relationship management system built for freelancers and creative professionals. Track clients, projects, invoices, proposals, contracts, and payments — all in one place.

## Features

- **Dashboard** — Key metrics, active projects, pending proposals, and recent invoices at a glance
- **Clients** — Full client directory with health scoring, search, filters, and multi-view (table/cards)
- **Projects** — Track project status, budget, deadlines, and link to clients
- **Invoices** — Create, send, and track invoices with line items and payment history
- **Proposals** — Create and manage client proposals with dynamic line items
- **Contracts** — Manage contracts with status tracking (Draft → Sent → Signed)
- **Payments** — Record and track payments against invoices
- **Settings** — Profile, business details, notification preferences, and data export

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4
- **UI Primitives:** Radix UI (dropdowns, tabs, tooltips, avatars)
- **Icons:** Lucide React
- **State:** React Context + localStorage persistence
- **Fonts:** Geist (via next/font)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── (shell)/           # Authenticated routes (sidebar + layout)
│   │   ├── dashboard/
│   │   ├── clients/       # List, detail, new client
│   │   ├── projects/      # List, detail, new project
│   │   ├── invoices/      # List, detail, new invoice
│   │   ├── proposals/     # List, detail, new proposal
│   │   ├── contracts/     # List, detail, new contract
│   │   └── settings/
│   ├── layout.tsx         # Root layout (providers)
│   └── page.tsx           # Redirects to /dashboard
├── components/
│   ├── sidebar.tsx
│   └── ui/               # Reusable UI components
└── lib/
    ├── data-context.tsx   # All data + CRUD operations
    ├── toast-context.tsx  # Toast notification system
    └── utils.ts           # Formatting helpers
```

## Data

All data is stored in `localStorage` under the key `freelancer-crm-data`. Seed data is generated on first load. Export your data anytime from **Settings → Data Management → Export**.

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `New Client` button | Opens new client form |
| Client rows | Click to view detail |
| Back arrows | Navigate to parent list |
| Toast auto-dismiss | 4 seconds |

## License

MIT
>>>>>>> 03c8b37 (Initial commit — full CRM build)
