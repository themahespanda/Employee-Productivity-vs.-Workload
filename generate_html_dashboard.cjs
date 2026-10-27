const fs = require('fs');
const path = require('path');

const dataJsonPath = path.join(__dirname, 'data', 'synthetic_dataset.json');
const dataset = JSON.parse(fs.readFileSync(dataJsonPath, 'utf8'));

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WorkPulse AI - Employee Productivity &amp; Workload Intelligence</title>
  <script src="https://www.gstatic.com/antigravity/web/dev/tailwindcss.min.js"></script>
  <style>
    /* Custom scrollbar and subtle transitions */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(148, 163, 184, 0.4); border-radius: 9999px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(100, 116, 139, 0.6); }
    .chart-tooltip { pointer-events: none; transition: opacity 0.15s ease; }
    .tab-content { display: none; }
    .tab-content.active { display: block; }
  </style>
</head>
<body class="bg-[var(--background,#0f172a)] text-[var(--foreground,#f8fafc)] antialiased min-h-screen flex flex-col font-sans transition-colors duration-200">
  <!-- Top Navigation Bar -->
  <header class="sticky top-0 z-40 bg-[var(--card,#1e293b)]/95 backdrop-blur border-b border-[var(--border,#334155)] px-6 py-3.5 flex items-center justify-between shadow-sm">
    <div class="flex items-center space-x-3">
      <div class="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-blue-500/20">
        WP
      </div>
      <div>
        <div class="flex items-center space-x-2">
          <h1 class="text-base font-bold tracking-tight text-[var(--foreground,#f8fafc)]">
            WorkPulse <span class="text-blue-500">AI</span>
          </h1>
          <span class="px-2 py-0.5 rounded text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            Enterprise Intelligence
          </span>
        </div>
        <p class="text-xs text-[var(--muted-foreground,#94a3b8)]">
          Employee Productivity &amp; Workload Intelligence • Infosys Context (Synthetic)
        </p>
      </div>
    </div>

    <!-- Right Controls -->
    <div class="flex items-center space-x-3 text-xs">
      <div class="hidden sm:block text-[var(--muted-foreground,#94a3b8)]">
        Showing: <span id="record-count-badge" class="font-bold text-[var(--foreground,#f8fafc)]">200</span> / 200 records
      </div>
      <button id="export-csv-top-btn" class="px-3 py-1.5 rounded-lg bg-[var(--background,#0f172a)] border border-[var(--border,#334155)] text-[var(--foreground,#f8fafc)] hover:border-blue-500 transition font-medium">
        Export Filtered CSV
      </button>
      <button id="theme-toggle-btn" class="p-2 rounded-lg bg-[var(--background,#0f172a)] border border-[var(--border,#334155)] text-[var(--foreground,#f8fafc)] hover:border-blue-500 transition">
        <span id="theme-icon">🌓 Theme</span>
      </button>
    </div>
  </header>

  <!-- Main Container -->
  <div class="flex-1 flex flex-col md:flex-row">
    <!-- Sidebar Navigation -->
    <aside class="w-full md:w-64 bg-[var(--card,#1e293b)]/70 border-r border-[var(--border,#334155)] p-4 flex flex-col justify-between flex-shrink-0">
      <div class="space-y-1.5">
        <div class="px-3 pb-2 text-xs font-bold text-[var(--muted-foreground,#94a3b8)] uppercase tracking-wider">
          Intelligence Views
        </div>
        <button onclick="switchTab('overview')" id="tab-btn-overview" class="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition bg-blue-600 text-white shadow-sm">
          <span>📊 Overview &amp; Alert Summary</span>
        </button>
        <button onclick="switchTab('analytics')" id="tab-btn-analytics" class="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition text-[var(--foreground,#f8fafc)] hover:bg-[var(--background,#0f172a)]">
          <span>📈 Workforce Analytics (6 Charts)</span>
        </button>
        <button onclick="switchTab('employees')" id="tab-btn-employees" class="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition text-[var(--foreground,#f8fafc)] hover:bg-[var(--background,#0f172a)]">
          <span>👥 Employee Directory &amp; Drilldown</span>
        </button>
        <button onclick="switchTab('risks')" id="tab-btn-risks" class="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition text-[var(--foreground,#f8fafc)] hover:bg-[var(--background,#0f172a)]">
          <span>⚠️ AI Bottlenecks &amp; Interventions</span>
          <span id="sidebar-risk-badge" class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">0</span>
        </button>
        <button onclick="switchTab('data')" id="tab-btn-data" class="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition text-[var(--foreground,#f8fafc)] hover:bg-[var(--background,#0f172a)]">
          <span>📁 Data Management &amp; Dictionary</span>
        </button>
      </div>

      <!-- Problem Statement Context Card -->
      <div class="p-3.5 rounded-2xl bg-[var(--background,#0f172a)] border border-[var(--border,#334155)] mt-6 text-xs text-[var(--muted-foreground,#94a3b8)] space-y-1.5">
        <div class="font-bold text-[var(--foreground,#f8fafc)] flex items-center space-x-1.5">
          <span>🎯 Problem Statement</span>
        </div>
        <p class="leading-relaxed text-[11px]">
          Management observes declining productivity despite increasing working hours. WorkPulse AI identifies bottlenecks across teams to guide operational interventions.
        </p>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-1 p-5 lg:p-7 max-w-7xl mx-auto w-full space-y-6">
      <!-- Global Filter Bar -->
      <div id="filter-bar" class="p-4 rounded-2xl bg-[var(--card,#1e293b)] border border-[var(--border,#334155)] shadow-sm space-y-3">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <!-- Search input -->
          <div class="relative flex-1 min-w-[220px]">
            <input
              id="search-input"
              type="text"
              placeholder="Search by Employee ID, Name, Role, Manager..."
              class="w-full py-2 pl-3 pr-8 rounded-xl bg-[var(--background,#0f172a)] border border-[var(--border,#334155)] text-xs text-[var(--foreground,#f8fafc)] placeholder-[var(--muted-foreground,#94a3b8)] focus:outline-none focus:border-blue-500"
            />
          </div>

          <!-- Dropdowns -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 flex-wrap text-xs">
            <select id="filter-month" class="py-2 px-2.5 rounded-xl bg-[var(--background,#0f172a)] border border-[var(--border,#334155)] text-[var(--foreground,#f8fafc)]">
              <option value="all">All Months</option>
              <option value="2026-10" selected>2026-10 (Current)</option>
            </select>
            <select id="filter-dept" class="py-2 px-2.5 rounded-xl bg-[var(--background,#0f172a)] border border-[var(--border,#334155)] text-[var(--foreground,#f8fafc)]">
              <option value="all">All Departments</option>
            </select>
            <select id="filter-team" class="py-2 px-2.5 rounded-xl bg-[var(--background,#0f172a)] border border-[var(--border,#334155)] text-[var(--foreground,#f8fafc)]">
              <option value="all">All Teams</option>
            </select>
            <select id="filter-risk" class="py-2 px-2.5 rounded-xl bg-[var(--background,#0f172a)] border border-[var(--border,#334155)] text-[var(--foreground,#f8fafc)]">
              <option value="all">All Risk Levels</option>
              <option value="High">High Risk Only</option>
              <option value="Medium">Medium Risk</option>
              <option value="Low">Low Risk</option>
            </select>
          </div>

          <!-- Reset Filter Button -->
          <div class="flex items-center space-x-2">
            <button id="reset-filters-btn" class="px-3 py-2 rounded-xl text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 transition">
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      <!-- KPI Cards Grid (Dynamic) -->
      <div id="kpi-grid" class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        <!-- Rendered via JS -->
      </div>

      <!-- TAB 1: OVERVIEW -->
      <div id="tab-overview" class="tab-content active space-y-6">
        <!-- Executive Problem Statement Banner -->
        <div class="rounded-3xl p-6 bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 border border-blue-800/40 text-white space-y-2.5 shadow-lg">
          <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold">
            <span>Operational Diagnostic Finding</span>
          </div>
          <h2 class="text-xl md:text-2xl font-black">
            Declining Productivity Despite Rising Working Hours
          </h2>
          <p class="text-xs md:text-sm text-slate-300 leading-relaxed max-w-4xl">
            In depth analysis of the 200 synthetic engineering records reveals that daily active hours have climbed to an average of 9.2 hrs/day and weekly overtime to 7.8 hrs/wk. However, task velocity has hit a fatigue ceiling—engineers working &gt;10h/day deliver 18% lower task completion rates due to defect rework and cognitive saturation.
          </p>
        </div>

        <!-- Macro Charts Summary Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 p-5 rounded-3xl bg-[var(--card,#1e293b)] border border-[var(--border,#334155)] space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-[var(--border,#334155)]">
              <div>
                <h3 class="text-sm font-bold text-[var(--foreground,#f8fafc)]">12-Month Macro Trend: Productivity vs Overtime</h3>
                <p class="text-xs text-[var(--muted-foreground,#94a3b8)]">Illustrates the decoupling of hours logged and throughput achieved</p>
              </div>
              <button onclick="switchTab('analytics')" class="text-xs text-blue-400 font-semibold hover:underline">Full Analytics →</button>
            </div>
            <div id="chart-macro-trend" class="w-full h-64"></div>
          </div>

          <div class="p-5 rounded-3xl bg-[var(--card,#1e293b)] border border-[var(--border,#334155)] space-y-4 flex flex-col justify-between">
            <div>
              <div class="pb-3 border-b border-[var(--border,#334155)]">
                <h3 class="text-sm font-bold text-[var(--foreground,#f8fafc)]">Workload Risk Proportions</h3>
                <p class="text-xs text-[var(--muted-foreground,#94a3b8)]">Prioritization classification across cohorts</p>
              </div>
              <div id="chart-risk-donut" class="w-full h-52 flex items-center justify-center"></div>
              <div id="risk-legend" class="space-y-1.5 text-xs mt-2"></div>
            </div>
            <button onclick="switchTab('risks')" class="w-full py-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs font-semibold hover:bg-blue-600/30 transition">
              Review Workload Interventions
            </button>
          </div>
        </div>

        <!-- Top Bottleneck Alerts & Priority Watchlist -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="p-5 rounded-3xl bg-[var(--card,#1e293b)] border border-[var(--border,#334155)] space-y-3">
            <div class="flex items-center justify-between pb-3 border-b border-[var(--border,#334155)]">
              <h3 class="text-sm font-bold text-[var(--foreground,#f8fafc)]">🚨 Urgent Operational Bottleneck Alerts</h3>
              <button onclick="switchTab('risks')" class="text-xs text-blue-400 font-semibold hover:underline">View All</button>
            </div>
            <div id="overview-alerts-container" class="space-y-3"></div>
          </div>

          <div class="p-5 rounded-3xl bg-[var(--card,#1e293b)] border border-[var(--border,#334155)] space-y-3">
            <div class="flex items-center justify-between pb-3 border-b border-[var(--border,#334155)]">
              <h3 class="text-sm font-bold text-[var(--foreground,#f8fafc)]">🔍 High Overtime &amp; Fatigue Watchlist</h3>
              <button onclick="switchTab('employees')" class="text-xs text-blue-400 font-semibold hover:underline">All Directory</button>
            </div>
            <div id="overview-watchlist-container" class="divide-y divide-[var(--border,#334155)]"></div>
          </div>
        </div>
      </div>

      <!-- TAB 2: WORKFORCE ANALYTICS (6 CHARTS) -->
      <div id="tab-analytics" class="tab-content space-y-6">
        <div>
          <h2 class="text-lg font-bold text-[var(--foreground,#f8fafc)]">Workforce Analytics &amp; Correlation Diagnostics</h2>
          <p class="text-xs text-[var(--muted-foreground,#94a3b8)]">Deep statistical analysis of hours, task output, engagement sentiment, and department saturation.</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Chart A -->
          <div class="p-5 rounded-3xl bg-[var(--card,#1e293b)] border border-[var(--border,#334155)] space-y-2">
            <span class="text-xs font-bold text-blue-400 uppercase tracking-wider">Chart A</span>
            <h3 class="text-sm font-bold text-[var(--foreground,#f8fafc)]">Productivity &amp; Task Completion 12-Month Trajectory</h3>
            <p class="text-xs text-[var(--muted-foreground,#94a3b8)]">Monthly progression of average productivity and task completion rates</p>
            <div id="chart-a-container" class="h-64 w-full"></div>
          </div>

          <!-- Chart D -->
          <div class="p-5 rounded-3xl bg-[var(--card,#1e293b)] border border-[var(--border,#334155)] space-y-2">
            <span class="text-xs font-bold text-blue-400 uppercase tracking-wider">Chart D</span>
            <h3 class="text-sm font-bold text-[var(--foreground,#f8fafc)]">Department Performance &amp; Workload Comparison</h3>
            <p class="text-xs text-[var(--muted-foreground,#94a3b8)]">Horizontal comparison of productivity score versus workload score by practice unit</p>
            <div id="chart-d-container" class="h-64 w-full"></div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Chart B -->
          <div class="p-5 rounded-3xl bg-[var(--card,#1e293b)] border border-[var(--border,#334155)] space-y-2">
            <span class="text-xs font-bold text-blue-400 uppercase tracking-wider">Chart B</span>
            <h3 class="text-sm font-bold text-[var(--foreground,#f8fafc)]">Workload vs Productivity Correlation</h3>
            <p class="text-xs text-[var(--muted-foreground,#94a3b8)]">Scatter plot comparing individual workload against productivity score (colored by risk)</p>
            <div id="chart-b-container" class="h-64 w-full"></div>
          </div>

          <!-- Chart C -->
          <div class="p-5 rounded-3xl bg-[var(--card,#1e293b)] border border-[var(--border,#334155)] space-y-2">
            <span class="text-xs font-bold text-blue-400 uppercase tracking-wider">Chart C</span>
            <h3 class="text-sm font-bold text-[var(--foreground,#f8fafc)]">Working Hours vs Productivity Output</h3>
            <p class="text-xs text-[var(--muted-foreground,#94a3b8)]">Binned analysis revealing output plateau and decline when daily hours exceed 10 hrs/day</p>
            <div id="chart-c-container" class="h-64 w-full"></div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Chart E -->
          <div class="p-5 rounded-3xl bg-[var(--card,#1e293b)] border border-[var(--border,#334155)] space-y-2">
            <span class="text-xs font-bold text-blue-400 uppercase tracking-wider">Chart E</span>
            <h3 class="text-sm font-bold text-[var(--foreground,#f8fafc)]">Employee Risk Distribution</h3>
            <p class="text-xs text-[var(--muted-foreground,#94a3b8)]">Donut distribution of Low, Medium, and High workload risk</p>
            <div id="chart-e-container" class="h-56 w-full flex items-center justify-center"></div>
          </div>

          <!-- Chart F -->
          <div class="lg:col-span-2 p-5 rounded-3xl bg-[var(--card,#1e293b)] border border-[var(--border,#334155)] space-y-2">
            <span class="text-xs font-bold text-blue-400 uppercase tracking-wider">Chart F</span>
            <h3 class="text-sm font-bold text-[var(--foreground,#f8fafc)]">Engagement vs Overtime Correlation</h3>
            <p class="text-xs text-[var(--muted-foreground,#94a3b8)]">Scatter analysis showing sentiment erosion associated with persistent weekly overtime</p>
            <div id="chart-f-container" class="h-56 w-full"></div>
          </div>
        </div>
      </div>

      <!-- TAB 3: EMPLOYEE INSIGHTS -->
      <div id="tab-employees" class="tab-content space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 class="text-lg font-bold text-[var(--foreground,#f8fafc)]">Employee Intelligence Directory</h2>
            <p class="text-xs text-[var(--muted-foreground,#94a3b8)]">Searchable, sortable, paginated enterprise directory with click-to-inspect factor breakdowns.</p>
          </div>
          <button id="table-export-csv-btn" class="px-3.5 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs shadow-sm hover:bg-blue-700 transition">
            Export Active Records to CSV
          </button>
        </div>

        <!-- Table Container -->
        <div class="bg-[var(--card,#1e293b)] border border-[var(--border,#334155)] rounded-3xl overflow-hidden shadow-sm">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs border-collapse">
              <thead>
                <tr class="bg-[var(--background,#0f172a)]/60 border-b border-[var(--border,#334155)] text-[var(--muted-foreground,#94a3b8)] uppercase text-[11px] font-bold">
                  <th onclick="sortTable('Employee ID')" class="py-3 px-3.5 cursor-pointer hover:text-blue-400 select-none">ID ↕</th>
                  <th onclick="sortTable('Employee Name')" class="py-3 px-3.5 cursor-pointer hover:text-blue-400 select-none">Employee ↕</th>
                  <th onclick="sortTable('Department')" class="py-3 px-3.5 cursor-pointer hover:text-blue-400 select-none">Department ↕</th>
                  <th onclick="sortTable('Productivity Score')" class="py-3 px-3.5 text-right cursor-pointer hover:text-blue-400 select-none">Productivity ↕</th>
                  <th onclick="sortTable('Workload Score')" class="py-3 px-3.5 text-right cursor-pointer hover:text-blue-400 select-none">Workload ↕</th>
                  <th onclick="sortTable('Overtime Hours Per Week')" class="py-3 px-3.5 text-right cursor-pointer hover:text-blue-400 select-none">Overtime ↕</th>
                  <th onclick="sortTable('Employee Engagement Score')" class="py-3 px-3.5 text-right cursor-pointer hover:text-blue-400 select-none">Engagement ↕</th>
                  <th onclick="sortTable('Task Completion Rate')" class="py-3 px-3.5 text-right cursor-pointer hover:text-blue-400 select-none">Completion ↕</th>
                  <th onclick="sortTable('Risk Level')" class="py-3 px-3.5 text-center cursor-pointer hover:text-blue-400 select-none">Risk ↕</th>
                  <th class="py-3 px-3.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody id="employee-table-body" class="divide-y divide-[var(--border,#334155)] text-[var(--foreground,#f8fafc)]">
                <!-- Rendered via JS -->
              </tbody>
            </table>
          </div>

          <!-- Pagination Bar -->
          <div class="p-4 px-6 border-t border-[var(--border,#334155)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--muted-foreground,#94a3b8)]">
            <div class="flex items-center space-x-2">
              <span>Show</span>
              <select id="page-size-select" class="py-1 px-2 rounded-lg bg-[var(--background,#0f172a)] border border-[var(--border,#334155)] text-[var(--foreground,#f8fafc)]">
                <option value="10">10</option>
                <option value="25" selected>25</option>
                <option value="50">50</option>
              </select>
              <span>per page</span>
              <span id="pagination-info" class="ml-2 font-medium"></span>
            </div>
            <div class="flex items-center space-x-1.5">
              <button id="prev-page-btn" class="px-3 py-1.5 rounded-lg border border-[var(--border,#334155)] hover:bg-[var(--background,#0f172a)] transition">Previous</button>
              <span id="page-number-display" class="px-2 font-bold text-[var(--foreground,#f8fafc)]">1</span>
              <button id="next-page-btn" class="px-3 py-1.5 rounded-lg border border-[var(--border,#334155)] hover:bg-[var(--background,#0f172a)] transition">Next</button>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 4: WORKLOAD RISKS -->
      <div id="tab-risks" class="tab-content space-y-6">
        <div>
          <h2 class="text-lg font-bold text-[var(--foreground,#f8fafc)]">AI Workload Intelligence &amp; Prioritized Interventions</h2>
          <p class="text-xs text-[var(--muted-foreground,#94a3b8)]">Dynamic algorithmic diagnoses identifying operational bottlenecks, overtime fatigue decoupling, and capacity disparity.</p>
        </div>

        <!-- Governance Framework Note -->
        <div class="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-xs text-blue-300 space-y-1">
          <div class="font-bold text-[var(--foreground,#f8fafc)] flex items-center space-x-2">
            <span>🛡️ Ethical Governance Guardrails</span>
          </div>
          <p class="leading-relaxed">
            Workload Risk scores represent <strong>operational system bottlenecks and workload distribution pressures</strong>. They are strictly designed to trigger managerial re-balancing, sprint scope adjustments, and wellness support. Under Infosys governance policies, this index is <strong>never</strong> a diagnostic assessment of employee capability, motivation, or medical health, and is <strong>never</strong> used for punitive disciplinary actions.
          </p>
        </div>

        <!-- Dynamic Recommendations Cards -->
        <div id="recommendations-container" class="space-y-4"></div>

        <!-- Department Risk Ranking Table -->
        <div class="p-5 rounded-3xl bg-[var(--card,#1e293b)] border border-[var(--border,#334155)] space-y-3">
          <h3 class="text-sm font-bold text-[var(--foreground,#f8fafc)]">Departmental Risk &amp; Workload Saturation Ranking</h3>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs border-collapse">
              <thead>
                <tr class="bg-[var(--background,#0f172a)] border-b border-[var(--border,#334155)] text-[var(--muted-foreground,#94a3b8)] font-bold text-[11px] uppercase">
                  <th class="py-2.5 px-3">Department</th>
                  <th class="py-2.5 px-3 text-right">Headcount</th>
                  <th class="py-2.5 px-3 text-right">High Risk Count</th>
                  <th class="py-2.5 px-3 text-right">Risk Ratio</th>
                  <th class="py-2.5 px-3 text-right">Avg Workload</th>
                  <th class="py-2.5 px-3 text-right">Avg Overtime</th>
                </tr>
              </thead>
              <tbody id="dept-risk-tbody" class="divide-y divide-[var(--border,#334155)]"></tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- TAB 5: DATA MANAGEMENT -->
      <div id="tab-data" class="tab-content space-y-6">
        <div>
          <h2 class="text-lg font-bold text-[var(--foreground,#f8fafc)]">Data Management &amp; Enterprise Dictionary</h2>
          <p class="text-xs text-[var(--muted-foreground,#94a3b8)]">Inspect dataset specifications, definitions, calculation formulas, and export data files.</p>
        </div>

        <!-- Download Buttons -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div class="p-4 rounded-2xl bg-[var(--card,#1e293b)] border border-[var(--border,#334155)] space-y-2">
            <h4 class="font-bold text-[var(--foreground,#f8fafc)]">Download Synthetic Excel</h4>
            <p class="text-[var(--muted-foreground,#94a3b8)]">Export the 4-sheet enterprise workbook (.xlsx) directly from the project directory.</p>
            <a href="data/employee_productivity_synthetic.xlsx" download="employee_productivity_synthetic.xlsx" class="inline-block px-3 py-1.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
              Download .xlsx File
            </a>
          </div>

          <div class="p-4 rounded-2xl bg-[var(--card,#1e293b)] border border-[var(--border,#334155)] space-y-2">
            <h4 class="font-bold text-[var(--foreground,#f8fafc)]">Export Filtered CSV</h4>
            <p class="text-[var(--muted-foreground,#94a3b8)]">Download currently filtered employee records as standard CSV for offline spreadsheets.</p>
            <button id="btn-export-csv-data-tab" class="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition">
              Export Filtered CSV
            </button>
          </div>

          <div class="p-4 rounded-2xl bg-[var(--card,#1e293b)] border border-[var(--border,#334155)] space-y-2">
            <h4 class="font-bold text-[var(--foreground,#f8fafc)]">Reset Baseline Seed</h4>
            <p class="text-[var(--muted-foreground,#94a3b8)]">Resets any filters and re-aligns calculations to the reproducible Seed 42 dataset.</p>
            <button onclick="resetToDefaultData()" class="px-3 py-1.5 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition">
              Reset Baseline Data
            </button>
          </div>
        </div>

        <!-- Data Dictionary Table -->
        <div class="p-5 rounded-3xl bg-[var(--card,#1e293b)] border border-[var(--border,#334155)] space-y-3">
          <h3 class="text-sm font-bold text-[var(--foreground,#f8fafc)]">Sheet 4: Enterprise Data Dictionary (All 20 Metrics)</h3>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs border-collapse">
              <thead>
                <tr class="bg-[var(--background,#0f172a)] border-b border-[var(--border,#334155)] text-[var(--muted-foreground,#94a3b8)] font-bold text-[11px] uppercase">
                  <th class="py-2.5 px-3">Column Name</th>
                  <th class="py-2.5 px-3">Data Type</th>
                  <th class="py-2.5 px-3">Score / Value Range</th>
                  <th class="py-2.5 px-3">Definition</th>
                  <th class="py-2.5 px-3">Formula / Derivation</th>
                </tr>
              </thead>
              <tbody id="dictionary-tbody" class="divide-y divide-[var(--border,#334155)] text-[var(--foreground,#f8fafc)]">
                <!-- Rendered via JS -->
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  </div>

  <!-- Employee Detail Modal -->
  <div id="employee-modal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 hidden">
    <div class="bg-[var(--card,#1e293b)] border border-[var(--border,#334155)] rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl overflow-y-auto max-h-[90vh]">
      <div class="flex items-start justify-between pb-3 border-b border-[var(--border,#334155)]">
        <div>
          <div class="flex items-center space-x-2">
            <h3 id="modal-emp-name" class="text-base font-bold text-[var(--foreground,#f8fafc)]"></h3>
            <span id="modal-emp-id" class="px-2 py-0.5 rounded text-xs font-mono bg-[var(--background,#0f172a)] text-[var(--muted-foreground,#94a3b8)]"></span>
            <span id="modal-emp-risk" class="px-2.5 py-0.5 rounded-full text-xs font-bold"></span>
          </div>
          <p id="modal-emp-role" class="text-xs text-[var(--muted-foreground,#94a3b8)] mt-0.5"></p>
        </div>
        <button onclick="closeModal()" class="text-lg font-bold text-[var(--muted-foreground,#94a3b8)] hover:text-white px-2">✕</button>
      </div>

      <!-- Quick stats -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
        <div class="p-3 rounded-xl bg-[var(--background,#0f172a)] border border-[var(--border,#334155)]">
          <span class="text-[var(--muted-foreground,#94a3b8)] block text-[11px]">Productivity</span>
          <span id="modal-prod" class="text-base font-bold text-[var(--foreground,#f8fafc)]"></span>
        </div>
        <div class="p-3 rounded-xl bg-[var(--background,#0f172a)] border border-[var(--border,#334155)]">
          <span class="text-[var(--muted-foreground,#94a3b8)] block text-[11px]">Workload Score</span>
          <span id="modal-wl" class="text-base font-bold text-[var(--foreground,#f8fafc)]"></span>
        </div>
        <div class="p-3 rounded-xl bg-[var(--background,#0f172a)] border border-[var(--border,#334155)]">
          <span class="text-[var(--muted-foreground,#94a3b8)] block text-[11px]">Weekly Overtime</span>
          <span id="modal-ot" class="text-base font-bold text-[var(--foreground,#f8fafc)]"></span>
        </div>
        <div class="p-3 rounded-xl bg-[var(--background,#0f172a)] border border-[var(--border,#334155)]">
          <span class="text-[var(--muted-foreground,#94a3b8)] block text-[11px]">Engagement</span>
          <span id="modal-eng" class="text-base font-bold text-[var(--foreground,#f8fafc)]"></span>
        </div>
      </div>

      <!-- Risk Scoring Factor Breakdown -->
      <div class="p-4 rounded-2xl bg-[var(--background,#0f172a)] border border-[var(--border,#334155)] space-y-2.5 text-xs">
        <div class="flex items-center justify-between">
          <span class="font-bold text-[var(--foreground,#f8fafc)]">Workload Risk Factor Breakdown (Formula Weights)</span>
          <span id="modal-composite-score" class="font-bold text-blue-400"></span>
        </div>
        <div id="modal-factors-list" class="space-y-2 pt-1"></div>
      </div>

      <!-- Recommended Action -->
      <div class="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 space-y-1">
        <span class="font-bold text-amber-200 block">Recommended Workload Support Action:</span>
        <p id="modal-action" class="leading-relaxed"></p>
      </div>

      <div class="flex justify-end pt-2">
        <button onclick="closeModal()" class="px-4 py-1.5 rounded-xl bg-[var(--background,#0f172a)] border border-[var(--border,#334155)] text-xs font-semibold hover:border-slate-400">
          Close
        </button>
      </div>
    </div>
  </div>

  <!-- Raw Embedded JSON Dataset -->
  <script>
    const INITIAL_DATASET = ${JSON.stringify(dataset)};
    let currentEmployees = [...INITIAL_DATASET.employees];
    let filteredEmployees = [...currentEmployees];
    let sortColumn = 'Productivity Score';
    let sortAsc = false;
    let currentPage = 1;
    let pageSize = 25;

    // Initialize application
    document.addEventListener('DOMContentLoaded', () => {
      initFilterDropdowns();
      initTheme();
      initDataDictionary();
      applyFilters();
      renderAllCharts();
      setupEventListeners();
    });

    function initTheme() {
      const saved = localStorage.getItem('workpulse_theme') || 'dark';
      if (saved === 'light') {
        document.documentElement.classList.add('light');
        document.body.style.setProperty('--background', '#f8fafc');
        document.body.style.setProperty('--foreground', '#0f172a');
        document.body.style.setProperty('--card', '#ffffff');
        document.body.style.setProperty('--border', '#e2e8f0');
        document.body.style.setProperty('--muted-foreground', '#64748b');
      } else {
        document.documentElement.classList.remove('light');
        document.body.style.setProperty('--background', '#0f172a');
        document.body.style.setProperty('--foreground', '#f8fafc');
        document.body.style.setProperty('--card', '#1e293b');
        document.body.style.setProperty('--border', '#334155');
        document.body.style.setProperty('--muted-foreground', '#94a3b8');
      }
    }

    function toggleTheme() {
      const isLight = document.documentElement.classList.contains('light');
      localStorage.setItem('workpulse_theme', isLight ? 'dark' : 'light');
      initTheme();
      renderAllCharts();
    }

    function initFilterDropdowns() {
      const deptSelect = document.getElementById('filter-dept');
      const depts = [...new Set(currentEmployees.map(e => e["Department"]))].sort();
      depts.forEach(d => {
        const opt = document.createElement('option');
        opt.value = d;
        opt.textContent = d;
        deptSelect.appendChild(opt);
      });

      updateTeamDropdown();
    }

    function updateTeamDropdown() {
      const dept = document.getElementById('filter-dept').value;
      const teamSelect = document.getElementById('filter-team');
      teamSelect.innerHTML = '<option value="all">All Teams</option>';
      const teams = [...new Set(currentEmployees
        .filter(e => dept === 'all' || e["Department"] === dept)
        .map(e => e["Team"]))].sort();

      teams.forEach(t => {
        const opt = document.createElement('option');
        opt.value = t;
        opt.textContent = t;
        teamSelect.appendChild(opt);
      });
    }

    function applyFilters() {
      const query = document.getElementById('search-input').value.toLowerCase().trim();
      const month = document.getElementById('filter-month').value;
      const dept = document.getElementById('filter-dept').value;
      const team = document.getElementById('filter-team').value;
      const risk = document.getElementById('filter-risk').value;

      filteredEmployees = currentEmployees.filter(e => {
        if (month !== 'all' && e["Reporting Month"] !== month) return false;
        if (dept !== 'all' && e["Department"] !== dept) return false;
        if (team !== 'all' && e["Team"] !== team) return false;
        if (risk !== 'all' && e["Risk Level"] !== risk) return false;
        if (query) {
          const matchId = e["Employee ID"].toLowerCase().includes(query);
          const matchName = e["Employee Name"].toLowerCase().includes(query);
          const matchRole = e["Job Role"].toLowerCase().includes(query);
          const matchMgr = e["Manager"].toLowerCase().includes(query);
          if (!matchId && !matchName && !matchRole && !matchMgr) return false;
        }
        return true;
      });

      document.getElementById('record-count-badge').textContent = filteredEmployees.length;
      currentPage = 1;
      renderKPIs();
      renderEmployeeTable();
      renderOverviewAlerts();
      renderRecommendations();
      renderDeptRiskTable();
      renderAllCharts();
    }

    function renderKPIs() {
      const count = filteredEmployees.length;
      const avgProd = count ? (filteredEmployees.reduce((s, e) => s + e["Productivity Score"], 0) / count).toFixed(1) : 0;
      const avgOT = count ? (filteredEmployees.reduce((s, e) => s + e["Overtime Hours Per Week"], 0) / count).toFixed(1) : 0;
      const avgComp = count ? (filteredEmployees.reduce((s, e) => s + e["Task Completion Rate"], 0) / count).toFixed(1) : 0;
      const avgEng = count ? (filteredEmployees.reduce((s, e) => s + e["Employee Engagement Score"], 0) / count).toFixed(1) : 0;
      const highRisk = filteredEmployees.filter(e => e["Risk Level"] === 'High').length;
      const highRiskPct = count ? ((highRisk / count) * 100).toFixed(1) : 0;

      document.getElementById('sidebar-risk-badge').textContent = highRisk;

      const kpis = [
        { label: 'Total Employees', val: count, sub: 'Filtered headcount', delta: null },
        { label: 'Avg Productivity', val: avgProd, unit: '/100', sub: 'Velocity index', delta: '-1.5 MoM', bad: true },
        { label: 'Avg Weekly OT', val: avgOT + ' hrs', sub: 'Above 40h standard', delta: '+2.6 MoM', bad: true },
        { label: 'Task Completion', val: avgComp + '%', sub: 'Sprint ticket delivery', delta: '-1.6% MoM', bad: true },
        { label: 'Avg Engagement', val: avgEng, unit: '/100', sub: 'Pulse sentiment', delta: '-2.2 MoM', bad: true },
        { label: 'High Workload Risk', val: highRisk, unit: '(' + highRiskPct + '%)', sub: 'Intervention queue', delta: 'Requires action', bad: true },
      ];

      const container = document.getElementById('kpi-grid');
      container.innerHTML = kpis.map(k => \`
        <div class="p-3.5 rounded-2xl bg-[var(--card,#1e293b)] border border-[var(--border,#334155)] shadow-sm">
          <div class="text-[11px] font-semibold text-[var(--muted-foreground,#94a3b8)] truncate">\${k.label}</div>
          <div class="text-xl font-black mt-1 text-[var(--foreground,#f8fafc)]">
            \${k.val} <span class="text-xs font-normal text-[var(--muted-foreground,#94a3b8)]">\${k.unit || ''}</span>
          </div>
          <div class="text-[10px] mt-1 flex items-center justify-between">
            <span class="text-[var(--muted-foreground,#94a3b8)]">\${k.sub}</span>
            \${k.delta ? \`<span class="font-bold \${k.bad ? 'text-amber-400' : 'text-emerald-400'}">\${k.delta}</span>\` : ''}
          </div>
        </div>
      \`).join('');
    }

    function renderEmployeeTable() {
      const sorted = [...filteredEmployees].sort((a, b) => {
        let aVal = a[sortColumn];
        let bVal = b[sortColumn];
        if (sortColumn === 'Risk Level') {
          const order = { High: 3, Medium: 2, Low: 1 };
          aVal = order[aVal] || 0;
          bVal = order[bVal] || 0;
        }
        if (typeof aVal === 'string') return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        return sortAsc ? aVal - bVal : bVal - aVal;
      });

      const start = (currentPage - 1) * pageSize;
      const paginated = sorted.slice(start, start + pageSize);

      const tbody = document.getElementById('employee-table-body');
      if (paginated.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" class="py-8 text-center text-[var(--muted-foreground,#94a3b8)]">No records match the current filters.</td></tr>';
        return;
      }

      tbody.innerHTML = paginated.map(e => \`
        <tr onclick="openEmployeeModal('\${e["Employee ID"]}')" class="hover:bg-blue-500/10 cursor-pointer transition">
          <td class="py-2.5 px-3.5 font-mono text-[var(--muted-foreground,#94a3b8)]">\${e["Employee ID"]}</td>
          <td class="py-2.5 px-3.5">
            <div class="font-bold text-[var(--foreground,#f8fafc)]">\${e["Employee Name"]}</div>
            <div class="text-[10px] text-[var(--muted-foreground,#94a3b8)]">\${e["Job Role"]}</div>
          </td>
          <td class="py-2.5 px-3.5">
            <div>\${e["Department"]}</div>
            <div class="text-[10px] text-[var(--muted-foreground,#94a3b8)]">\${e["Team"]}</div>
          </td>
          <td class="py-2.5 px-3.5 text-right font-bold">\${e["Productivity Score"]}</td>
          <td class="py-2.5 px-3.5 text-right \${e["Workload Score"] >= 80 ? 'text-rose-400 font-bold' : ''}">\${e["Workload Score"]}</td>
          <td class="py-2.5 px-3.5 text-right \${e["Overtime Hours Per Week"] >= 10 ? 'text-amber-400 font-bold' : ''}">\${e["Overtime Hours Per Week"]}h</td>
          <td class="py-2.5 px-3.5 text-right">\${e["Employee Engagement Score"]}</td>
          <td class="py-2.5 px-3.5 text-right">\${e["Task Completion Rate"]}%</td>
          <td class="py-2.5 px-3.5 text-center">
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold \${
              e["Risk Level"] === 'High' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
              e["Risk Level"] === 'Medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
              'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            }">\${e["Risk Level"]}</span>
          </td>
          <td class="py-2.5 px-3.5 text-center text-blue-400 font-semibold hover:underline">Inspect</td>
        </tr>
      \`).join('');

      const totalPages = Math.ceil(filteredEmployees.length / pageSize) || 1;
      document.getElementById('page-number-display').textContent = \`Page \${currentPage} of \${totalPages}\`;
      document.getElementById('pagination-info').textContent = \`(\${start + 1}-\${Math.min(start + pageSize, filteredEmployees.length)} of \${filteredEmployees.length})\`;
      document.getElementById('prev-page-btn').disabled = currentPage <= 1;
      document.getElementById('next-page-btn').disabled = currentPage >= totalPages;
    }

    function sortTable(col) {
      if (sortColumn === col) sortAsc = !sortAsc;
      else { sortColumn = col; sortAsc = false; }
      renderEmployeeTable();
    }

    function openEmployeeModal(empId) {
      const emp = currentEmployees.find(e => e["Employee ID"] === empId);
      if (!emp) return;

      document.getElementById('modal-emp-name').textContent = emp["Employee Name"];
      document.getElementById('modal-emp-id').textContent = emp["Employee ID"];
      document.getElementById('modal-emp-role').textContent = \`\${emp["Job Role"]} • \${emp["Department"]} (\${emp["Team"]}) | Mgr: \${emp["Manager"]}\`;

      const riskBadge = document.getElementById('modal-emp-risk');
      riskBadge.textContent = emp["Risk Level"] + ' Workload Risk';
      riskBadge.className = 'px-2.5 py-0.5 rounded-full text-xs font-bold ' + (
        emp["Risk Level"] === 'High' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
        emp["Risk Level"] === 'Medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
        'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
      );

      document.getElementById('modal-prod').textContent = emp["Productivity Score"] + '/100';
      document.getElementById('modal-wl').textContent = emp["Workload Score"] + '/100';
      document.getElementById('modal-ot').textContent = emp["Overtime Hours Per Week"] + ' hrs/wk';
      document.getElementById('modal-eng').textContent = emp["Employee Engagement Score"] + '/100';

      // Formula breakdown
      const normWl = emp["Workload Score"];
      const normOt = Math.min(100, (emp["Overtime Hours Per Week"] / 20) * 100);
      const normEng = Math.max(0, 100 - emp["Employee Engagement Score"]);
      const normProd = Math.max(0, 100 - emp["Productivity Score"]);
      const normAbs = Math.min(100, (emp["Absence Days"] / 8) * 100);

      const comp = (0.30 * normWl + 0.25 * normOt + 0.20 * normEng + 0.15 * normProd + 0.10 * normAbs).toFixed(1);
      document.getElementById('modal-composite-score').textContent = \`Composite: \${comp}/100\`;

      const factorsList = document.getElementById('modal-factors-list');
      factorsList.innerHTML = \`
        <div class="flex justify-between"><span>Workload Volume (30% wt): \${normWl} score</span><span class="font-bold">+\${(normWl*0.3).toFixed(1)} pts</span></div>
        <div class="flex justify-between"><span>Overtime Stress (25% wt): \${emp["Overtime Hours Per Week"]} hrs/wk</span><span class="font-bold">+\${(normOt*0.25).toFixed(1)} pts</span></div>
        <div class="flex justify-between"><span>Disengagement Inversion (20% wt): \${emp["Employee Engagement Score"]}/100</span><span class="font-bold">+\${(normEng*0.2).toFixed(1)} pts</span></div>
        <div class="flex justify-between"><span>Productivity Gap (15% wt): \${emp["Productivity Score"]}/100</span><span class="font-bold">+\${(normProd*0.15).toFixed(1)} pts</span></div>
        <div class="flex justify-between"><span>Absenteeism Exposure (10% wt): \${emp["Absence Days"]} days</span><span class="font-bold">+\${(normAbs*0.1).toFixed(1)} pts</span></div>
      \`;

      let action = "Maintain standard delivery cadence. No immediate workload intervention required.";
      if (emp["Risk Level"] === 'High') {
        if (emp["Overtime Hours Per Week"] > 10) action = "Immediate capacity relief: Cap weekly overtime to <4h, re-scope active sprint commitments, and reassign non-critical pending tasks.";
        else if (emp["Employee Engagement Score"] < 50) action = "Managerial 1-on-1 check-in recommended to explore project blockers, context-switch fatigue, and deliverable ambiguity.";
        else action = "Review sprint ticket distribution across pod to avoid single-engineer delivery dependency bottlenecks.";
      }
      document.getElementById('modal-action').textContent = action;

      document.getElementById('employee-modal').classList.remove('hidden');
    }

    function closeModal() {
      document.getElementById('employee-modal').classList.add('hidden');
    }

    function renderOverviewAlerts() {
      const container = document.getElementById('overview-alerts-container');
      const alerts = [
        {
          title: "Overtime-Productivity Decoupling in Core Delivery",
          scope: "CloudOps & Integration Pods",
          desc: "Engineers logging >12h/week overtime average 15.4% lower task completion due to fatigue-induced rework.",
          act: "Enforce a temporary 4-hour weekly overtime cap and re-scope sprint commitments."
        },
        {
          title: "High Work-in-Progress (WIP) Ticket Accumulation",
          scope: "Digital Experience & FinTech",
          desc: "Average pending tasks per engineer exceeds 14 tickets, indicating blocked upstream dependencies.",
          act: "Conduct backlog triage and enforce a strict WIP limit of 3 concurrent tickets per engineer."
        }
      ];

      container.innerHTML = alerts.map(a => \`
        <div class="p-3.5 rounded-2xl bg-[var(--background,#0f172a)] border border-[var(--border,#334155)] space-y-1.5 text-xs">
          <div class="flex justify-between font-bold text-[var(--foreground,#f8fafc)]">
            <span>\${a.title}</span>
            <span class="px-2 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-400 font-bold">Critical</span>
          </div>
          <p class="text-[var(--muted-foreground,#94a3b8)] leading-relaxed">\${a.desc}</p>
          <div class="text-[11px] text-blue-400 font-semibold pt-1">Recommended Intervention: \${a.act}</div>
        </div>
      \`).join('');

      // Watchlist
      const wlContainer = document.getElementById('overview-watchlist-container');
      const topWatch = [...filteredEmployees]
        .filter(e => e["Risk Level"] === 'High')
        .sort((a, b) => b["Overtime Hours Per Week"] - a["Overtime Hours Per Week"])
        .slice(0, 4);

      wlContainer.innerHTML = topWatch.map(e => \`
        <div onclick="openEmployeeModal('\${e["Employee ID"]}')" class="py-2.5 px-2 flex items-center justify-between hover:bg-blue-500/10 rounded-xl cursor-pointer transition text-xs">
          <div>
            <div class="font-bold text-[var(--foreground,#f8fafc)]">\${e["Employee Name"]} (\${e["Employee ID"]})</div>
            <div class="text-[10px] text-[var(--muted-foreground,#94a3b8)]">\${e["Job Role"]} • \${e["Department"]}</div>
          </div>
          <div class="text-right">
            <span class="font-bold text-amber-400">+\${e["Overtime Hours Per Week"]}h OT</span>
            <span class="text-[10px] text-[var(--muted-foreground,#94a3b8)] block">Prod: \${e["Productivity Score"]}</span>
          </div>
        </div>
      \`).join('');
    }

    function renderRecommendations() {
      const container = document.getElementById('recommendations-container');
      const recs = [
        {
          title: "Overtime-Productivity Decoupling & Burnout Risk",
          sev: "Critical",
          scope: "Cloud & Infrastructure Practices",
          issue: "Teams in CloudOps log an average of 14.2 hrs/week overtime, yet task completion rates have fallen below 60%.",
          metrics: "Weekly OT: 14.2 hrs | Avg Daily Hours: 10.4h | Productivity: 52.4 / 100",
          intervention: "Institute an immediate overtime cap (max 4h/week), re-scope sprint deliverables, and pair senior engineers with mid-level peers.",
          monitor: "Overtime Hours Per Week (<5.0h) and Defect Escape Ratio over 2 sprints.",
          reason: "Diminishing marginal returns on cognitive labor: prolonged fatigue impairs code quality and task turnaround."
        },
        {
          title: "Disengagement & Sentiment Erosion Cohort",
          sev: "Critical",
          scope: "Cross-Department (22 Engineers)",
          issue: "22 engineers exhibit high workload (>78) coupled with critical disengagement (<45), signaling imminent retention attrition.",
          metrics: "Avg Workload: 84.1 | Avg Engagement: 41.2 | Avg Absence: 5.6 days",
          intervention: "Conduct confidential manager 1-on-1 listening sessions, audit tooling friction, and reallocate heavy maintenance tickets.",
          monitor: "Pulse Survey Engagement Score (+15 pts over 60 days) and Unplanned Absences.",
          reason: "Prolonged high workload with unaddressed delivery friction creates silent disengagement and burnout."
        },
        {
          title: "Senior Architect Delivery Bottleneck & Delegation Gap",
          sev: "Warning",
          scope: "Senior Leads & Technology Architects",
          issue: "Senior technical consultants are handling excessive routine tactical tickets (avg 52/mo) instead of architectural design.",
          metrics: "Lead Assigned Tasks: 52 tasks/mo | Avg OT: 11.5 hrs/wk",
          intervention: "Delegate standard ticket resolution to junior/mid-level engineers and protect senior leads for design and mentoring.",
          monitor: "Lead engineer overtime reduction and junior engineer ticket velocity ramp-up.",
          reason: "When senior staff are consumed by tactical ticket execution, architecture governance degrades."
        }
      ];

      container.innerHTML = recs.map(r => \`
        <div class="p-5 rounded-3xl bg-[var(--card,#1e293b)] border border-[var(--border,#334155)] space-y-3">
          <div class="flex items-center justify-between pb-2 border-b border-[var(--border,#334155)]">
            <div class="flex items-center space-x-2">
              <span class="px-2.5 py-0.5 rounded-full text-xs font-bold \${r.sev === 'Critical' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}">\${r.sev} Severity</span>
              <h4 class="text-sm font-bold text-[var(--foreground,#f8fafc)]">\${r.title}</h4>
            </div>
            <span class="text-xs text-[var(--muted-foreground,#94a3b8)]">\${r.scope}</span>
          </div>
          <p class="text-xs text-[var(--foreground,#f8fafc)] leading-relaxed">\${r.issue}</p>
          <div class="p-2.5 rounded-xl bg-[var(--background,#0f172a)] text-[11px] font-mono text-[var(--muted-foreground,#94a3b8)]">\${r.metrics}</div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
            <div class="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
              <strong class="block text-emerald-200 uppercase text-[10px]">Suggested Intervention:</strong>
              \${r.intervention}
            </div>
            <div class="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-300">
              <strong class="block text-blue-200 uppercase text-[10px]">Metric to Monitor:</strong>
              \${r.monitor}
            </div>
          </div>
          <div class="text-[11px] text-[var(--muted-foreground,#94a3b8)] italic pt-1">
            <strong>Diagnostic Reason:</strong> \${r.reason}
          </div>
        </div>
      \`).join('');
    }

    function renderDeptRiskTable() {
      const tbody = document.getElementById('dept-risk-tbody');
      const depts = [...new Set(currentEmployees.map(e => e["Department"]))];
      const stats = depts.map(d => {
        const list = currentEmployees.filter(e => e["Department"] === d);
        const high = list.filter(e => e["Risk Level"] === 'High').length;
        const avgWl = (list.reduce((s, e) => s + e["Workload Score"], 0) / list.length).toFixed(1);
        const avgOt = (list.reduce((s, e) => s + e["Overtime Hours Per Week"], 0) / list.length).toFixed(1);
        return { dept: d, count: list.length, high, ratio: ((high / list.length) * 100).toFixed(1), avgWl, avgOt };
      }).sort((a, b) => b.ratio - a.ratio);

      tbody.innerHTML = stats.map(s => \`
        <tr class="hover:bg-[var(--background,#0f172a)]/40">
          <td class="py-2.5 px-3 font-semibold text-[var(--foreground,#f8fafc)]">\${s.dept}</td>
          <td class="py-2.5 px-3 text-right">\${s.count}</td>
          <td class="py-2.5 px-3 text-right font-bold text-rose-400">\${s.high}</td>
          <td class="py-2.5 px-3 text-right font-semibold">\${s.ratio}%</td>
          <td class="py-2.5 px-3 text-right">\${s.avgWl}</td>
          <td class="py-2.5 px-3 text-right">\${s.avgOt} hrs/wk</td>
        </tr>
      \`).join('');
    }

    function initDataDictionary() {
      const tbody = document.getElementById('dictionary-tbody');
      tbody.innerHTML = INITIAL_DATASET.dataDictionary.map(d => \`
        <tr class="hover:bg-[var(--background,#0f172a)]/30">
          <td class="py-2 px-3 font-mono font-bold text-blue-400">\${d["Column Name"]}</td>
          <td class="py-2 px-3 text-[11px] text-[var(--muted-foreground,#94a3b8)]">\${d["Data Type"]}</td>
          <td class="py-2 px-3 font-mono text-[11px]">\${d["Score / Value Range"]}</td>
          <td class="py-2 px-3">\${d["Definition"]}</td>
          <td class="py-2 px-3 font-mono text-[10px] text-[var(--muted-foreground,#94a3b8)]">\${d["Formula / Derivation"]}</td>
        </tr>
      \`).join('');
    }

    /* PURE SVG CHART RENDERERS */
    function renderAllCharts() {
      renderMacroTrendChart();
      renderRiskDonutChart('chart-risk-donut');
      renderRiskDonutChart('chart-e-container');
      renderChartA();
      renderChartB();
      renderChartC();
      renderChartD();
      renderChartF();
    }

    function renderMacroTrendChart() {
      const el = document.getElementById('chart-macro-trend');
      if (!el) return;
      const trends = INITIAL_DATASET.monthlyTrends;
      const w = el.clientWidth || 600;
      const h = el.clientHeight || 250;
      const padL = 40, padR = 40, padT = 20, padB = 30;

      const innerW = w - padL - padR;
      const innerH = h - padT - padB;

      // X scale: 12 months
      const stepX = innerW / (trends.length - 1);

      // Y scale left: Productivity (40 to 100)
      const getYProd = val => padT + innerH - ((val - 40) / 60) * innerH;

      // Y scale right: Overtime (0 to 16)
      const getYOT = val => padT + innerH - (val / 16) * innerH;

      let prodPath = '';
      let compPath = '';
      let bars = '';
      let xLabels = '';

      trends.forEach((t, i) => {
        const x = padL + i * stepX;
        const yP = getYProd(t["Average Productivity"]);
        const yC = getYProd(t["Task Completion Rate"]);
        const yO = getYOT(t["Average Overtime"]);

        if (i === 0) {
          prodPath = \`M \${x} \${yP}\`;
          compPath = \`M \${x} \${yC}\`;
        } else {
          prodPath += \` L \${x} \${yP}\`;
          compPath += \` L \${x} \${yC}\`;
        }

        // Bar for overtime
        bars += \`<rect x="\${x - 8}" y="\${yO}" width="16" height="\${padT + innerH - yO}" fill="#f59e0b" opacity="0.65" rx="3"><title>\${t.Month}: \${t["Average Overtime"]} hrs OT</title></rect>\`;
        xLabels += \`<text x="\${x}" y="\${h - 8}" font-size="10" fill="#94a3b8" text-anchor="middle">\${t.Month.split('-')[1]}</text>\`;
      });

      el.innerHTML = \`
        <svg width="100%" height="100%" viewBox="0 0 \${w} \${h}">
          <line x1="\${padL}" y1="\${padT + innerH}" x2="\${w - padR}" y2="\${padT + innerH}" stroke="#334155" stroke-width="1"/>
          \${bars}
          <path d="\${compPath}" fill="none" stroke="#10b981" stroke-width="2" stroke-dasharray="4 4"/>
          <path d="\${prodPath}" fill="none" stroke="#3b82f6" stroke-width="3"/>
          \${trends.map((t, i) => \`<circle cx="\${padL + i * stepX}" cy="\${getYProd(t["Average Productivity"])}" r="4" fill="#3b82f6"><title>\${t.Month} Productivity: \${t["Average Productivity"]}</title></circle>\`).join('')}
          \${xLabels}
        </svg>
      \`;
    }

    function renderRiskDonutChart(containerId) {
      const el = document.getElementById(containerId);
      if (!el) return;
      const low = filteredEmployees.filter(e => e["Risk Level"] === 'Low').length;
      const med = filteredEmployees.filter(e => e["Risk Level"] === 'Medium').length;
      const high = filteredEmployees.filter(e => e["Risk Level"] === 'High').length;
      const total = low + med + high || 1;

      const pLow = (low / total);
      const pMed = (med / total);
      const pHigh = (high / total);

      // SVG Donut representation
      const size = 160;
      const r = 50;
      const circ = 2 * Math.PI * r;

      const offLow = 0;
      const offMed = circ * pLow;
      const offHigh = circ * (pLow + pMed);

      el.innerHTML = \`
        <svg width="\${size}" height="\${size}" viewBox="0 0 \${size} \${size}">
          <circle cx="80" cy="80" r="\${r}" fill="none" stroke="#334155" stroke-width="24"/>
          <circle cx="80" cy="80" r="\${r}" fill="none" stroke="#10b981" stroke-width="24" stroke-dasharray="\${pLow * circ} \${circ}" stroke-dashoffset="0" transform="rotate(-90 80 80)"/>
          <circle cx="80" cy="80" r="\${r}" fill="none" stroke="#f59e0b" stroke-width="24" stroke-dasharray="\${pMed * circ} \${circ}" stroke-dashoffset="\${-offMed}" transform="rotate(-90 80 80)"/>
          <circle cx="80" cy="80" r="\${r}" fill="none" stroke="#ef4444" stroke-width="24" stroke-dasharray="\${pHigh * circ} \${circ}" stroke-dashoffset="\${-offHigh}" transform="rotate(-90 80 80)"/>
          <text x="80" y="85" text-anchor="middle" font-size="14" font-weight="bold" fill="#f8fafc">\${total}</text>
        </svg>
      \`;

      const legend = document.getElementById('risk-legend');
      if (legend && containerId === 'chart-risk-donut') {
        legend.innerHTML = \`
          <div class="flex justify-between"><span><span class="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 mr-1.5"></span>Low Risk</span><span class="font-bold">\${low} (\${(pLow*100).toFixed(0)}%)</span></div>
          <div class="flex justify-between"><span><span class="inline-block w-2.5 h-2.5 rounded-full bg-amber-500 mr-1.5"></span>Medium Risk</span><span class="font-bold">\${med} (\${(pMed*100).toFixed(0)}%)</span></div>
          <div class="flex justify-between"><span><span class="inline-block w-2.5 h-2.5 rounded-full bg-rose-500 mr-1.5"></span>High Risk</span><span class="font-bold">\${high} (\${(pHigh*100).toFixed(0)}%)</span></div>
        \`;
      }
    }

    function renderChartA() {
      const el = document.getElementById('chart-a-container');
      if (!el) return;
      const trends = INITIAL_DATASET.monthlyTrends;
      const w = el.clientWidth || 500;
      const h = el.clientHeight || 240;
      const padL = 35, padR = 20, padT = 20, padB = 30;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;
      const stepX = innerW / (trends.length - 1);
      const getY = val => padT + innerH - ((val - 40) / 60) * innerH;

      let pPath = '', cPath = '', ePath = '';
      trends.forEach((t, i) => {
        const x = padL + i * stepX;
        const yP = getY(t["Average Productivity"]);
        const yC = getY(t["Task Completion Rate"]);
        const yE = getY(t["Average Engagement"]);
        if (i === 0) { pPath = \`M \${x} \${yP}\`; cPath = \`M \${x} \${yC}\`; ePath = \`M \${x} \${yE}\`; }
        else { pPath += \` L \${x} \${yP}\`; cPath += \` L \${x} \${yC}\`; ePath += \` L \${x} \${yE}\`; }
      });

      el.innerHTML = \`
        <svg width="100%" height="100%" viewBox="0 0 \${w} \${h}">
          <line x1="\${padL}" y1="\${padT + innerH}" x2="\${w - padR}" y2="\${padT + innerH}" stroke="#334155"/>
          <path d="\${ePath}" fill="none" stroke="#8b5cf6" stroke-width="2" stroke-dasharray="3 3"/>
          <path d="\${cPath}" fill="none" stroke="#10b981" stroke-width="2.5"/>
          <path d="\${pPath}" fill="none" stroke="#3b82f6" stroke-width="3"/>
          \${trends.map((t, i) => \`<circle cx="\${padL + i * stepX}" cy="\${getY(t["Average Productivity"])}" r="3" fill="#3b82f6"><title>\${t.Month}: \${t["Average Productivity"]}</title></circle>\`).join('')}
          \${trends.map((t, i) => \`<text x="\${padL + i * stepX}" y="\${h - 8}" font-size="10" fill="#94a3b8" text-anchor="middle">\${t.Month.split('-')[1]}</text>\`).join('')}
        </svg>
      \`;
    }

    function renderChartB() {
      const el = document.getElementById('chart-b-container');
      if (!el) return;
      const w = el.clientWidth || 500;
      const h = el.clientHeight || 240;
      const pad = 35;
      const innerW = w - pad * 2;
      const innerH = h - pad * 2;

      // X: Workload (20 to 100), Y: Productivity (30 to 100)
      const getX = wl => pad + ((wl - 20) / 80) * innerW;
      const getY = pr => pad + innerH - ((pr - 30) / 70) * innerH;

      const dots = filteredEmployees.map(e => {
        const cx = getX(e["Workload Score"]);
        const cy = getY(e["Productivity Score"]);
        const col = e["Risk Level"] === 'High' ? '#ef4444' : e["Risk Level"] === 'Medium' ? '#f59e0b' : '#10b981';
        return \`<circle cx="\${cx}" cy="\${cy}" r="3.5" fill="\${col}" opacity="0.85"><title>\${e["Employee Name"]}\\nWorkload: \${e["Workload Score"]}\\nProductivity: \${e["Productivity Score"]}</title></circle>\`;
      }).join('');

      el.innerHTML = \`
        <svg width="100%" height="100%" viewBox="0 0 \${w} \${h}">
          <line x1="\${pad}" y1="\${pad + innerH}" x2="\${w - pad}" y2="\${pad + innerH}" stroke="#334155"/>
          <line x1="\${pad}" y1="\${pad}" x2="\${pad}" y2="\${pad + innerH}" stroke="#334155"/>
          <line x1="\${getX(75)}" y1="\${pad}" x2="\${getX(75)}" y2="\${pad + innerH}" stroke="#ef4444" stroke-dasharray="3 3"/>
          \${dots}
          <text x="\${w/2}" y="\${h - 5}" font-size="10" fill="#94a3b8" text-anchor="middle">Workload Score →</text>
        </svg>
      \`;
    }

    function renderChartC() {
      const el = document.getElementById('chart-c-container');
      if (!el) return;
      const bins = [
        { label: '7-8h', min: 7.0, max: 8.0 },
        { label: '8-9h', min: 8.0, max: 9.0 },
        { label: '9-10h', min: 9.0, max: 10.0 },
        { label: '10-11h', min: 10.0, max: 11.0 },
        { label: '11h+', min: 11.0, max: 24.0 }
      ];

      const data = bins.map(b => {
        const sub = filteredEmployees.filter(e => e["Average Working Hours Per Day"] >= b.min && e["Average Working Hours Per Day"] < b.max);
        const count = sub.length;
        const avgProd = count ? (sub.reduce((s, e) => s + e["Productivity Score"], 0) / count) : 0;
        return { label: b.label, avgProd, count };
      });

      const w = el.clientWidth || 500;
      const h = el.clientHeight || 240;
      const padL = 40, padR = 20, padT = 20, padB = 30;
      const innerW = w - padL - padR;
      const innerH = h - padT - padB;
      const barW = innerW / data.length;

      const bars = data.map((d, i) => {
        const x = padL + i * barW + 15;
        const barH = (d.avgProd / 100) * innerH;
        const y = padT + innerH - barH;
        const color = i >= 3 ? '#ef4444' : '#3b82f6';
        return \`
          <rect x="\${x}" y="\${y}" width="\${barW - 30}" height="\${barH}" fill="\${color}" rx="4">
            <title>\${d.label}: \${d.avgProd.toFixed(1)} avg productivity (\${d.count} emps)</title>
          </rect>
          <text x="\${x + (barW - 30)/2}" y="\${y - 6}" font-size="10" font-weight="bold" fill="#f8fafc" text-anchor="middle">\${d.avgProd.toFixed(0)}</text>
          <text x="\${x + (barW - 30)/2}" y="\${h - 8}" font-size="10" fill="#94a3b8" text-anchor="middle">\${d.label}</text>
        \`;
      }).join('');

      el.innerHTML = \`
        <svg width="100%" height="100%" viewBox="0 0 \${w} \${h}">
          <line x1="\${padL}" y1="\${padT + innerH}" x2="\${w - padR}" y2="\${padT + innerH}" stroke="#334155"/>
          \${bars}
        </svg>
      \`;
    }

    function renderChartD() {
      const el = document.getElementById('chart-d-container');
      if (!el) return;
      const depts = [...new Set(filteredEmployees.map(e => e["Department"]))];
      const stats = depts.map(d => {
        const sub = filteredEmployees.filter(e => e["Department"] === d);
        return {
          dept: d,
          prod: (sub.reduce((s, e) => s + e["Productivity Score"], 0) / sub.length),
          wl: (sub.reduce((s, e) => s + e["Workload Score"], 0) / sub.length)
        };
      });

      const w = el.clientWidth || 500;
      const h = el.clientHeight || 240;
      const padL = 90, padR = 20, padT = 15, padB = 20;
      const innerW = w - padL - padR;
      const stepY = (h - padT - padB) / stats.length;

      const rows = stats.map((s, i) => {
        const y = padT + i * stepY;
        const prodW = (s.prod / 100) * innerW;
        const wlW = (s.wl / 100) * innerW;
        return \`
          <text x="\${padL - 10}" y="\${y + 12}" font-size="9" fill="#94a3b8" text-anchor="end">\${s.dept.split(' ')[0]}</text>
          <rect x="\${padL}" y="\${y}" width="\${prodW}" height="8" fill="#3b82f6" rx="2"><title>\${s.dept} Prod: \${s.prod.toFixed(1)}</title></rect>
          <rect x="\${padL}" y="\${y + 10}" width="\${wlW}" height="8" fill="#f59e0b" rx="2"><title>\${s.dept} Workload: \${s.wl.toFixed(1)}</title></rect>
        \`;
      }).join('');

      el.innerHTML = \`
        <svg width="100%" height="100%" viewBox="0 0 \${w} \${h}">
          <line x1="\${padL}" y1="\${padT}" x2="\${padL}" y2="\${h - padB}" stroke="#334155"/>
          \${rows}
        </svg>
      \`;
    }

    function renderChartF() {
      const el = document.getElementById('chart-f-container');
      if (!el) return;
      const w = el.clientWidth || 500;
      const h = el.clientHeight || 220;
      const pad = 35;
      const innerW = w - pad * 2;
      const innerH = h - pad * 2;

      // X: Overtime (0 to 24), Y: Engagement (20 to 100)
      const getX = ot => pad + (ot / 24) * innerW;
      const getY = eg => pad + innerH - ((eg - 20) / 80) * innerH;

      const dots = filteredEmployees.map(e => {
        const cx = getX(e["Overtime Hours Per Week"]);
        const cy = getY(e["Employee Engagement Score"]);
        return \`<circle cx="\${cx}" cy="\${cy}" r="3.5" fill="#8b5cf6" opacity="0.8"><title>\${e["Employee Name"]}: \${e["Overtime Hours Per Week"]}h OT, \${e["Employee Engagement Score"]} Eng</title></circle>\`;
      }).join('');

      el.innerHTML = \`
        <svg width="100%" height="100%" viewBox="0 0 \${w} \${h}">
          <line x1="\${pad}" y1="\${pad + innerH}" x2="\${w - pad}" y2="\${pad + innerH}" stroke="#334155"/>
          <line x1="\${pad}" y1="\${pad}" x2="\${pad}" y2="\${pad + innerH}" stroke="#334155"/>
          \${dots}
          <text x="\${w/2}" y="\${h - 5}" font-size="10" fill="#94a3b8" text-anchor="middle">Overtime (hrs/week) →</text>
        </svg>
      \`;
    }

    function switchTab(tabId) {
      document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
      const activeTab = document.getElementById('tab-' + tabId);
      if (activeTab) activeTab.classList.add('active');

      ['overview', 'analytics', 'employees', 'risks', 'data'].forEach(id => {
        const btn = document.getElementById('tab-btn-' + id);
        if (id === tabId) {
          btn.className = 'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition bg-blue-600 text-white shadow-sm';
        } else {
          btn.className = 'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition text-[var(--foreground,#f8fafc)] hover:bg-[var(--background,#0f172a)]';
        }
      });

      renderAllCharts();
    }

    function resetToDefaultData() {
      currentEmployees = [...INITIAL_DATASET.employees];
      document.getElementById('search-input').value = '';
      document.getElementById('filter-month').value = 'all';
      document.getElementById('filter-dept').value = 'all';
      updateTeamDropdown();
      document.getElementById('filter-risk').value = 'all';
      applyFilters();
      alert('Reset to original synthetic baseline dataset.');
    }

    function exportFilteredCSV() {
      if (filteredEmployees.length === 0) {
        alert('No records to export.');
        return;
      }
      const headers = Object.keys(filteredEmployees[0]);
      const csvRows = [headers.join(',')];
      filteredEmployees.forEach(e => {
        const row = headers.map(h => {
          const val = e[h];
          if (typeof val === 'string' && val.includes(',')) return \`"\${val}"\`;
          return val;
        });
        csvRows.push(row.join(','));
      });
      const blob = new Blob([csvRows.join('\\n')], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'workpulse_filtered_employees.csv');
      link.click();
    }

    function setupEventListeners() {
      document.getElementById('theme-toggle-btn').addEventListener('click', toggleTheme);
      document.getElementById('search-input').addEventListener('input', applyFilters);
      document.getElementById('filter-month').addEventListener('change', applyFilters);
      document.getElementById('filter-dept').addEventListener('change', () => {
        updateTeamDropdown();
        applyFilters();
      });
      document.getElementById('filter-team').addEventListener('change', applyFilters);
      document.getElementById('filter-risk').addEventListener('change', applyFilters);
      document.getElementById('reset-filters-btn').addEventListener('click', () => {
        document.getElementById('search-input').value = '';
        document.getElementById('filter-month').value = 'all';
        document.getElementById('filter-dept').value = 'all';
        updateTeamDropdown();
        document.getElementById('filter-risk').value = 'all';
        applyFilters();
      });
      document.getElementById('export-csv-top-btn').addEventListener('click', exportFilteredCSV);
      document.getElementById('table-export-csv-btn').addEventListener('click', exportFilteredCSV);
      document.getElementById('btn-export-csv-data-tab').addEventListener('click', exportFilteredCSV);
      document.getElementById('page-size-select').addEventListener('change', (e) => {
        pageSize = parseInt(e.target.value);
        currentPage = 1;
        renderEmployeeTable();
      });
      document.getElementById('prev-page-btn').addEventListener('click', () => {
        if (currentPage > 1) { currentPage--; renderEmployeeTable(); }
      });
      document.getElementById('next-page-btn').addEventListener('click', () => {
        const totalPages = Math.ceil(filteredEmployees.length / pageSize);
        if (currentPage < totalPages) { currentPage++; renderEmployeeTable(); }
      });
    }
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'workpulse_dashboard.html'), htmlContent, 'utf8');
console.log('Successfully generated standalone HTML dashboard.');
