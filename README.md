# FinSight - Financial Analysis Dashboard Demo 🚀

**Interactive financial dashboard with AI copilot - Technical demonstration**

> **Demo project showcasing modern web development applied to financial data analysis**
> Built with Next.js 14, TypeScript, GPT-4, and Recharts

---

## 🎯 **ABOUT THIS PROJECT**

### What is FinSight?

**A functional prototype demonstrating:**
✅ Modern React/Next.js development with TypeScript
✅ AI integration (OpenAI GPT-4) for conversational interfaces
✅ Financial data visualization and KPI calculations
✅ Excel/CSV file parsing and processing
✅ Responsive UI design with Tailwind CSS

**What it does:**
1. **📤 File Import** : Upload CSV/Excel files with financial data
2. **🔄 Data Processing** : Parse and calculate 15+ financial KPIs automatically
3. **📊 Interactive Dashboard** : Visualize revenue, cash flow, margins, DSO, receivables, top clients
4. **🤖 AI Copilot** : Ask questions in natural language, get GPT-4 powered financial insights
5. **💡 Smart Analysis** : Automatic alerts, trend detection, actionable recommendations

**Technical highlights:**
- 🧠 **Specialized prompts** : Finance-focused GPT-4 prompts (French terminology: DSO, BFR, marge nette)
- 🔌 **OpenAI GPT-4** : Real-time conversational analysis
- 📊 **Sector benchmarks** : Visual comparison bars (Services, Commerce, Industry, SaaS)
- 🎯 **Adaptive UI** : Dashboard adapts based on available data columns

---

## 🚀 **LIVE DEMO**

**🌐 Try it now:** [finsight.zineinsight.com](https://finsight.zineinsight.com)

**Choose from 3 realistic financial scenarios:**
- 🟢 **PME Services** (Healthy): 243k€ revenue, solid margins, 20% overdue
- 🟠 **Startup SaaS** (Struggling): 24k€ revenue, 82% overdue invoices, cash burn
- 🚀 **Scale-up Tech** (Hypergrowth): 1.2M€ revenue, Series A funding, CAC40 clients

- Test the **AI Copilot** with questions like:
  - "Quelle est la part de Société Générale Digital dans le CA ?"
  - "Comment se compare la marge au benchmark SaaS B2B ?"
  - "Quels sont les 3 plus gros postes de dépenses ?"

**Note:** This is a demonstration project. All data is processed client-side and not stored.

---

## ✨ **FEATURES DEMONSTRATED**

### 📊 **Automated Dashboard**
- **Real-time KPIs**: Revenue, Cash Flow, Net Margin, DSO, Working Capital
- **Visual indicators**: Differentiated icons (💰📉📊💵), contextualized variations
- **Sector benchmarks**: Visual bars comparing performance to industry standards
- **Smart alerts**: ⚠️ Exceptional margins, overdue receivables, cash warnings

### 🤖 **AI Copilot** (GPT-4o)
- **Conversational analysis**: Natural language questions in French
- **Vector memory**: Pinecone integration for contextual awareness
- **Financial expertise**: Specialized prompt engineering (professional tone, structured format)
- **Actionable responses**: 📊 Findings → 🔍 Analysis → 💡 Priority actions
- **Dynamic suggestions**: Questions adapted to your actual data

### 📈 **Advanced Visualizations**
- **Cash Flow Evolution**: Time-series charts with projections
- **Expense Breakdown**: Category-based analysis with D3.js Sunburst
- **Sankey Flows**: Interactive financial flows visualization
- **Margin Trends**: Multi-month performance tracking
- **Top Clients**: Commercial concentration analysis
- **Receivables**: Outstanding invoices and payment delays

### 🔔 **Real-Time Features**
- **Collaboration**: Live presence indicators with Pusher
- **Email Alerts**: Automated notifications via Resend
- **Daily Cron**: Scheduled financial health reports
- **ML Anomaly Detection**: 3 algorithms (Z-score, IQR, Moving Average)

### 🔒 **Data Processing**
- **100% client-side**: Data stays in your browser
- **No server storage**: Real-time analysis only
- **Secure protocol**: HTTPS + client-side validation

---

## 🛠️ **TECH STACK**

### **Frontend**
- **Next.js 14**: React framework with App Router
- **React**: UI component library
- **TypeScript**: Strict typing for code robustness
- **Tailwind CSS**: Modern responsive styling

### **AI & Analysis**
- **OpenAI GPT-4o**: Conversational financial copilot
- **Pinecone**: Vector database for AI memory and semantic search
- **Prompt Engineering**: Specialized finance-focused prompts (French terminology)
- **Adaptive Analysis**: KPIs calculated based on available data columns

### **Data Visualization**
- **Recharts**: Interactive charts (cash flow, margins, receivables)
- **D3.js**: Advanced visualizations (Sankey flows, Sunburst expenses)
- **Custom Components**: KPI cards with icons, benchmarks, tooltips
- **Dark Mode**: Professional optimized interface

### **Collaboration & Notifications**
- **Pusher**: Real-time collaboration (presence, cursor tracking)
- **Resend**: Email alerts and notifications
- **Vercel Cron**: Daily automated alerts

### **Data Processing**
- **Client-side processing**: All data stays in the browser (no database)
- **Excel/CSV parsing**: Automatic file processing with validation

### **Deployment**
- **Vercel**: Serverless deployment with edge functions
- **Excel/CSV parsing**: Automatic column detection and mapping
- **API Routes**: Next.js serverless functions for OpenAI calls

---

## 🚀 **INSTALLATION & SETUP**

### Prerequisites
```bash
Node.js 18+
npm or yarn
OpenAI API key
```

### Installation
```bash
# Clone the repository
git clone https://github.com/OtmaneZ/FinSights.git
cd finsights

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Add your OpenAI API key in .env.local:
# OPENAI_API_KEY=sk-...

# Run development server
npm run dev
```

### Local URLs
- **Homepage**: `http://localhost:3000`
- **Dashboard Demo**: `http://localhost:3000/dashboard`

### Production Build
```bash
npm run build
npm start
```

---

## 📋 **PROJECT STRUCTURE**

```
/src
  /app                          # Next.js pages
    page.tsx                    # Homepage
    /dashboard                  # Financial dashboard
      page.tsx
    /methodologie               # Methodology page
      page.tsx

  /components                   # React components
    FinancialDashboard.tsx      # Main dashboard (1400+ lines)
    AICopilot.tsx               # AI conversational copilot
    BenchmarkBar.tsx            # Sector benchmark bars
    AlertsPanel.tsx             # Financial alerts
    KPITooltip.tsx              # KPI explanatory tooltips
    /charts                     # Recharts visualizations
      CashFlowEvolutionChart.tsx
      ExpenseBreakdownChart.tsx
      MarginEvolutionChart.tsx
      TopClientsVerticalChart.tsx
      OutstandingInvoicesChart.tsx

  /lib                          # Business logic
    /copilot
      prompts.ts                # GPT-4 specialized prompts
    dataParser.ts               # CSV/Excel parsing
    financialFormulas.ts        # KPI calculations (DSO, margins)
    dashboardConfig.ts          # Adaptive configuration
    financialGlossary.ts        # Financial terms glossary

  /pages/api                    # Next.js API routes
    /copilot
      chat.ts                   # GPT-4 endpoint
    /financial
      data.ts                   # Data processing
    upload.ts                   # CSV upload handler

  /styles
    finsight-revolutionary.css  # Global design system
    globals.css

/public
  /images                       # Assets
  demo-data.csv                 # Demo data (fictional SME)
```

---

## 🎓 **CREDITS & AUTHOR**

**Developed by Otmane Boulahia**
🎓 Master in International Finance (Université Côte d'Azur)
👨‍🏫 10 years teaching Finance & Management
💻 Data Analytics (LeWagon Bootcamp 2025)

**LeWagon 2025 Final Project**
*Theme: AI-Augmented Finance for French SMEs*

**Contact:**
- 🌐 Website: [zineinsight.com](https://www.zineinsight.com)
- 💼 LinkedIn: [Otmane Boulahia](https://www.linkedin.com/in/otmane-boulahia-553bb6363/)
- 📧 Email: contact@zineinsight.com

---

## 📄 **LICENSE**

Private Property © 2025 ZineInsights
All rights reserved

---

## �️ **SKILLS DEMONSTRATED**

This project showcases:
- ✅ Modern React/Next.js architecture (App Router, Server Components)
- ✅ TypeScript with strict typing
- ✅ AI integration (OpenAI GPT-4 API)
- ✅ Complex data processing (Excel/CSV parsing, financial calculations)
- ✅ Advanced React patterns (Context API, custom hooks)
- ✅ Data visualization (Recharts library)
- ✅ Responsive UI design (Tailwind CSS)
- ✅ API development (Next.js serverless functions)
- ✅ Git workflow (conventional commits)

---

**⭐ If you find this project interesting, star it on GitHub!**

---

*FinSight © 2025 - Démonstration technologique "Product-enabled Services"*