# FinSight - Augmented Finance Platform

## Project Overview
FinSight is a SaaS platform providing augmented finance capabilities for CFOs and finance directors in French PMEs and ETIs. The platform combines financial data consolidation, AI-powered analysis, and predictive forecasting.

## Tech Stack
- **Frontend**: Next.js 14 with React, TypeScript, Tailwind CSS
- **Backend**: Node.js with Express, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **AI/ML**: OpenAI GPT integration, custom forecasting models
- **Authentication**: NextAuth.js
- **Data Integration**: APIs for banks, accounting systems, Excel import

## Key Features
1. **Automated Data Consolidation**: Bank, accounting, and Excel data import
2. **AI-Powered Analysis**: Anomaly detection, margin analysis, payment delays
3. **Dynamic Forecasting**: Cash flow projections, stress testing, scenario modeling
4. **AI Copilot**: Natural language financial queries and insights
5. **Real-time Dashboards**: Financial KPIs and executive reporting

## Development Guidelines
- Use TypeScript throughout the project
- Follow clean architecture principles
- Implement comprehensive error handling
- Use proper French localization for finance terminology
- Focus on financial data security and GDPR compliance
- Optimize for performance with large financial datasets

## Architecture
```
/frontend - Next.js application
/backend - Express API server
/shared - Shared types and utilities
/ai-engine - ML models and AI integration
/data-connectors - External system integrations
```