# Project Roadmap & Task Tracking (`TASKS.md`)
**Product:** ZetaERP — Import, Wholesale & Fleet Management System  
**Current Project Status:** Production-Ready Local Desktop & Web ERP (`v1.0.0`, 100% JavaScript, 50/50 Automated Tests Passing, Windows `.exe` Ready)

---

## 1. Completed Milestones (Verified in Codebase)

### Core Infrastructure, Pure JavaScript & Database Hardening
- [x] **TASK-001 (`P0`):** Implement local SQLite database engine using `sql.js` with crash-safe atomic disk writes (`import_business.sqlite.tmp` -> `import_business.sqlite`) and foreign key enforcement (`server/db.js`).
- [x] **TASK-002 (`P0`):** Define and maintain all **24 relational SQLite tables** (`categories`, `products`, `warehouses`, `suppliers`, `customers`, `imports`, `import_items`, `sales`, `sale_items`, `inventory_transactions`, `vehicles`, `vehicle_trips`, `expense_categories`, `expenses`, `employees`, `attendance`, `salary_advances`, `salary_deductions`, `salary_payroll`, `salary_payments`, `daily_labour_payments`, `payments`, `audit_logs`, `settings`) with composite indexes (`server/db.js`).
- [x] **TASK-003 (`P0`):** Implement non-destructive `ALTER TABLE` schema migrations, `ZETA_DATA_DIR` desktop user-data directory resolution, and both **Clean Slate** (`resetDatabaseToClean`) and **Demo Master Data** (`applyRequestedMasterDefaults`) reset workflows (`server/db.js`).
- [x] **TASK-004 (`P0`):** Migrate entire frontend, backend, Electron shell, and build scripts to **100% pure JavaScript** (`.js`, `.jsx`, `.cjs`), removing all TypeScript files and unused legacy artifacts (`DashboardView`, `Header`, `ErpIllustrations`, unused dependencies).

### Desktop UI Shell, Dual-Logo Branding & Executive Home Overview
- [x] **TASK-005 (`P0`):** Build permanent left navigation sidebar (`src/components/ErpSidebar.jsx`) organizing all 14 ERP views into logical operational groups (`Overview`, `Procurement & Stock`, `Sales & Parties`, `Operations & HR`, `Finance & System`).
- [x] **TASK-006 (`P0`):** Redesign `ErpTitleAndMenuBar.jsx` into a clean **two-layer logical desktop header**:
  - **Layer 1 (Top Bar):** Active module title & subtitle + classic desktop menus (`File`, `Edit`, `View`, `Modules`, `Tools`, `Help`) + `Sync`, `Fullscreen`, Electron IPC window controls, and `User` profile menu.
  - **Layer 2 (Secondary Bar):** Quick-action buttons (`+ Import`, `+ New Sale`, `+ Expense`) + `Calculator` + dynamic multi-tab workspace switcher.
- [x] **TASK-007 (`P0`):** Redesign `HomeScreenView.jsx` as a professional **Executive Financial & Operational Overview** (KPI cards, Cash Flow & Profit Trend chart, Receivables vs. Payables summary, Low-Stock & Fleet Utilization panels, and Recent Transactions/Audit feed) with zero duplicate module launcher grids.
- [x] **TASK-008 (`P0`):** Enforce strict **Dual-Logo Separation**:
  - **Immutable App Logo (`src/components/ZetaBrandMark.jsx`):** Uses the official ZetaERP emblem (`/assets/aistudio/Gemini_Generated_Image_d80toed80toed80t_6a689eba.jpeg`) in the sidebar, About modal, browser favicon, and Windows `.exe` icon.
  - **Configurable Business Logo (`settings.business_logo`):** Uploadable/changeable in `SettingsView.jsx` (`Settings -> Branding`) and printed exclusively on A4 Commercial Invoices, 80mm Thermal Receipts, Khata Statements, and PDF Reports (`src/utils/pdfGenerator.js`, `src/components/InvoiceModal.jsx`).

### Operational & Financial Modules
- [x] **TASK-009 (`P0`):** Import Management (`ImportsView.jsx`, `POST /api/imports`) with multi-item cargo calculation, company vs. third-party transport, inline clearing expenses, stock increment, and landed cost per KG calculation.
- [x] **TASK-010 (`P0`):** Overseas Supplier Khata & Statement system (`SuppliersView.jsx`, `SupplierStatementModal.jsx`) with chronological running balance, payment recording (`PAID`/`RECEIVED`), voiding, audit trail, and PDF export.
- [x] **TASK-011 (`P0`):** Local Customer Khata & Statement system (`CustomersView.jsx`, `CustomerStatementModal.jsx`) with chronological running balance, payment receipts (`RECEIVED`/`PAID`), voiding with invoice balance reversal, and PDF export.
- [x] **TASK-012 (`P0`):** Sales & Commercial Invoicing (`SalesView.jsx`, `InvoicesView.jsx`, `InvoiceModal.jsx`) with cumulative multi-row SKU stock validation, A4 Commercial Invoice, and 80mm Thermal Receipt printing.
- [x] **TASK-013 (`P1`):** Fleet Management & Third-Party Haulage Trips (`VehiclesView.jsx`, `/api/vehicle-trips`) tracking freight income, trip expenses, and net trip profit.
- [x] **TASK-014 (`P1`):** HR, Daily Attendance batch entry, Salary Advances/Deductions, Monthly Payroll Sheet generation (with duplicate-month guard), and Daily Labour gang payments (`EmployeesView.jsx`, `PayrollView.jsx`).
- [x] **TASK-015 (`P1`):** Hardened SQLite Backup, JSON Export & Restore engine (`BackupView.jsx`, `/api/backup/*`) with path-traversal protection, `SQLite format 3` header verification, and automatic `Safety_PreRestore` snapshots.

### Bug Fixes, Automated Testing & Windows `.exe` Packaging
- [x] **TASK-101 (`P1` - Resolved):** Aligned line-item field fallbacks (`weight ?? quantity`, `rate_per_kg ?? unit_price`, `amount ?? total_amount`) in `generateInvoicePdf` (`src/utils/pdfGenerator.js`).
- [x] **TASK-102 (`P1` - Resolved):** Updated `GET /api/backup/export-json` (`server/api.js`) to export all **24 active SQLite tables** accurately.
- [x] **TASK-103 (`P1` - Resolved):** Implemented `opening_balance` delta recalculation on `PUT /api/customers/:id` matching supplier ledger behavior, plus cumulative cart stock validation on `POST /api/sales` and balance reversal on `DELETE /api/imports/:id` and `DELETE /api/sales/:id` (`server/api.js`).
- [x] **TASK-104 (`P2` - Resolved):** Aligned all report helper methods in `src/services/api.js` with `GET /api/reports` (`sales`, `imports`, `expenses`, `profit`, `payroll`).
- [x] **TASK-105 (`P2` - Resolved):** Removed all native `window.alert` and `window.confirm` calls across the app in favor of toast banners and custom React confirmation dialogs.
- [x] **TASK-201 (`P1` - Resolved):** Built a comprehensive **50-test Vitest unit & integration suite** across 7 test files (`src/test/*.test.js`, `src/test/*.test.jsx`) covering every React component, modal, utility, Express API endpoint, and SQLite transaction rollback/hardening path.
- [x] **TASK-202 (`P0` - Resolved):** Configured one-command **Windows `.exe` packaging** (`electron-builder.json`, `electron/main.cjs`, `electron/preload.cjs`, `scripts/build.cjs`, `scripts/icon-data.cjs`) generating a 4-layer (`256x256`, `64x64`, `32x32`, `16x16`) `public/icon.ico` and building both `ZetaERP-Setup-1.0.0.exe` (NSIS installer) and `ZetaERP-Portable-1.0.0.exe` (standalone portable `.exe`) in `dist-electron/`.
- [x] **TASK-203 (`P1` - Resolved):** Refined all 7 documentation files in `/docs/` (`PRD.md`, `ARCHITECTURE.md`, `DESIGN.md`, `RULES.md`, `TASKS.md`, `MEMORY.md`, `ERP_SPECIFICATION.md`) to match the verified codebase.

---

## 2. Optional Future Enhancements (Backlog)

- [ ] **TASK-301 (`P3` - Proposed):** Per-Warehouse SKU Stock Breakdown (`warehouse_stock` join table) to track exact stock quantities per individual godown in addition to global `products.current_stock`.
- [ ] **TASK-302 (`P3` - Proposed):** Optional Multi-User Local PIN / Role Lock Screen (`Admin` vs. `Billing Clerk` permissions) for shared warehouse terminals.
- [ ] **TASK-303 (`P3` - Proposed):** Barcode / QR Label Printing (`jsPDF` label sheet generator) for fast SKU scanning at dispatch counters.


