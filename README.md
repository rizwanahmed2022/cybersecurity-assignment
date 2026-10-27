# Project Rules & Engineering Standards (`RULES.md`)
**System:** ZetaERP — Import, Wholesale & Fleet Management System  
**Audience:** Human Engineers & Autonomous AI Coding Agents  
**Enforcement Level:** Mandatory

---

## 1. Codebase Inspection & Pre-Modification Rules

1. **Pure JavaScript Codebase (`RULE-LANG-01`):**
   - ZetaERP is written **100% in JavaScript** (`.js`, `.jsx`, `.cjs`).
   - Do **NOT** introduce TypeScript files (`.ts`, `.tsx`), `tsconfig.json`, `tsx`, or TypeScript type annotations anywhere in the repository.
2. **Read Before Writing (`RULE-INSPECT-01`):**
   - Always inspect the target file (`view_file`) before modifying any React component (`src/components/*.jsx`), client service (`src/services/api.js`), Express route (`server/api.js`), or database function (`server/db.js`).
3. **Verify End-to-End Impact (`RULE-INSPECT-02`):**
   - Any change to a database column in `server/db.js` MUST be traced through:
     1. `createSchema()` and non-destructive `ALTER TABLE` migrations in `server/db.js`.
     2. SQL queries and payload validation in `server/api.js`.
     3. Client methods in `src/services/api.js`.
     4. Consuming React views (`src/components/*.jsx`) and PDF generators (`src/utils/pdfGenerator.js`).
     5. Vitest test coverage (`src/test/*.test.js` / `*.test.jsx`).
4. **Preserve Shell & Branding Architecture (`RULE-INSPECT-03`):**
   - **Permanent Left Sidebar (`src/components/ErpSidebar.jsx`):** Keep the fixed `w-56` navy sidebar (`#0f172a`) with grouped navigation for all 14 system views. Do not replace it with a Home-screen module launcher grid.
   - **Two-Layer Top Header (`src/components/ErpTitleAndMenuBar.jsx`):**
     - **Layer 1 (Top Application Bar):** Active module title + description on the left; classic desktop menu bar (`File`, `Edit`, `View`, `Modules`, `Tools`, `Help`) in the center/right; system utilities (`Sync`, `Fullscreen`, `Electron Window Controls`, `Admin Profile`) on the far right.
     - **Layer 2 (Secondary Action & Workspace Bar):** Quick-create operational buttons (`+ Import`, `+ New Sale`, `+ Expense`) and `Calculator` on the left; open workspace tabs (`Home` + dynamic module tabs) on the right.
   - **Strict Dual-Logo Separation (`RULE-BRAND-01`):**
     - **App Logo (Immutable Software Identity):** Rendered by `src/components/ZetaBrandMark.jsx` using `/assets/aistudio/Gemini_Generated_Image_d80toed80toed80t_6a689eba.jpeg` in the sidebar, About dialog, favicon, and Windows `.exe` icon. Users **cannot** change the App Logo.
     - **Business Logo (Configurable Company Logo):** Stored in `settings.business_logo` and editable in `SettingsView.jsx` (`Settings -> Branding`). Used **exclusively** on printed/exported business documents (A4 Commercial Invoices, 80mm Thermal Receipts, Supplier/Customer Khata Statements, and PDF Reports) via `src/utils/pdfGenerator.js` and `src/components/InvoiceModal.jsx`.

---

## 2. Coding, Naming & File-Organization Conventions

### 2.1 File & Directory Structure
- **Frontend Views:** Place top-level module views in `src/components/<ModuleName>View.jsx` (PascalCase, e.g., `ImportsView.jsx`, `SuppliersView.jsx`, `HomeScreenView.jsx`).
- **Modals & Shell Components:** Place modal and shell components in `src/components/<ComponentName>.jsx` (e.g., `ErpSidebar.jsx`, `ErpTitleAndMenuBar.jsx`, `ZetaBrandMark.jsx`, `InvoiceModal.jsx`, `PaymentReceiptModal.jsx`, `CustomerStatementModal.jsx`, `SupplierStatementModal.jsx`, `SimpleFormDialog.jsx`).
- **Formatting & PDF Utilities:**
  - `src/utils/formatters.js` (`formatPKR`, `formatWeight`, `formatDate`, `formatTime`, `amountToWordsPKR`) for all currency, weight, and date formatting.
  - `src/utils/pdfGenerator.js` for jsPDF document generation (`generateInvoicePdf`, `generateReceiptPdf`, `generateReportPdf`, `generateCustomerStatementPdf`, `generateSupplierStatementPdf`).
- **Backend & Electron Runtime:**
  - `server.js`: Express HTTP entry point + Vite dev middleware + production static bundle serving.
  - `server/db.js`: SQLite (`sql.js`) engine, 24-table DDL, safe migrations, atomic disk persistence, and `ZETA_DATA_DIR` resolution.
  - `server/api.js`: Express REST router mounted at `/api`.
  - `electron/main.cjs` & `electron/preload.cjs`: Electron desktop main process, embedded Express server lifecycle, and secure `contextBridge` IPC (`window.electronAPI`).
  - `scripts/build.cjs`, `scripts/clean.cjs`, `scripts/icon-data.cjs`: Build pipeline, multi-resolution Windows `.ico` generator, syntax checker, and Windows `.exe` packaging orchestrator.

### 2.2 Naming Conventions
- **Database Columns & API JSON Fields:** Use `snake_case` (e.g., `total_purchase_amount`, `rate_per_kg`, `payment_direction`, `balance_before`, `balance_after`, `business_logo`).
- **React Variables, Functions & Props:** Use `camelCase` (e.g., `handleNavigate`, `loadAllData`, `onRefresh`).
- **Database Discriminator Constants:** Use `UPPER_SNAKE_CASE` (`'COMPANY' | 'THIRD_PARTY' | 'NONE'`, `'RECEIVED' | 'PAID'`, `'ACTIVE' | 'VOID'`, `'VEHICLE' | 'LABOUR' | 'OTHER'`).
- **Document Reference Prefixes:**
  - Products: `PRD-xxxx`
  - Warehouses: `WH-xxxx`
  - Suppliers: `SUP-xxxx`
  - Customers: `CUST-xxxx`
  - Employees: `EMP-xxxx`
  - Imports: `IMP-xxxxxx`
  - Sales Invoices: `INV-xxxxxx`
  - Vehicle Trips: `TRP-xxxxxx`
  - Payment Transactions: `TRX-YYYYMMDD-XXXX`

---

## 3. Database & Data-Model Modification Rules

1. **Backward-Compatible Schema Migrations (`RULE-DB-01`):**
   - `import_business.sqlite` persists across sessions (in project root during web dev or `%APPDATA%\ZetaERP` in packaged Windows `.exe` builds via `process.env.ZETA_DATA_DIR`).
   - Using `CREATE TABLE IF NOT EXISTS` alone will NOT add new columns to an existing `.sqlite` file. Every new column added to an existing table MUST also include a safe `try { db.run("ALTER TABLE <table> ADD COLUMN <col_def>;"); } catch (e) {}` block in `createSchema()` (`server/db.js`).
2. **Atomic Transactions (`RULE-DB-02`):**
   - Any endpoint that modifies more than one table (or updates a balance/stock alongside inserting a record) MUST wrap all SQL statements in a transaction (`BEGIN TRANSACTION;` ... `COMMIT;` / `ROLLBACK;`) and flush via `saveDbToDisk()`.
3. **Atomic Crash-Safe Disk Persistence (`RULE-DB-03`):**
   - Always persist mutations through `saveDbToDisk()` in `server/db.js`, which writes to a temporary file (`import_business.sqlite.tmp`) and atomically renames it over `import_business.sqlite` so power loss never corrupts the database.
4. **Parameterized Queries & Path Security (`RULE-DB-04`):**
   - Always pass user-supplied values as bound parameters (`?` with `params` array). Never interpolate user input directly into SQL strings.
   - All backup filename endpoints (`/api/backup/download/:filename`, `/api/backup/restore/:filename`, `/api/backup/delete/:filename`) MUST validate filenames against path traversal (`path.basename(filename) === filename` and `.sqlite` suffix) and verify the 16-byte `SQLite format 3\0` header before restoring.
5. **Financial Record Preservation & Soft Deletion (`RULE-DB-05`):**
   - Never hard-delete master records (`products`, `suppliers`, `customers`, `warehouses`, `vehicles`) that have linked financial or inventory transactions; set `is_active = 0` or block deletion with a clear validation message.
   - Never hard-delete Khata payments; use the void workflow (`POST /api/payments/:id/void`) so `status = 'VOID'`, `void_reason`, reversed balances, and `audit_logs` are preserved.

---

## 4. Business Logic & Financial Integrity Rules

1. **Single-Currency Standard (`RULE-FIN-01`):**
   - All financial amounts in the database and UI are strictly in Pakistani Rupees (`PKR`), formatted via `formatPKR()`.
2. **Party Balance Accounting (`RULE-FIN-02`):**
   - **Suppliers (`suppliers.current_balance`):** Net payable owed TO the supplier.
     - Recording an Import (`POST /api/imports`) increases `current_balance` by `total_purchase_amount`.
     - Editing a Supplier's `opening_balance` adjusts `current_balance` by `(new_opening - old_opening)`.
     - Paying a Supplier (`payment_direction = 'PAID'`) decreases `current_balance`.
     - Receiving a refund from a Supplier (`payment_direction = 'RECEIVED'`) increases `current_balance`.
   - **Customers (`customers.current_balance`):** Net receivable owed BY the customer.
     - Recording a Sale (`POST /api/sales`) increases `current_balance` by `remaining_amount` (`grand_total - paid_amount`).
     - Editing a Customer's `opening_balance` adjusts `current_balance` by `(new_opening - old_opening)`.
     - Receiving money from a Customer (`payment_direction = 'RECEIVED'`) decreases `current_balance` (and updates linked invoice `paid_amount` / `remaining_amount` / `payment_status` when `reference_id` is supplied).
     - Paying/refunding a Customer (`payment_direction = 'PAID'`) increases `current_balance`.
3. **Stock Synchronization & Over-Selling Prevention (`RULE-FIN-03`):**
   - `POST /api/sales` MUST validate cumulative SKU weights across all line items in the cart (preventing duplicate-SKU rows in the same invoice from bypassing stock checks) before deducting `products.current_stock`.
   - Every change to `products.current_stock` MUST simultaneously insert a corresponding row in `inventory_transactions` (`'INITIAL'`, `'IMPORT'`, `'SALE'`, or `'ADJUSTMENT'`).

---

## 5. UI Consistency & Environment Rules

1. **Unified Enterprise Slate & Navy Theme (`RULE-UI-01`):**
   - Sidebar (`ErpSidebar.jsx`): Deep slate navy `bg-[#0f172a]` with subtle metallic gold/blue brand accents.
   - Workspace background: `bg-[#f1f5f9]` (`slate-100`).
   - Primary cards & panels: `bg-white border border-slate-200/300` with clean tabular typography.
   - Zero native `window.alert`, `window.confirm`, or `window.prompt` calls anywhere in React components (use toast notifications and custom modal confirmations so both sandboxed web previews and Electron desktop windows behave identically).
2. **Iframe & Desktop PDF Compatibility (`RULE-UI-02`):**
   - In `src/utils/pdfGenerator.js`, always maintain safe blob/download and hidden `iframe` print fallbacks so PDF printing and saving work seamlessly in both browser previews and packaged Electron `.exe` builds.

---

## 6. Build, Packaging & Verification Rules

1. **Port & Runtime Flexibility (`RULE-ENV-01`):**
   - In web development (`npm run dev`), `server.js` listens on port `3000` (`0.0.0.0`).
   - When imported by `electron/main.cjs` in the packaged desktop app (`ZETA_ELECTRON=1`), `startServer(0, '127.0.0.1')` binds to an ephemeral local port and stores data in `app.getPath('userData')` (`%APPDATA%\ZetaERP`).
2. **Windows `.exe` Packaging Readiness (`RULE-BUILD-01`):**
   - Keep `electron-builder.json` and `scripts/build.cjs` synchronized so running `npm run build -- --win` or `npm run build:exe` on Windows produces both `ZetaERP-Setup-1.0.0.exe` (NSIS installer) and `ZetaERP-Portable-1.0.0.exe` (standalone portable `.exe`) in `dist-electron/`.
   - Ensure `node_modules/sql.js/dist/sql-wasm.wasm` remains unpacked (`asarUnpack` in `electron-builder.json`) so `locateFile` in `server/db.js` resolves the WebAssembly binary inside packaged `.exe` builds.

---

## 7. Mandatory Completion Checklist

Before concluding any coding turn that modifies application code, verify:

- [ ] **1. Pure JavaScript Check:** Zero `.ts` or `.tsx` files added or referenced.
- [ ] **2. Schema & Migration Check:** New columns in `server/db.js` include safe `ALTER TABLE` migrations and are included in `/api/backup/export-json` if a new table was added.
- [ ] **3. Transaction & Atomic Save Check:** Multi-table writes use `BEGIN TRANSACTION` / `COMMIT` / `ROLLBACK` and call `saveDbToDisk()`.
- [ ] **4. Dual-Logo Check:** App Logo (`ZetaBrandMark.jsx`) remains immutable; `settings.business_logo` is used only on business documents/PDFs.
- [ ] **5. Automated Verification:** Run `npm test` (50 Vitest unit & integration tests), `npm run lint` (`node scripts/clean.cjs`), and `npm run build` (`compile_applet`) with zero errors.

