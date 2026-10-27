# UI/UX & Design System Document (`DESIGN.md`)
**Product:** ZetaERP — Import Business Management System  
**Design Paradigm:** Modern Enterprise Windows Desktop ERP (Permanent Left Sidebar + Two-Layer Header + Executive Financial Overview)  
**Styling Engine:** Tailwind CSS v4 (`@import "tailwindcss";`) + Global CSS Variables (`src/index.css`)

---

## 1. Product Design Principles & UX Goals

1. **Permanent Module Rail (`ErpSidebar.jsx`):**
   - A permanent left navigation rail keeps all 15 operational modules plus pinned `System Settings` one click away at all times without hidden "More" drawers or disorienting layout shifts.
   - Top brand header features balanced top and left spacing around the fixed **ZetaERP** emblem (`ZetaBrandMark.jsx`) for crisp visual hierarchy.
2. **Two-Layer Logical Header (`ErpTitleAndMenuBar.jsx`):**
   - **Layer 1 (Top Context & Session Bar):** Displays the active module title, subtitle/breadcrumb context on the left, and business identity badge, offline SQLite status, fullscreen/expand toggle, and user profile menu on the right.
   - **Layer 2 (Menu & Quick Action Bar):** Groups desktop dropdown menus (`File`, `Edit`, `View`, `Modules`, `Tools`, `Help`) on the left and high-frequency workflow triggers (`+ Import`, `+ New Sale`, `Calculator`, `Sync`) on the right, followed by closable MDI module tabs.
3. **One-Glance Executive Home Screen (`HomeScreenView.jsx`):**
   - Focuses 100% on clear business health rather than repeating the sidebar's module links.
   - Displays **6 primary financial KPI cards** (`Total Income / Sales`, `Total Expenses & Outflow`, `Estimated Net Profit`, `Receivable from Customers`, `Payable to Suppliers`, `Current Stock Valuation`), period filters, cashflow breakdown, 6-month trend chart, recent sales/imports, and low-stock alerts.
4. **Dual-Logo Separation:**
   - **App Logo (`ZetaBrandMark.jsx`):** Permanent ZetaERP brand emblem in the application shell and Windows `.exe` icon.
   - **Business Logo (`settings.business_logo`):** User-configurable company logo in **Settings**, printed exclusively on Commercial Invoices, Money Receipts, Khata Statements, and PDF reports.
5. **Non-Blocking Desktop Dialogs:**
   - Zero `window.alert` or `window.confirm` browser popups; destructive actions use inline two-step `Confirm / Cancel` controls and structured modal dialogs.

---

## 2. Verified Color Palette & Design Tokens

### 2.1 CSS Custom Properties (`src/index.css`)
```css
:root {
  --erp-primary-dark: #0f172a;  /* Slate 900 - Primary headers, active buttons, dark accents */
  --erp-primary: #1e293b;       /* Slate 800 - Secondary dark surfaces & hover states */
  --erp-primary-light: #334155; /* Slate 700 - Table headers, icons, secondary text */
  --erp-accent: #1e293b;        /* Slate 800 - Unified enterprise accent */
  --erp-canvas: #f1f5f9;        /* Slate 100 - Global workspace background canvas */
  --erp-border: #cbd5e1;        /* Slate 300 - Crisp 1px card, table, and input borders */
}
```

### 2.2 Surface & Semantic Tokens
| Token Role | Hex / Tailwind Class | Usage in Codebase |
| :--- | :--- | :--- |
| **Workspace Canvas** | `#f1f5f9` (`bg-[#f1f5f9]`) | Root `<main>` workspace and executive dashboard background |
| **Sidebar Brand & Rail** | `#ffffff` / `border-slate-200` | Permanent `ErpSidebar.jsx` navigation rail and brand header |
| **Header Layer 1 (Top)** | `#ffffff` (`bg-white border-b border-slate-200`) | Active module title, business badge, database status, expand & user controls |
| **Header Layer 2 (Toolbar)** | `#f8fafc` (`bg-slate-50 border-b border-slate-200`) | Classic hover/click menus on left; `+ Import`, `+ New Sale`, `Calculator`, `Sync` on right |
| **Card & Modal Surface** | `#ffffff` (`bg-white`) | KPI cards, analytical charts, data tables, and form modals |
| **Table Header & Zebra Rows** | `#f8fafc` (`bg-slate-50`) | Global `thead tr` and `tbody tr:nth-child(even)` styling |
| **Semantic Positive / Paid** | `emerald-600` / `bg-emerald-50 text-emerald-700` | Total Income, Net Profit, Paid status badges, Money Receipts |
| **Semantic Warning / Partial** | `amber-600` / `bg-amber-50 text-amber-700` | Payables, Partially Paid status badges, Low-Stock warnings |
| **Semantic Danger / Unpaid** | `rose-600` / `bg-rose-50 text-rose-700` | Expenses/Outflow, Unpaid invoices, Voided payment badges, inline delete confirmations |

---

## 3. Typography & Numeric Precision

- **UI Font Family:** `Plus Jakarta Sans` with system sans-serif fallbacks (`Segoe UI`, `Inter`, `sans-serif`).
- **Numeric & Financial Font Family:** `JetBrains Mono` / `tabular-nums` on all `PKR` currency figures, cargo weights (`KG` / `Ton`), invoice/consignment references (`INV-xxxxxx`, `IMP-xxxxxx`), and live sidebar record counters so columns align vertically.
- **Currency & Wording Standard:** Formatted via `formatPKR()` (`en-PK`) and converted into South Asian words (`Crore`, `Lac`, `Thousand`) via `amountToWordsPKR()` on printed vouchers.

---

## 4. Core Shell & Document Components

1. **`ZetaBrandMark.jsx`:** Renders the fixed ZetaERP 3D royal-blue & gold emblem with high-contrast dark slate **ZetaERP** typography (`Enterprise Suite` subtitle) and equalized top/left sidebar margin alignment.
2. **`ErpSidebar.jsx`:** Displays all 15 workspace modules grouped logically with live badge counts and pinned `System Settings` at the bottom.
3. **`ErpTitleAndMenuBar.jsx`:** Two-row logical header separating module/session context (Row 1) from classic menus & quick operational buttons (Row 2), plus closable MDI tabs.
4. **`HomeScreenView.jsx`:** Executive business overview presenting Total Income, Total Expenses, Net Profit, Receivables, Payables, Stock Value, period comparisons, trend charts, and recent activity.
5. **Printable Business Modals (`InvoiceModal.jsx`, `PaymentReceiptModal.jsx`, `CustomerStatementModal.jsx`, `SupplierStatementModal.jsx`):** Inject `settings.business_logo` and `settings.business_name` onto A4 Commercial Invoices, 80mm Thermal Receipts, Official Money Receipts, and Khata Statements, using `window.electronAPI.print()` / `printInvoice()` when running in the Windows `.exe`.

---

## 5. Keyboard Shortcuts (`App.jsx`)

| Shortcut | Action |
| :--- | :--- |
| `F1` | Open `Home Overview` (`home`) |
| `F5` | Sync / refresh all datasets from local SQLite (`loadAllData()`) |
| `Alt + 1` | Open `Import Management` (`imports`) |
| `Alt + 2` | Open `Sales & POS` (`sales`) |
| `Alt + C` | Open `Landed Cost & Desktop Calculator` (`ErpCalculatorModal`) |

