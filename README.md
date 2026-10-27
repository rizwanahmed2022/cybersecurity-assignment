# Product Requirements Document (PRD)
**Product Name:** ZetaERP — Import Business Management System  
**Document Version:** `1.0.0`  
**Status:** Production-Ready Offline Windows Desktop & Web ERP  
**Currency & Locale Standard:** Pakistani Rupee (`PKR`, `en-PK` / South Asian Crore-Lac-Thousand notation)

---

## 1. Product Overview & Vision

### 1.1 Product Vision
**ZetaERP** is an offline-first, Windows desktop Enterprise Resource Planning (ERP) application engineered for commercial commodity importers, port-terminal clearing and godown operators, industrial metal/chemical/agro traders, and wholesale distribution businesses.

It combines a permanent left module rail (`ErpSidebar.jsx`), a two-layer logical desktop header (`ErpTitleAndMenuBar.jsx`), and an executive one-glance financial Home Overview (`HomeScreenView.jsx`), all backed by an embedded local SQLite database (`sql.js` WebAssembly with atomic file persistence) and packaged into standalone Windows `.exe` executables (`ZetaERP-Setup-1.0.0.exe` and `ZetaERP-Portable-1.0.0.exe`).

### 1.2 Core Business Problems Solved
1. **Accurate Landed Costing:** Aggregates overseas FOB/CIF purchase cost with port clearing, customs handling, labour unloading, and hired freight into exact **Actual Cost per KG/Unit**.
2. **Dual-Sided Party Khata (Ledgers):** Tracks payables to overseas suppliers (`SUPPLIER` Khata) and receivables from local wholesale buyers (`CUSTOMER` Khata) with partial settlements, refunds, void reversals, audit logs, and A4 PDF statements/vouchers.
3. **Dual Fleet Logistics Scenarios:** Supports company-owned vehicles alongside hired third-party carriers (`Bilty #`, freight income, fuel/maintenance expenses, and net trip profit).
4. **Workforce & Daily Labour Payroll:** Combines monthly staff attendance, overtime, advances, and deductions with daily/job-based unloading labour payouts.
5. **100% Offline Reliability & Disaster Recovery:** Operates with zero internet or cloud dependency, atomic SQLite disk writes, magic-header validated `.db`/`.sqlite` backups, and pre-restore safety checkpoints.

---

## 2. Business Goals & Verification Status

| Goal ID | Business Goal | Implementation Reference | Status |
| :--- | :--- | :--- | :--- |
| **BG-01** | 100% Offline Operational Continuity | Atomic `sql.js` SQLite persistence in `%APPDATA%\ZetaERP` (or `./data`) + verified backup/restore (`server/db.js`, `server/api.js`) | **Verified** |
| **BG-02** | One-Glance Business Health on Home | Executive `HomeScreenView.jsx` showing Total Income, Total Expenses, Net Profit, Receivables, Payables, and Stock Value | **Verified** |
| **BG-03** | Accurate Landed Cost Visibility | `Total Cost = Purchase Amount + Hired Freight + Clearing Expenses` (`POST /api/imports`, `ErpCalculatorModal.jsx`) | **Verified** |
| **BG-04** | Auditable Party Khata & Statements | Chronological running-balance ledgers, void reversals, and branded A4 PDFs (`CustomersView.jsx`, `SuppliersView.jsx`, `pdfGenerator.js`) | **Verified** |
| **BG-05** | Dual-Logo Brand Separation | Fixed **ZetaERP** app logo (`ZetaBrandMark.jsx`) vs. changeable **Business Logo** (`settings.business_logo`) printed on invoices/reports/PDFs | **Verified** |
| **BG-06** | One-Command Windows `.exe` Build | `npm run build` on Windows (or `npm run build:exe`) generates both NSIS Setup `.exe` and Portable `.exe` in `dist-electron/` | **Verified** |

---

## 3. Verified Implemented Modules & Features

1. **Permanent Sidebar & Two-Layer Header (`ErpSidebar.jsx`, `ErpTitleAndMenuBar.jsx`, `App.jsx`)**
   - Permanent left sidebar displaying the fixed ZetaERP logo and all 15 operational views plus pinned `System Settings`.
   - Two-layer header: Top row shows active module title, business identity, offline SQLite status, fullscreen toggle, and Admin User menu; Second row shows classic hover/click menus (`File`, `Edit`, `View`, `Modules`, `Tools`, `Help`) on the left and quick actions (`+ Import`, `+ New Sale`, `Calculator`, `Sync`) on the right, plus MDI tabs.
2. **Executive Home Financial Overview (`HomeScreenView.jsx`)**
   - Period filter (`All Time`, `This Month`, `Last 30 Days`, `This Year`), 6 primary KPI cards (`Total Income`, `Total Expenses`, `Net Profit`, `Receivable`, `Payable`, `Stock Value`), Cashflow & Profitability Breakdown, 6-Month Revenue vs. Expense Trend chart, Recent Activity tables, and Low-Stock Alerts.
3. **Import Consignment Management (`ImportsView.jsx`, `/api/imports`)**
   - Multi-SKU imports, Company vs. Third-Party transport (`hired_freight_cost`), attached clearing expenses, atomic stock increment, and supplier payable update.
4. **Overseas Suppliers & Supplier Khata (`SuppliersView.jsx`, `SupplierStatementModal.jsx`, `/api/suppliers`)**
   - Vendor master directory (`SUP-xxxx`), transactional `opening_balance` updates, chronological running-balance Khata, payment recording (`PAID` / `RECEIVED`), void reversals, audit logs, and branded PDF statements.
5. **Local Customers & Customer Khata (`CustomersView.jsx`, `CustomerStatementModal.jsx`, `/api/customers`)**
   - Buyer master directory (`CUST-xxxx`), transactional `opening_balance` updates, chronological Khata, official Money Receipts (`PaymentReceiptModal.jsx`), voiding with invoice & balance reversal, and branded PDF statements.
6. **Sales & Commercial Invoicing (`SalesView.jsx`, `InvoicesView.jsx`, `InvoiceModal.jsx`, `/api/sales`)**
   - Multi-item wholesale billing (`INV-xxxxxx`), inline over-stock confirmation / negative-stock guard, A4 Commercial Invoice, 80mm Thermal Receipt, and branded PDF export.
7. **Products, Categories & Warehouse Inventory (`ProductsView.jsx`, `InventoryView.jsx`, `WarehousesView.jsx`)**
   - SKU catalog (`PRD-xxxx`), godown directory (`WH-xxxx`), purchase/selling stock valuation, movement history, and physical stock audit adjustments (`ADJUSTMENT`).
8. **Transport Fleet & Commercial Haulage (`VehiclesView.jsx`, `/api/vehicles`, `/api/vehicle-trips`)**
   - Fleet cost/revenue tracking and Scenario 2 third-party cargo haulage trips (`TRP-xxxxxx`) with freight settlement tracking.
9. **Daily Expenses (`ExpensesView.jsx`, `/api/expenses`)**
   - `VEHICLE`, `LABOUR`, and `OTHER` expense vouchers linked to imports, vehicles, or employees and synchronized with `payments`.
10. **HR, Attendance, Advances & Monthly Payroll (`EmployeesView.jsx`, `PayrollView.jsx`)**
    - Staff directory (`EMP-xxxx`), batch daily attendance, salary advances/deductions, pro-rated monthly payroll generation, advance recovery upon payout, and daily labour gang vouchers.
11. **Financial Reports & Analytics (`ReportsView.jsx`, `/api/reports`)**
    - Date-filtered Profit & Loss, Sales, Imports, Expenses, Stock Valuation, Receivables/Payables, and Payroll reports with branded print/PDF support.
12. **SQLite Backup, Restore & System Settings (`BackupView.jsx`, `SettingsView.jsx`)**
    - Instant `.db` snapshots, `SQLite format 3` magic-header validation, path-traversal guards, `Safety_PreRestore` checkpoints, full 24-table JSON export, changeable business logo/profile for documents, and persistent clean database reset / master seeding utilities.

---

## 4. Core Financial Formulas

1. **Import Landed Cost:**
   - $\text{Purchase Amount} = \sum (\text{Weight} \times \text{Rate/KG})$
   - $\text{Related Expenses} = \text{Hired Freight (if THIRD\_PARTY)} + \sum \text{Attached Consignment Expenses}$
   - $\text{Total Landed Cost} = \text{Purchase Amount} + \text{Related Expenses}$
   - $\text{Actual Cost per KG} = \frac{\text{Total Landed Cost}}{\text{Total Weight}}$
2. **Sales & Customer Receivable:**
   - $\text{Grand Total} = \max(0, \sum (\text{Weight} \times \text{Rate/KG}) - \text{Discount})$
   - $\text{Remaining Receivable} = \max(0, \text{Grand Total} - \text{Paid Amount})$
3. **Monthly Payroll:**
   - $\text{Absence Deduction} = \text{round}\left(\frac{\text{Basic Salary}}{\text{Working Days}} \times \text{Absent Days}\right)$
   - $\text{Net Salary} = \max(0, \text{Basic Salary} + (\text{OT Hours} \times \text{OT Rate}) - (\text{Unrecovered Advances} + \text{Deductions} + \text{Absence Deduction}))$
4. **Profit & Loss:**
   - $\text{Gross Profit} = \text{Total Sales Revenue} - \text{Estimated COGS}$
   - $\text{Net Profit} = \text{Gross Profit} - (\text{Vehicle Expenses} + \text{Labour Expenses} + \text{Other Expenses} + \text{Payroll Salaries})$

