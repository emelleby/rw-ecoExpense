# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**EcoExpense**: A RedwoodJS-based web application for tracking expenses and their associated emissions. Uses PostgreSQL for data storage, Clerk for authentication, and Tailwind CSS for styling.

## Architecture

- **RedwoodJS full-stack framework** with GraphQL API
- **PostgreSQL database** with Prisma ORM
- **Clerk authentication** (Clerk React + Clerk API)
- **Frontend**: React + Vite with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **File Upload**: Google Cloud Storage integration
- **Maps Integration**: Google Maps API

## Directory Structure

- `/api` - GraphQL API services and database layer
  - `/db/schema.prisma` - Database schema definition
  - `/src/services/` - Business logic for GraphQL queries/mutations
  - `/src/graphql/` - GraphQL schema definitions (SDL)
- `/web` - React frontend
  - `/src/components/` - Reusable React components
  - `/src/pages/` - Page components (Redwood's routing)
  - `/src/layouts/` - Layout components
  - `/ui/` - shadcn/ui components

## Key Models

**Core entities:**
- User (authenticated via Clerk)
- Organization → Project → Trip → Expense
- ExpenseCategory, Sector (for CO2 calculations)
- Receipt (file attachments)
- WorkEntry, Rate (time tracking for billing)
- Customer (external billing)

## Development Commands

**Setup & Installation:**
```bash
# Install dependencies
yarn install

# Setup database
yarn rw prisma migrate dev
yarn rw exec seed  # Seed database with sample data
```

**Development:**
```bash
# Start both API and web
yarn rw dev

# Start services individually
yarn rw dev --forward=\"--api\"
yarn rw dev --forward=\"--web\"

# Database management
yarn rw prisma generate          # Generate Prisma client
yarn rw prisma studio           # Database GUI
yarn rw prisma migrate dev      # Create and apply migrations
```

**Testing:**
```bash
# Run all tests
yarn rw test

# Run specific test types
yarn rw test api                # API tests only
yarn rw test web                # Web tests only

# Run specific test files
yarn rw test --testPathPattern="expenses"
```

**Production/Deployment:**
```bash
# Build for production
yarn rw build

# Deploy to Netlify (configured)
npm run deploy  # or yarn deploy
```

## Environment Variables

Required variables (see redwood.toml):
- `DATABASE_URL` - PostgreSQL connection string
- `CLERK_PUBLISHABLE_KEY` - Clerk authentication key
- `CLERK_SECRET_KEY` - Clerk server-side key
- `GOOGLE_MAPS_API_KEY` - Maps integration
- `QUETZAL_API_KEY` - CO2 emissions calculations

## Common Development Workflows

**Adding new database models:**
1. Add to `/api/db/schema.prisma`
2. Run `yarn rw prisma migrate dev --name <migration_name>`
3. Create GraphQL SDL in `/api/src/graphql/`
4. Create corresponding service in `/api/src/services/`
5. Scaffold web components if needed: `yarn rw g sdl <model_name>`

**Accessing authentication:**
- Web side: `import { useAuth } from 'src/auth'`
- API side: Use `@requireAuth` directive in SDL or check `context.currentUser`

**File uploads:**
- API: `functions/uploadUrl.ts` generates signed URLs
- Frontend: See `components/Expense/ExpenseForm/UploadReciepts.tsx`

**Emissions calculations:**
- CO2 factors stored in Sector model
- Calculations handled in expense service (/api/src/services/expenses/expenses.ts)