# WorkPulse AI — Employee Productivity & Workload Intelligence

> **Enterprise Workload Intelligence Platform**  
> *Diagnostic Solution for Problem Statement:* “Management observes declining productivity despite increasing working hours. Build an AI system that analyzes workload, overtime, absenteeism, task completion, employee engagement and performance data to identify potential operational bottlenecks and recommend workload interventions.”  
> **Context:** Illustrative Infosys enterprise business structure with 100% reproducible synthetic data.

---

## 🌟 Executive Overview & Problem Diagnosis

Modern engineering and delivery practices often suffer from an operational trap: **increasing daily logged hours and overtime do not produce linear gains in throughput**. Beyond a certain threshold (typically ~9.5+ hours/day or >12 hours/week of overtime), cognitive fatigue, code rework, context switching, and upstream blocker delays cause **productivity scores and task completion rates to plateau and decline**.

**WorkPulse AI** is an explainable, data-driven workforce intelligence platform that surfaces:
- **Overtime-Productivity Decoupling:** Identifies cohorts where extended hours lead to diminishing returns and delivery burnout.
- **Explainable Workload Risk Scoring:** A transparent operational prioritization index that isolates workload pressure, overtime strain, disengagement, and velocity gaps.
- **Actionable AI Workload Interventions:** Dynamic, rule-based recommendations that prioritize managerial task rebalancing, WIP caps, and employee support (strictly non-punitive).
- **Bidirectional Excel & CSV Workflows:** Seamless browser-side parsing, schema validation, and 4-sheet multi-tab export.

---

## 🛠️ Technology Stack

- **Frontend Framework:** React 18 with TypeScript & Vite
- **Styling & Design System:** Tailwind CSS with dark/light mode toggle
- **Data Visualizations:** Recharts (Line, Composed, Scatter, Bar, Donut, and Reference Lines)
- **Spreadsheet Processing:** 
  - **Python (pandas + openpyxl)**: Seed script `generate_data.py` for workbook generation
  - **SheetJS (`xlsx`)**: Browser-side Excel `.xlsx` / `.csv` upload, schema validation, and multi-sheet export
- **Icons & Visual Language:** Lucide React
- **Local Persistence:** `localStorage` for theme preference and uploaded datasets
- **Automated Testing:** Vitest for KPI calculations, risk scoring, validation, and filtering tests

---

## 📁 Project Architecture

```
workpulse-ai/
├── data/                                 # Seeded synthetic datasets
│   ├── employee_productivity_synthetic.xlsx  # 4-sheet enterprise Excel workbook
│   └── synthetic_dataset.json            # JSON data cache
├── public/
│   └── data/                             # Static downloadable dataset assets
├── src/
│   ├── components/
│   │   ├── Navbar.tsx                    # Header, context badges, theme & reset controls
│   │   ├── Sidebar.tsx                   # Multi-page navigation & alert counters
│   │   ├── FilterBar.tsx                 # Month, Dept, Team, Risk, & Search filters
│   │   ├── KPICards.tsx                  # 6 enterprise KPI cards with MoM comparisons
│   │   └── EmployeeDetailModal.tsx       # Comprehensive drilldown & factor breakdown
│   ├── pages/
│   │   ├── OverviewPage.tsx              # Executive briefing, KPI grid, and watchlist
│   │   ├── WorkforceAnalyticsPage.tsx    # Charts A through F
│   │   ├── EmployeeInsightsPage.tsx      # Searchable, sortable, paginated table + CSV export
│   │   ├── WorkloadRisksPage.tsx         # AI bottleneck alerts & governance scoring rules
│   │   └── DataManagementPage.tsx        # Drag-and-drop upload, schema validator & dictionary
│   ├── types/
│   │   └── index.ts                      # Strict TypeScript interfaces
│   ├── utils/
│   │   ├── analytics.ts                  # KPI math, MoM deltas & dynamic recommendation engine
│   │   ├── riskScoring.ts                # Transparent multi-factor risk scoring
│   │   ├── excelService.ts               # SheetJS file parsing, validator & multi-tab export
│   │   └── analytics.test.ts             # Vitest test suite
│   ├── data/
│   │   └── defaultData.ts                # Seed dataset initializer
│   ├── App.tsx                           # Master orchestrator & state manager
│   ├── main.tsx                          # DOM bootstrap
│   └── index.css                         # Tailwind entry & custom scrollbars
├── generate_data.py                      # Python dataset generator
├── tailwind.config.js                    # Tailwind configuration
├── tsconfig.json                         # TypeScript compiler settings
├── vite.config.ts                        # Vite configuration
└── package.json                          # Dependencies & scripts
```

---

## 📊 Synthetic Excel Dataset Architecture

The workbook `data/employee_productivity_synthetic.xlsx` contains four structured worksheets:

1. **`Employees` (200 records):**
   - `Employee ID`, `Employee Name`, `Department`, `Job Role`, `Team`, `Manager`, `Experience Years`, `Assigned Tasks`, `Completed Tasks`, `Pending Tasks`, `Average Working Hours Per Day`, `Overtime Hours Per Week`, `Absence Days`, `Employee Engagement Score`, `Performance Score`, `Task Completion Rate`, `Workload Score`, `Productivity Score`, `Risk Level`, `Reporting Month`.
   - *Integrity Guarantee:* `Completed Tasks <= Assigned Tasks`, `Pending Tasks == Assigned - Completed`, scores bounded in `[0, 100]`.
2. **`Monthly Trends` (12 months):**
   - Aggregated monthly historical progression displaying rising working hours & overtime against peaking and stabilizing productivity (Nov 2025 – Oct 2026).
3. **`Department Metrics`:**
   - Aggregated metrics across the 7 Infosys business units (Cloud & Infrastructure, Digital Experience, Enterprise Application Services, Data & AI, Cyber Security, Engineering Services, Quality Engineering).
4. **`Data Dictionary`:**
   - Full reference guide with column names, data types, definitions, score ranges, and calculation formulas.

---

## 📈 Dashboard Analytics & Visualizations

| Chart | Purpose & Insights |
|---|---|
| **Chart A: Productivity Trend** | Line chart showing 12-month trajectory of Average Productivity Score, Task Completion Rate, and Engagement. |
| **Chart B: Workload vs Productivity** | Scatter plot with risk-colored points evaluating whether higher workload correlates with delivered output. |
| **Chart C: Working Hours vs Productivity** | Binned analysis revealing the productivity inflection point where hours beyond 10h/day trigger declining velocity. |
| **Chart D: Department Performance** | Horizontal bar chart comparing productivity vs workload across business practices. |
| **Chart E: Employee Risk Distribution** | Donut chart displaying proportion of Low, Medium, and High workload risk. |
| **Chart F: Engagement vs Overtime** | Scatter analysis displaying inverse correlation between heavy overtime and engagement sentiment. |

---

## 🧠 Workload Risk Scoring Methodology & Ethics

The Workload Risk score is an **operational prioritization metric**, calculated as:
$$\text{Risk Composite} = 0.30 \cdot W + 0.25 \cdot OT_{\text{norm}} + 0.20 \cdot (100 - E) + 0.15 \cdot (100 - P) + 0.10 \cdot A_{\text{norm}}$$

- **Workload Volume ($W$, 30%):** Active tickets and context complexity.
- **Overtime Exposure ($OT_{\text{norm}}$, 25%):** Normalized weekly overtime above 40h standard.
- **Engagement Inversion ($100 - E$, 20%):** Disengagement sentiment from pulse surveys.
- **Productivity Gap ($100 - P$, 15%):** Task completion and velocity lag.
- **Absenteeism ($A_{\text{norm}}$, 10%):** Absence frequency.

### Ethical & Governance Guardrails:
> **Important:** Workload Risk is **never** a measure of individual talent, motivation, or medical health. It is strictly an operational alert for managers to audit sprint backlog volume, cap overtime, and redistribute deliverables. Disciplinary actions or punitive measures based on this index are explicitly prohibited.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or pnpm
- Python 3.10+ (optional, only needed if re-running `generate_data.py`)

### 1. Installation
```bash
# Navigate to the project directory
cd workpulse-ai

# Install dependencies
npm install
```

### 2. Regenerate Synthetic Dataset (Optional)
The pre-generated dataset is already bundled. To re-run the Python generation script with a custom seed:
```bash
python generate_data.py
```

### 3. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 4. Run Automated Test Suite
```bash
npm test
```
Runs 12 unit tests covering KPI aggregation, month-over-month deltas, risk scoring, data validation, and filtering.

### 5. Production Build
```bash
npm run build
```

---

## 🔒 Limitations & Disclaimers

1. **Synthetic Data Context:** All names, IDs, departments, and metrics are computer-generated for simulation and methodology demonstration. They do not represent real Infosys personnel or proprietary systems.
2. **Rule-Based Inference:** Recommendations are generated by transparent, deterministic algorithmic heuristics based on operational research standards rather than opaque black-box machine learning models.
3. **Browser Storage:** Custom uploaded datasets and theme settings persist locally via `localStorage` within the user's browser.
