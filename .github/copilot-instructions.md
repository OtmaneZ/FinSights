# FinSight - Financial Analysis Demo

## Project Overview
FinSight is a **functional demo/prototype** showcasing modern web development skills applied to financial data analysis. It demonstrates AI integration, data visualization, and interactive dashboard capabilities for CFO/finance use cases.

**This is a portfolio project, not a commercial SaaS product.**

## Tech Stack
- **Frontend**: Next.js 14 with React, TypeScript, Tailwind CSS
- **API Routes**: Next.js API handlers for data processing
- **AI Integration**: OpenAI GPT-4 API
- **Data Visualization**: Recharts
- **Data Processing**: Excel/CSV parsing with client-side processing
- **Styling**: Tailwind CSS with custom financial UI components

## Demo Features
1. **CSV/Excel Import**: Drag-and-drop file upload with automatic parsing
2. **Financial Dashboard**: Interactive KPIs (revenue, margin, cash flow, DSO)
3. **AI Copilot**: Natural language financial queries powered by GPT-4
4. **Data Visualizations**: Charts for cash flow, expenses, margins, top clients
5. **Sector Benchmarks**: Visual comparison bars for industry standards
6. **PDF Export**: Generate financial reports from dashboard data

## Development Guidelines
- Use TypeScript throughout the project
- Follow React best practices and hooks patterns
- Implement proper error handling and loading states
- Use French financial terminology correctly
- Focus on responsive design and UX polish
- Keep data processing client-side (in-memory, no database)

## Project Structure
```
/src/app - Next.js app router pages
/src/components - React components (dashboard, charts, copilot)
/src/lib - Utilities (parsers, formulas, config)
/src/pages/api - Next.js API routes (upload, insights, chat)
/public - Static assets and demo data
```