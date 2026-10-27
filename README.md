
# ZetaERP — Import, Wholesale & Fleet Management System

Offline-first desktop and web ERP built in **100% pure JavaScript** (`React 19`, `Express`, `sql.js` SQLite, and `Electron`) for international import consignments, multi-godown inventory, commercial billing, Supplier/Customer Khata ledgers, fleet haulage trips, employee payroll, and financial reporting.

---

## Quick Start (Development & Web Mode)

```bash
# 1. Install dependencies
npm install

# 2. Start local Express + Vite server on http://localhost:3000
npm run dev
```

---

## Building the Windows `.exe` Desktop Application

When you download this project on **Windows 10 / Windows 11 (x64)**:

```bash
# 1. Install dependencies
npm install

# 2. Build Windows .exe packages (generates icon.ico, Vite bundle, and Electron executables)
npm run build
# (or explicitly on any platform: npm run build:exe)
```

Both executables are created automatically inside the **`dist-electron/`** folder:
1. **`ZetaERP-Setup-1.0.0.exe`** — Full Windows NSIS Installer (custom install folder, Desktop & Start Menu shortcuts; preserves `%APPDATA%\ZetaERP` database across updates).
2. **`ZetaERP-Portable-1.0.0.exe`** — Standalone portable Windows `.exe` (runs immediately with zero installation).

---

## Testing & Verification

```bash
# Run all 50 automated unit, component, API, and SQLite tests (Vitest)
npm test

# Validate syntax and workspace cleanliness
npm run lint
```

---

## Dual-Logo Architecture

- **App Logo (Immutable Software Identity):** Rendered by `src/components/ZetaBrandMark.jsx` in the permanent left sidebar, About modal, browser favicon, and Windows `.exe` icon (`public/icon.ico`). Users cannot modify the ZetaERP software brand.
- **Business Logo (Configurable Company Logo):** Uploadable in **`Settings -> Branding`** (`settings.business_logo`). Used exclusively on printed and exported business documents: A4 Commercial Invoices, 80mm Thermal Receipts, Customer/Supplier Khata Statements, and PDF Reports.

---

## Documentation (`/docs`)

- [`docs/PRD.md`](docs/PRD.md) — Product Requirements, Personas, Functional Scope & Branding Rules
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — System Architecture, File Tree, Electron `.exe` Pipeline & API Map
- [`docs/DESIGN.md`](docs/DESIGN.md) — UI/UX Design System, Permanent Sidebar, Two-Layer Header & Print Layouts
- [`docs/ERP_SPECIFICATION.md`](docs/ERP_SPECIFICATION.md) — Module-by-Module Specification, Test Suite & Exact SQLite DDL
- [`docs/RULES.md`](docs/RULES.md) — Engineering Standards, Pure JavaScript Rules & Financial Integrity Invariants
- [`docs/TASKS.md`](docs/TASKS.md) — Completed Milestones, Resolved Audits & Optional Future Backlog
- [`docs/MEMORY.md`](docs/MEMORY.md) — Verified Codebase Reference & Key Architectural Decisions
