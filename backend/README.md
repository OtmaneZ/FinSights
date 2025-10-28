# FinSight Backend API

Express.js backend for the FinSight augmented finance platform.

## Features

- REST API for financial data management
- Database integration with PostgreSQL/Prisma
- Authentication and authorization
- Data connectors for banks and accounting systems
- AI/ML integration endpoints

## Setup

```bash
cd backend
npm install
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Financial Data
- `GET /api/financial/metrics` - Get financial KPIs
- `POST /api/financial/metrics` - Update financial metrics
- `GET /api/financial/cashflow` - Get cash flow data
- `POST /api/financial/forecast` - Generate cash flow forecast

### AI Copilot
- `POST /api/ai/query` - Natural language financial queries
- `GET /api/ai/insights` - Get AI-generated insights
- `POST /api/ai/scenario` - Run what-if scenarios

### Data Connections
- `GET /api/connections/banks` - List bank connections
- `POST /api/connections/banks` - Add bank connection
- `GET /api/connections/accounting` - List accounting connections
- `POST /api/connections/accounting` - Add accounting connection