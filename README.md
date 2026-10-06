# EV Cyber Academy — Lead Management System (CRM)

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Cost](https://img.shields.io/badge/Database%20Cost-%E2%82%B90%20(Free%20Tier)-emerald.svg)
![React](https://img.shields.io/badge/React-18.3-61DAFB.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6.svg)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg)
![Supabase](https://img.shields.io/badge/Supabase-Realtime%20%26%20Auth-3ECF8E.svg)
![Vercel](https://img.shields.io/badge/Deployment-Vercel%20Hobby-000000.svg)

A production-ready, internal **Lead Management & Admissions System** built specifically for **EV Cyber Academy** to manually enter, manage, follow up, collect course fees, and track candidate conversions in real time across laptop and mobile devices.

---

## ⚡ Non-Negotiable ₹0 Cost Guarantee

This application is strictly engineered to operate at **₹0/month** database and infrastructure cost forever using:

* **Supabase Free Tier** (500 MB PostgreSQL database, 50,000 monthly active users, 200 concurrent Realtime connections, 2 GB file storage)
* **Vercel Free Tier** (Serverless hosting with global Edge CDN)
* **GitHub Free Tier** (Source code version control & automated CI/CD)

> **IMPORTANT**: DO NOT upgrade to a paid Supabase plan or add paid backend/SMS/CRM APIs. This system operates 100% within the free quotas.

---

## 🚀 Key Features & Capabilities

1. **Streamlined High-Impact Dashboard**:
   * Clean 3-Command Metrics focus: **Total Revenue** (with Collected & Pending balance), **Total Leads** (with New enquiries and Converted rates), and **Pending Follow-ups** (with Due Today & Overdue alerts).
   * Direct Action Center: Urgent Follow-ups quick action queue (with 1-click Call & WhatsApp shortcuts) and Recent Leads activity feed.
   * Completely configurable widgets with zero clutter.
2. **A-to-Z Settings Engine**:
   * **Organization & Brand Identity**: Custom academy name, tagline, currency symbol/code (`₹`, `$`, `€`, `£`, etc.), and support details.
   * **Dashboard Customizer**: Toggle any card, metric, or chart ON/OFF + custom welcome banner headlines.
   * **Programs & Offerings Catalog**: Add, edit, remove courses with default tuition fees.
   * **Lead Acquisition Channels**: Manage sources dynamically.
   * **Pipeline Stages & Follow-up Rules**: Customize stages, intervals (+1d, +3d, +7d), and note templates.
   * **Appearance & Display**: Dark Mode, Light Mode, and Table density (Comfortable / Compact).
   * **Database Backups**: Full JSON export/restore and factory reset engine.
3. **Real-Time Cross-Device Sync**: Any lead created or updated immediately reflects across all screens without page refreshes using **Supabase Realtime (`postgres_changes`)**.
4. **Comprehensive Lead Model & Fee Ledger**:
   * Candidate info, agreed tuition fee, paid amount, and auto-calculated pending balances.
6. **Admissions Follow-Up Command Center**:
   * Scheduled follow-up dates and action notes.
   * Visual indicators for **Overdue Follow-ups** and **Today's Follow-ups**.
   * One-click Direct Call (`tel:`) and Direct WhatsApp (`https://wa.me/`) shortcuts.
7. **Lead Directory & Search**:
   * Global debounced search across Name, Phone, Email, and Notes.
   * Multi-criteria filtering by Status, Program, Source, and Follow-up timeframe.
   * Responsive dual view: Data table on desktop & responsive touch cards on mobile.
8. **Safe Deletion & Archiving**:
   * Soft-delete / Archive support to preserve historical interaction data.
   * Permanent deletion confirmation dialog to avoid accidental loss.
9. **Zero-Cost Backup & Restore**:
   * Export all lead records to a timestamped JSON file (`ev-leads-backup-YYYY-MM-DD.json`).
   * Import JSON with **Option 1: Add to Existing Data (Merge)** or **Option 2: Replace All Data (With confirmation)**.

---

## 🛠️ Project Structure

```
web-based-crm/
├── public/
├── src/
│   ├── components/
│   │   ├── common/             # Reusable UI primitives (Button, Input, Select, Modal, Badge, ThemeToggle)
│   │   ├── dashboard/          # Summary cards, ConversionRateCard, UrgentFollowups, ProgramDistribution
│   │   ├── followups/          # Follow-up workspace & reschedule modals
│   │   ├── layout/             # Responsive Sidebar, Header, ProtectedRoute wrapper, Layout
│   │   ├── leads/              # LeadForm, LeadTable, LeadCard (mobile), LeadFilters, DeleteConfirmModal
│   │   └── settings/           # BackupManager (JSON export/import), ConnectionGuide
│   ├── contexts/
│   │   ├── AuthContext.tsx     # Supabase Auth session & preview fallback
│   │   ├── LeadsContext.tsx    # Supabase Realtime subscription, local state caching, CRUD & metrics
│   │   └── ThemeContext.tsx    # Dark / Light theme switcher with local storage persistence
│   ├── lib/
│   │   ├── constants.ts        # Programs, statuses, sources, and badge configurations
│   │   ├── supabase.ts         # Supabase client initialization & validation
│   │   └── utils.ts            # INR currency formatting, pending math, dates, WhatsApp sanitizers
│   ├── pages/
│   │   ├── AddLeadPage.tsx     # Lead registration page
│   │   ├── DashboardPage.tsx   # Primary KPI dashboard
│   │   ├── FollowupsPage.tsx   # Follow-ups command center
│   │   ├── LeadDetailPage.tsx  # Detailed lead profile, payment ledger & edit view
│   │   ├── LeadsListPage.tsx   # Leads table with search and filters
│   │   ├── LoginPage.tsx       # Secure Supabase Auth staff login
│   │   ├── NotFoundPage.tsx    # 404 handler
│   │   └── SettingsPage.tsx    # App preferences, backups & Supabase setup guide
│   ├── types/
│   │   └── database.ts         # Strict TypeScript definitions for Leads, Statuses, Filters
│   ├── App.tsx                 # Client routing & provider hierarchy
│   ├── index.css               # Tailwind directives & theme tokens
│   ├── main.tsx                # React root bootstrap
│   └── vite-env.d.ts           # Environment variable typings
├── .env.example                # Template for environment variables
├── .gitignore                  # Git ignore rules (protecting .env and node_modules)
├── index.html                  # HTML5 shell with Inter typography & SEO tags
├── package.json                # Project dependencies and npm scripts
├── schema.sql                  # Production Supabase PostgreSQL schema with RLS & Realtime
├── tailwind.config.js          # Custom academy color palette and dark mode
├── tsconfig.json               # TypeScript configuration
└── vite.config.ts              # Vite configuration with aliases
```

---

## 🗄️ Step-by-Step Supabase Free Tier Setup Guide

### 1. Create a Free Supabase Project
1. Visit [supabase.com](https://supabase.com) and log in with GitHub.
2. Click **New Project**.
3. Choose an organization, enter **Name** (e.g. `EV Cyber Academy CRM`), set a secure database password.
4. Select the **Free Plan** (₹0/month) and choose a region close to your team (e.g., `South Asia (Mumbai)`).
5. Click **Create new project**.

### 2. Run Database Schema
1. In your Supabase project dashboard, open **SQL Editor** from the left sidebar.
2. Click **New Query**.
3. Copy and paste the complete content of [`schema.sql`](./schema.sql) from this repository.
4. Click **Run** (`Ctrl + Enter`).
5. This creates the `leads` table, performance indexes, Row Level Security (RLS) policies, and enables **Supabase Realtime**.

### 3. Create Staff Login User
1. In Supabase Dashboard, navigate to **Authentication** → **Users**.
2. Click **Add User** → **Create User**.
3. Enter your staff email (e.g. `admissions@evcyberacademy.com`) and a secure password.
4. Toggle **Auto Confirm User?** to `ON` so no email verification step is needed.

### 4. Retrieve API Credentials
1. In Supabase Dashboard, navigate to **Project Settings** (gear icon) → **API**.
2. Copy the **Project URL** (e.g., `https://xyzcompany.supabase.co`).
3. Copy the **`anon` `public`** API key.

---

## 💻 Local Development Setup

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-org/ev-cyber-academy-crm.git
cd ev-cyber-academy-crm
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```bash
cp .env.example .env
```
Paste your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

*(Note: If `.env` is omitted, the application automatically runs in **Offline Preview Mode** with sample data and local storage persistence).*

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🌐 Vercel Free Tier Deployment Guide

Deploying to Vercel takes less than 2 minutes:

### Step 1: Push Code to GitHub
```bash
git init
git add .
git commit -m "Initial commit: EV Cyber Academy Lead Management System"
git branch -M main
git remote add origin https://github.com/your-username/ev-cyber-academy-crm.git
git push -u origin main
```

### Step 2: Import into Vercel
1. Log in to [vercel.com](https://vercel.com) with GitHub.
2. Click **Add New...** → **Project**.
3. Select your GitHub repository (`ev-cyber-academy-crm`) and click **Import**.
4. In **Environment Variables**, add:
   * `VITE_SUPABASE_URL` = `https://your-project-ref.supabase.co`
   * `VITE_SUPABASE_ANON_KEY` = `your-anon-public-key`
5. Click **Deploy**.

Vercel will build and assign a free HTTPS URL (e.g., `https://ev-cyber-crm.vercel.app`).

---

## 📱 Cross-Device Real-Time Sync Acceptance Test

To verify real-time synchronization between Laptop and Mobile:

1. **Laptop**: Open the deployed CRM URL and sign in.
2. **Mobile**: Open the same URL on your smartphone browser and sign in.
3. **Laptop**: Navigate to **Add Lead**, enter `Rahul Sharma | LFHP | New`, and save.
   * **Result**: The lead instantly appears on the mobile screen without any page reload!
4. **Mobile**: Tap the status badge for `Rahul Sharma` and change status from `New` → `Contacted`.
   * **Result**: On the laptop dashboard, the *New Leads* count decrements by 1 and *Contacted* increments by 1 instantly!
5. **Laptop**: Click **Record Fee** and enter `Paid ₹2,000`.
   * **Result**: The mobile card updates in real time to show `Paid ₹2,000` and `Pending ₹13,000`.

---

## 🔒 Security Best Practices Implemented

* **Supabase Row Level Security (RLS)**: Authenticated policies ensure that only verified staff members can read, insert, or modify leads.
* **Zero Secret Exposure**: The `service_role` key is **never** used in frontend client-side code. Only the safe `anon` key with RLS is utilized.
* **Environment Protection**: `.env` is explicitly ignored in `.gitignore`.
* **Input Sanitization**: Phone numbers are sanitized for WhatsApp deep links, amounts are validated against negative numbers, and form submissions are debounced.

---

## 📋 Complete Acceptance Checklist

- [x] Login page (`/login`) with Supabase Auth
- [x] SaaS Dashboard with 10 summary cards
- [x] Live Conversion Rate calculation (`Converted / Total × 100`)
- [x] Real-time bi-directional sync (Laptop ↔ Mobile) via Supabase Realtime
- [x] Predefined Programs (`LFHP`, `LFHP Mini`, `LWAP`, `AI Cyber Tool Building Workshop`, `Internship`, `Custom`)
- [x] Predefined Sources (`Instagram`, `WhatsApp`, `Website`, `Referral`, `Webinar`, `Advertisement`, `YouTube`, `Direct`, `Other`)
- [x] Predefined Statuses (`New`, `Contacted`, `Follow-up`, `Interested`, `Converted`, `Not Converted`, `Not Responding`)
- [x] Add Lead form with dynamic Pending Amount calculation
- [x] Search by Name, Phone, Email, and Notes
- [x] Filters by Status, Program, Source, and Follow-up timeframe
- [x] Follow-ups Command Center (Today, Overdue, Upcoming)
- [x] Fee & Payment tracking with auto-computed pending balance
- [x] Soft delete / Archive support with permanent delete confirmation
- [x] JSON Backup Export (`ev-leads-backup-YYYY-MM-DD.json`)
- [x] JSON Backup Import (Option 1: Add to Existing, Option 2: Replace All)
- [x] Dark & Light mode theme toggle
- [x] Fully responsive layout (Desktop Table + Mobile Cards)
- [x] 100% Free Tier compliant (**₹0 Database Cost**)
