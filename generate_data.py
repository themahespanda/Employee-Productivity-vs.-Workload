import os
import random
import numpy as np
import pandas as pd
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

# Set fixed random seed for 100% reproducibility
SEED = 42
random.seed(SEED)
np.random.seed(SEED)

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")
os.makedirs(OUTPUT_DIR, exist_ok=True)
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "employee_productivity_synthetic.xlsx")

# Business Context: Infosys enterprise service lines and roles
DEPARTMENTS = [
    "Cloud & Infrastructure",
    "Digital Experience",
    "Enterprise Application Services",
    "Data & AI",
    "Cyber Security",
    "Engineering Services",
    "Quality Engineering",
]

ROLES_BY_DEPT = {
    "Cloud & Infrastructure": ["Cloud Operations Engineer", "DevOps Specialist", "Systems Architect", "Site Reliability Engineer", "Infrastructure Consultant"],
    "Digital Experience": ["Frontend UI/UX Specialist", "Full Stack Developer", "Experience Architect", "Digital Product Designer", "Solutions Consultant"],
    "Enterprise Application Services": ["SAP/ERP Consultant", "CRM Specialist", "Integration Architect", "Enterprise Solution Lead", "Technical Consultant"],
    "Data & AI": ["Data Engineer", "Machine Learning Specialist", "BI Analytics Consultant", "AI Research Associate", "Data Architect"],
    "Cyber Security": ["Security Operations Analyst", "Vulnerability Assessment Specialist", "Identity & Access Manager", "Cloud Security Architect", "Compliance Lead"],
    "Engineering Services": ["Embedded Software Engineer", "Product Lifecycle Consultant", "IoT Systems Engineer", "Quality Lead", "Technical Architect"],
    "Quality Engineering": ["Automation Test Specialist", "Performance Engineering Analyst", "SDET Lead", "Quality Assurance Analyst", "Continuous Testing Architect"],
}

TEAMS_BY_DEPT = {
    "Cloud & Infrastructure": ["CloudOps Alpha", "CloudOps Beta", "Hybrid Platform Team", "SRE Velocity"],
    "Digital Experience": ["FinTech Experience", "Retail Digital Studio", "OmniChannel Portal", "UI Platform Guild"],
    "Enterprise Application Services": ["SAP Core Modernization", "Salesforce Cloud Pod", "Oracle ERP Services", "Integration Nexus"],
    "Data & AI": ["Predictive Analytics Pod", "Enterprise GenAI Lab", "Data Lakehouse Ops", "BI Modernization"],
    "Cyber Security": ["CyberShield SOC", "Threat Intelligence Pod", "ZeroTrust Identity", "SecOps Compliance"],
    "Engineering Services": ["Smart Edge Mobility", "Connected Devices Lab", "PLM Modernization", "AutoTech Systems"],
    "Quality Engineering": ["Automation Matrix", "Performance Guild", "Continuous Quality Pod", "API Test Labs"],
}

MANAGERS = [
    "Arunachalam Murthy", "Priya Venkatesh", "Kavita Sundaram", "Rajeshwar Rao",
    "Sneha Kulkarni", "Vikramaditya Sengupta", "Deepak Nambiar", "Ananya Deshmukh",
    "Rohan Nambisan", "Swati Bhasin", "Gautam Subramanian", "Pooja Hegde"
]

FIRST_NAMES = [
    "Aarav", "Aditi", "Akhil", "Amrita", "Anand", "Aniket", "Ankita", "Arjun", "Ashwin", "Bhavna",
    "Chaitanya", "Deepa", "Dev", "Divya", "Gaurav", "Gayatri", "Harish", "Isha", "Jayant", "Jyoti",
    "Karthik", "Kavya", "Kiran", "Lakshmi", "Manish", "Meera", "Manoj", "Neha", "Nikhil", "Nisha",
    "Pranav", "Prerna", "Rahul", "Ritu", "Rohan", "Roshni", "Sachin", "Sameer", "Sangeeta", "Sanjay",
    "Shalini", "Shreya", "Siddharth", "Simran", "Snehal", "Suresh", "Tanvi", "Tarun", "Umesh", "Varun",
    "Vidya", "Vijay", "Vinay", "Vipul", "Yash", "Zoya", "Abhishek", "Bhavik", "Chetan", "Darshan"
]

LAST_NAMES = [
    "Sharma", "Verma", "Iyer", "Patel", "Reddy", "Nair", "Kulkarni", "Mukherjee", "Chatterjee", "Gupta",
    "Bose", "Menon", "Pillai", "Choudhury", "Bhattacharya", "Deshpande", "Joshi", "Rao", "Hegde", "Shetty",
    "Srinivasan", "Naidu", "Agarwal", "Mehta", "Malhotra", "Kapoor", "Bansal", "Saxena", "Mishra", "Pandey"
]

MONTHS_12 = [
    "2025-11", "2025-12", "2026-01", "2026-02", "2026-03", "2026-04",
    "2026-05", "2026-06", "2026-07", "2026-08", "2026-09", "2026-10"
]

REPORTING_MONTH = "2026-10"

def generate_employees(n=200):
    rows = []
    used_names = set()

    for i in range(1, n + 1):
        emp_id = f"INF-{1000 + i}"
        
        while True:
            fn = random.choice(FIRST_NAMES)
            ln = random.choice(LAST_NAMES)
            full_name = f"{fn} {ln}"
            if full_name not in used_names:
                used_names.add(full_name)
                break
        
        dept = random.choice(DEPARTMENTS)
        role = random.choice(ROLES_BY_DEPT[dept])
        team = random.choice(TEAMS_BY_DEPT[dept])
        manager = random.choice(MANAGERS)
        exp = round(random.uniform(1.0, 18.0), 1)

        # Baseline workload profiles: create authentic varied correlation
        # Profile types:
        # A. High Overtime / Burnout Bottleneck: high hours, high overtime, high workload, declining productivity & engagement (approx 20%)
        # B. Balanced High Performer: normal/moderate overtime, high productivity, high engagement (approx 35%)
        # C. Average Contributor: standard workload, moderate productivity, standard engagement (approx 30%)
        # D. Under-allocated / Disengaged: low workload, lower engagement, moderate/low productivity (approx 15%)
        profile_rand = random.random()
        if profile_rand < 0.22:
            # Overloaded / Bottlenecked
            workload = round(random.uniform(78.0, 98.0), 1)
            avg_hours = round(random.uniform(9.5, 12.0), 1)
            overtime_hours = round(random.uniform(12.0, 24.0), 1)
            assigned_tasks = random.randint(45, 75)
            # Declining productivity despite long hours
            productivity = round(random.uniform(42.0, 68.0), 1)
            engagement = round(random.uniform(35.0, 62.0), 1)
            absent_days = random.randint(3, 9)
        elif profile_rand < 0.57:
            # Balanced High Performer
            workload = round(random.uniform(52.0, 75.0), 1)
            avg_hours = round(random.uniform(8.0, 9.2), 1)
            overtime_hours = round(random.uniform(1.0, 7.0), 1)
            assigned_tasks = random.randint(32, 55)
            productivity = round(random.uniform(78.0, 96.0), 1)
            engagement = round(random.uniform(75.0, 95.0), 1)
            absent_days = random.randint(0, 3)
        elif profile_rand < 0.85:
            # Steady Moderate Contributor
            workload = round(random.uniform(50.0, 72.0), 1)
            avg_hours = round(random.uniform(8.0, 8.8), 1)
            overtime_hours = round(random.uniform(0.0, 6.0), 1)
            assigned_tasks = random.randint(25, 45)
            productivity = round(random.uniform(65.0, 79.0), 1)
            engagement = round(random.uniform(60.0, 78.0), 1)
            absent_days = random.randint(1, 4)
        else:
            # Under-allocated or low motivation
            workload = round(random.uniform(30.0, 52.0), 1)
            avg_hours = round(random.uniform(7.2, 8.1), 1)
            overtime_hours = round(random.uniform(0.0, 3.0), 1)
            assigned_tasks = random.randint(18, 32)
            productivity = round(random.uniform(50.0, 68.0), 1)
            engagement = round(random.uniform(40.0, 62.0), 1)
            absent_days = random.randint(2, 6)

        # Realistic occasional exception / outlier (approx 10% chance)
        if random.random() < 0.10:
            if random.random() < 0.5:
                # Heroic exception: High overtime & still high productivity (short-term sprint)
                overtime_hours = round(random.uniform(14.0, 20.0), 1)
                avg_hours = round(random.uniform(9.5, 11.0), 1)
                productivity = round(random.uniform(85.0, 94.0), 1)
                workload = round(random.uniform(82.0, 94.0), 1)
            else:
                # Disengaged low hours but high pending
                avg_hours = round(random.uniform(7.5, 8.0), 1)
                overtime_hours = 0.0
                productivity = round(random.uniform(38.0, 50.0), 1)
                workload = round(random.uniform(65.0, 75.0), 1)

        # Performance score correlated with productivity and engagement with some noise
        performance = round(np.clip(0.65 * productivity + 0.25 * engagement + random.uniform(-4, 4), 30.0, 99.0), 1)

        # Task completion rate aligned with productivity
        # Expected completion rate approximately (productivity / 100 * 0.95) with variance
        completion_ratio = np.clip((productivity / 100.0) * random.uniform(0.90, 1.05), 0.35, 0.99)
        completed_tasks = int(round(assigned_tasks * completion_ratio))
        completed_tasks = min(completed_tasks, assigned_tasks)
        pending_tasks = assigned_tasks - completed_tasks
        task_completion_rate = round((completed_tasks / assigned_tasks) * 100.0, 1)

        # Workload Risk Scoring formula:
        # High workload, high overtime, low engagement, high absenteeism, low productivity
        # Normalized weighted index:
        # Workload: 30%, Overtime: 25%, (100 - Engagement): 20%, (100 - Productivity): 15%, Absenteeism: 10%
        norm_ot = min(overtime_hours / 20.0, 1.0) * 100.0
        norm_abs = min(absent_days / 8.0, 1.0) * 100.0
        risk_composite = (
            0.30 * workload +
            0.25 * norm_ot +
            0.20 * (100.0 - engagement) +
            0.15 * (100.0 - productivity) +
            0.10 * norm_abs
        )

        if risk_composite >= 65.0 or (workload >= 80.0 and (overtime_hours >= 12.0 or productivity < 65.0)):
            risk_level = "High"
        elif risk_composite >= 42.0:
            risk_level = "Medium"
        else:
            risk_level = "Low"

        rows.append({
            "Employee ID": emp_id,
            "Employee Name": full_name,
            "Department": dept,
            "Job Role": role,
            "Team": team,
            "Manager": manager,
            "Experience Years": exp,
            "Assigned Tasks": assigned_tasks,
            "Completed Tasks": completed_tasks,
            "Pending Tasks": pending_tasks,
            "Average Working Hours Per Day": avg_hours,
            "Overtime Hours Per Week": overtime_hours,
            "Absence Days": absent_days,
            "Employee Engagement Score": engagement,
            "Performance Score": performance,
            "Task Completion Rate": task_completion_rate,
            "Workload Score": workload,
            "Productivity Score": productivity,
            "Risk Level": risk_level,
            "Reporting Month": REPORTING_MONTH,
        })

    return pd.DataFrame(rows)

def generate_monthly_trends(current_df):
    # Simulate a realistic 12-month trend:
    # In earlier months (Nov 2025 to Feb 2026), working hours & overtime were lower and productivity was higher.
    # From March 2026 to October 2026, working hours and overtime progressively increased due to aggressive delivery pushes,
    # yet productivity and engagement progressively plateaued and dipped—illustrating the core problem statement!
    
    current_avg_prod = round(current_df["Productivity Score"].mean(), 1)
    current_avg_hrs = round(current_df["Average Working Hours Per Day"].mean(), 1)
    current_avg_ot = round(current_df["Overtime Hours Per Week"].mean(), 1)
    current_avg_eng = round(current_df["Employee Engagement Score"].mean(), 1)
    current_avg_comp = round(current_df["Task Completion Rate"].mean(), 1)
    current_avg_abs = round((current_df["Absence Days"].mean() / 22.0) * 100.0, 1) # ~ monthly workdays
    current_avg_wl = round(current_df["Workload Score"].mean(), 1)

    # Offsets leading up to current month (October 2026 is month index 11)
    # Month multipliers or relative offsets:
    trend_specs = [
        # (Month, prod_adj, hrs_adj, ot_adj, eng_adj, comp_adj, abs_adj, wl_adj)
        ("2025-11", +6.2, -0.65, -3.2, +8.4, +5.5, -1.8, -7.0),
        ("2025-12", +5.8, -0.70, -3.5, +9.1, +5.2, +0.5, -8.2), # holidays, higher engagement
        ("2026-01", +5.4, -0.45, -2.4, +7.2, +4.8, -1.2, -5.5),
        ("2026-02", +4.6, -0.30, -1.8, +6.0, +3.9, -1.0, -4.2),
        ("2026-03", +3.8, -0.15, -0.9, +4.5, +3.1, -0.6, -2.5),
        ("2026-04", +2.5, +0.05, +0.2, +2.8, +2.0, -0.3, +0.0),
        ("2026-05", +1.8, +0.20, +0.8, +1.5, +1.2, +0.2, +1.5),
        ("2026-06", +0.9, +0.32, +1.4, +0.5, +0.4, +0.6, +2.8),
        ("2026-07", +0.2, +0.45, +1.9, -0.8, -0.5, +0.9, +4.0),
        ("2026-08", -0.4, +0.52, +2.3, -1.6, -1.1, +1.2, +5.2),
        ("2026-09", -0.8, +0.58, +2.6, -2.2, -1.6, +1.5, +5.8),
        ("2026-10", 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0), # Current month matches employee sheet averages!
    ]

    trend_rows = []
    for month_str, d_prod, d_hrs, d_ot, d_eng, d_comp, d_abs, d_wl in trend_specs:
        trend_rows.append({
            "Month": month_str,
            "Average Productivity": round(np.clip(current_avg_prod + d_prod, 40.0, 98.0), 1),
            "Average Working Hours": round(np.clip(current_avg_hrs + d_hrs, 7.0, 12.0), 1),
            "Average Overtime": round(max(0.0, current_avg_ot + d_ot), 1),
            "Average Engagement": round(np.clip(current_avg_eng + d_eng, 30.0, 98.0), 1),
            "Task Completion Rate": round(np.clip(current_avg_comp + d_comp, 40.0, 99.0), 1),
            "Absenteeism Rate": round(np.clip(current_avg_abs + d_abs, 1.0, 25.0), 1),
            "Average Workload Score": round(np.clip(current_avg_wl + d_wl, 30.0, 95.0), 1),
        })

    return pd.DataFrame(trend_rows)

def generate_department_metrics(emp_df):
    dept_rows = []
    for dept in DEPARTMENTS:
        subset = emp_df[emp_df["Department"] == dept]
        count = len(subset)
        if count == 0:
            continue
        dept_rows.append({
            "Department": dept,
            "Employee Count": count,
            "Average Productivity": round(subset["Productivity Score"].mean(), 1),
            "Average Workload Score": round(subset["Workload Score"].mean(), 1),
            "Average Overtime": round(subset["Overtime Hours Per Week"].mean(), 1),
            "Average Engagement": round(subset["Employee Engagement Score"].mean(), 1),
            "Absenteeism Rate": round((subset["Absence Days"].mean() / 22.0) * 100.0, 1),
            "Task Completion Rate": round(subset["Task Completion Rate"].mean(), 1),
        })
    return pd.DataFrame(dept_rows)

def generate_data_dictionary():
    dict_data = [
        {
            "Column Name": "Employee ID",
            "Worksheet": "Employees",
            "Data Type": "String (Identifier)",
            "Definition": "Unique fictional employee identifier code prefixed with INF-",
            "Score / Value Range": "INF-1001 to INF-1200",
            "Formula / Derivation": "Sequential alphanumeric formatting"
        },
        {
            "Column Name": "Employee Name",
            "Worksheet": "Employees",
            "Data Type": "String",
            "Definition": "Fictional employee full name (synthetic data for simulation only)",
            "Score / Value Range": "Fictional first & last names",
            "Formula / Derivation": "Random combination from synthetic name repository"
        },
        {
            "Column Name": "Department",
            "Worksheet": "Employees",
            "Data Type": "Categorical String",
            "Definition": "Enterprise organizational service unit / business practice",
            "Score / Value Range": "7 Core Practice Units (Cloud, Digital, EAS, Data/AI, Cyber, Eng, QE)",
            "Formula / Derivation": "Assigned organizational unit"
        },
        {
            "Column Name": "Job Role",
            "Worksheet": "Employees",
            "Data Type": "Categorical String",
            "Definition": "Professional technical designation / role description",
            "Score / Value Range": "Standard enterprise delivery roles",
            "Formula / Derivation": "Role tier within relevant service practice"
        },
        {
            "Column Name": "Team",
            "Worksheet": "Employees",
            "Data Type": "Categorical String",
            "Definition": "Project team / delivery pod assignment",
            "Score / Value Range": "Delivery pod identifier",
            "Formula / Derivation": "Functional team assignment"
        },
        {
            "Column Name": "Manager",
            "Worksheet": "Employees",
            "Data Type": "String",
            "Definition": "Designated project manager / delivery director",
            "Score / Value Range": "12 Fictional delivery leads",
            "Formula / Derivation": "Assigned reporting manager"
        },
        {
            "Column Name": "Experience Years",
            "Worksheet": "Employees",
            "Data Type": "Numeric (Float)",
            "Definition": "Total career professional experience in years",
            "Score / Value Range": "1.0 to 18.0 years",
            "Formula / Derivation": "Synthetic continuous variable"
        },
        {
            "Column Name": "Assigned Tasks",
            "Worksheet": "Employees",
            "Data Type": "Integer",
            "Definition": "Total number of sprint / project work tickets assigned in reporting month",
            "Score / Value Range": "15 to 80 tasks",
            "Formula / Derivation": "Work package assignment"
        },
        {
            "Column Name": "Completed Tasks",
            "Worksheet": "Employees",
            "Data Type": "Integer",
            "Definition": "Number of work tickets verified as completed and delivered",
            "Score / Value Range": "0 to Assigned Tasks",
            "Formula / Derivation": "Verified delivered tasks (always <= Assigned Tasks)"
        },
        {
            "Column Name": "Pending Tasks",
            "Worksheet": "Employees",
            "Data Type": "Integer",
            "Definition": "Tasks in progress, blocked, or carried forward to next cycle",
            "Score / Value Range": "0 to Assigned Tasks",
            "Formula / Derivation": "Pending Tasks = Assigned Tasks - Completed Tasks"
        },
        {
            "Column Name": "Average Working Hours Per Day",
            "Worksheet": "Employees",
            "Data Type": "Numeric (Float)",
            "Definition": "Mean daily active system / project logged work hours",
            "Score / Value Range": "7.0 to 12.0 hours/day",
            "Formula / Derivation": "Total logged monthly hours / active working days"
        },
        {
            "Column Name": "Overtime Hours Per Week",
            "Worksheet": "Employees",
            "Data Type": "Numeric (Float)",
            "Definition": "Weekly hours logged beyond standard 40-hour contract baseline",
            "Score / Value Range": "0.0 to 25.0 hours/week",
            "Formula / Derivation": "Max(0, (Weekly Logged Hours - 40.0))"
        },
        {
            "Column Name": "Absence Days",
            "Worksheet": "Employees",
            "Data Type": "Integer",
            "Definition": "Total unplanned or planned absence days during reporting month",
            "Score / Value Range": "0 to 12 days",
            "Formula / Derivation": "Timesheet recorded leave entries"
        },
        {
            "Column Name": "Employee Engagement Score",
            "Worksheet": "Employees",
            "Data Type": "Numeric (Float)",
            "Definition": "Composite index reflecting sentiment, pulse survey feedback, and participation",
            "Score / Value Range": "0.0 to 100.0",
            "Formula / Derivation": "Normalized pulse survey and engagement sentiment index"
        },
        {
            "Column Name": "Performance Score",
            "Worksheet": "Employees",
            "Data Type": "Numeric (Float)",
            "Definition": "Quality and deliverable review score evaluated by project leads",
            "Score / Value Range": "0.0 to 100.0",
            "Formula / Derivation": "Weighted score based on code review, delivery milestones, and quality"
        },
        {
            "Column Name": "Task Completion Rate",
            "Worksheet": "Employees",
            "Data Type": "Numeric Percentage",
            "Definition": "Proportion of assigned tasks completed during reporting cycle",
            "Score / Value Range": "0.0% to 100.0%",
            "Formula / Derivation": "(Completed Tasks / Assigned Tasks) * 100"
        },
        {
            "Column Name": "Workload Score",
            "Worksheet": "Employees",
            "Data Type": "Numeric (Float)",
            "Definition": "Normalized metric of workload volume, complexity, and active commitments",
            "Score / Value Range": "0.0 to 100.0",
            "Formula / Derivation": "Composite index of assigned story points, context switches, and hours"
        },
        {
            "Column Name": "Productivity Score",
            "Worksheet": "Employees",
            "Data Type": "Numeric (Float)",
            "Definition": "Effective value delivered per unit of effort and time invested",
            "Score / Value Range": "0.0 to 100.0",
            "Formula / Derivation": "Weighted function: 0.50*(Task Completion) + 0.35*(Performance) + 0.15*(Velocity/Hour)"
        },
        {
            "Column Name": "Risk Level",
            "Worksheet": "Employees",
            "Data Type": "Categorical ('Low' | 'Medium' | 'High')",
            "Definition": "Operational Workload Risk classification flag indicating intervention priority",
            "Score / Value Range": "Low (Score < 42), Medium (42 <= Score < 65), High (Score >= 65)",
            "Formula / Derivation": "Weighted multi-factor operational bottleneck scoring algorithm"
        },
        {
            "Column Name": "Reporting Month",
            "Worksheet": "Employees",
            "Data Type": "ISO Date String (YYYY-MM)",
            "Definition": "Monthly analytics reporting snapshot period",
            "Score / Value Range": "2026-10",
            "Formula / Derivation": "Snapshot period key"
        }
    ]
    return pd.DataFrame(dict_data)

def style_and_export_workbook(emp_df, trend_df, dept_df, dict_df, filepath):
    with pd.ExcelWriter(filepath, engine="openpyxl") as writer:
        emp_df.to_excel(writer, sheet_name="Employees", index=False)
        trend_df.to_excel(writer, sheet_name="Monthly Trends", index=False)
        dept_df.to_excel(writer, sheet_name="Department Metrics", index=False)
        dict_df.to_excel(writer, sheet_name="Data Dictionary", index=False)

        workbook = writer.book

        # Enterprise styling
        header_fill = PatternFill(start_color="1E293B", end_color="1E293B", fill_type="solid") # Slate 800
        header_font = Font(name="Segoe UI", size=11, bold=True, color="FFFFFF")
        regular_font = Font(name="Segoe UI", size=10)
        border_thin = Border(
            left=Side(style='thin', color='E2E8F0'),
            right=Side(style='thin', color='E2E8F0'),
            top=Side(style='thin', color='E2E8F0'),
            bottom=Side(style='thin', color='E2E8F0')
        )

        for sheetname in workbook.sheetnames:
            ws = workbook[sheetname]
            ws.views.sheetView[0].showGridLines = True

            # Header styling
            for col_idx in range(1, ws.max_column + 1):
                cell = ws.cell(row=1, column=col_idx)
                cell.fill = header_fill
                cell.font = header_font
                cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)

            ws.row_dimensions[1].height = 28

            # Data rows styling and auto column width
            for row in range(2, ws.max_row + 1):
                ws.row_dimensions[row].height = 20
                for col in range(1, ws.max_column + 1):
                    cell = ws.cell(row=row, column=col)
                    cell.font = regular_font
                    cell.border = border_thin
                    if isinstance(cell.value, (int, float)):
                        cell.alignment = Alignment(horizontal="right", vertical="center")
                    else:
                        cell.alignment = Alignment(horizontal="left", vertical="center")

            # Column width calculation
            for col in ws.columns:
                max_len = 0
                col_letter = get_column_letter(col[0].column)
                for cell in col:
                    if cell.value is not None:
                        val_str = str(cell.value)
                        max_len = max(max_len, len(val_str))
                ws.column_dimensions[col_letter].width = max(max_len + 4, 12)

    print(f"Successfully generated synthetic enterprise workbook: {filepath}")

def main():
    print("Generating synthetic dataset...")
    emp_df = generate_employees(200)
    trend_df = generate_monthly_trends(emp_df)
    dept_df = generate_department_metrics(emp_df)
    dict_df = generate_data_dictionary()

    style_and_export_workbook(emp_df, trend_df, dept_df, dict_df, OUTPUT_FILE)
    
    # Also save a JSON copy for instant frontend loading and zero-latency bootstrapping
    json_path = os.path.join(OUTPUT_DIR, "synthetic_dataset.json")
    full_data = {
        "metadata": {
            "version": "1.0.0",
            "context": "Infosys (Illustrative Synthetic Dataset - Not real personal data)",
            "reportingMonth": REPORTING_MONTH,
            "recordCount": len(emp_df),
            "generatedAt": "2026-10-28"
        },
        "employees": emp_df.to_dict(orient="records"),
        "monthlyTrends": trend_df.to_dict(orient="records"),
        "departmentMetrics": dept_df.to_dict(orient="records"),
        "dataDictionary": dict_df.to_dict(orient="records")
    }
    import json
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(full_data, f, indent=2)
    print(f"Saved JSON cache to {json_path}")

if __name__ == "__main__":
    main()
