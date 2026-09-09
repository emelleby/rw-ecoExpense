# AGENTS.md

This file provides guidance to coding agents when working with code in this repository.

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

# Deploy to Netlify (configured via netlify.toml)
yarn rw deploy netlify
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
- API: GCS signed upload URLs are generated in the receipts service (/api/src/services/receipts/receipts.ts)
- Frontend: See `components/Expense/ExpenseForm/UploadReciepts.tsx`
- Bucket setup/CORS/public-read runbook: `docs/gcs-bucket-setup.md` (CORS config lives in `infra/gcs-cors.json`; `GOOGLE_CLOUD_*` vars must be in the **root** `.env`, not `api/.env`)

**Emissions calculations:**
- CO2 factors stored in Sector model
- Calculations handled in expense service (/api/src/services/expenses/expenses.ts)

## Agent skills

### Issue tracker

Issues are tracked in GitHub Issues (emelleby/rw-ecoExpense) via the gh CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default five-label vocabulary: needs-triage, needs-info, ready-for-agent, ready-for-human, wontfix. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one CONTEXT.md + docs/adr/ at the repo root. See `docs/agents/domain.md`.

**Before running graft commands:** graft is distributed as the npm package
`@nanonets/graft` (currently `0.16.0`). It is not installed globally by default.
Use `npx @nanonets/graft <command>`, or install once globally with
`npm i -g @nanonets/graft`. If your session runs with restricted bash
permissions (non-King mode), also ensure `graft *` (and `npx @nanonets/graft *`)
are in the bash allowlist. The pre-built index is committed under `graft/` and
can be searched directly with `grep`/`ls` even if the CLI tool is unavailable.

To track efficiency, run `npx @nanonets/graft stats` after a session to see the
graft-vs-source token usage mix. For AI agents that prefer tool calls over
shell commands, `npx @nanonets/graft mcp` serves the graph over MCP
(stdio), exposing `graft_find_code`, `graft_trace_calls`, `graft_find_all`,
`graft_file_api`, and `graft_repo_map` as tools.

<!-- graft:start -->
## Graft — repo context graph

This repo is indexed in `graft/`: small linked markdown nodes that explain each
system and carry exact file:line spans, kept in sync with the code through git.

For ANY task here — understanding how something works, finding where code lives,
or scoping a change — get context from the graph before grepping or opening
source files. Re-ask freely (it's cheap) and reuse literal identifiers you
already have (symbol, error string, file name) as the query. New to this repo?
Run `graft map` first — a token-budgeted orientation (dir clusters, hubs,
hotspots), no LLM, no key.

- Run `graft ask "<your question>" --source` → ranked nodes with the relevant
  code spans inlined (each hit's ≤8-line crux by default; `--full` for whole
  definitions when the crux isn't enough). Match the tool to the task shape:
  for understanding or editing, the top node IS the answer — cite its
  `covers:` file:line spans and edit straight from `--source`. For
  exhaustive tasks ("every occurrence / every caller of this pattern"), ranked
  results are top-N, not complete — run `graft grep "<literal>"` instead
  (exhaustive over indexed files, grouped by enclosing symbol), falling back
  to raw `grep -rn` only for unindexed files.
- `graft skeleton <file>` → every definition's signature + span, ~10× cheaper
  than reading the file; use it to skim an API surface.
- `graft callers <symbol>` gives precomputed, exact edges — who calls this.
  Add `--direction out` for what it calls, or `--depth N` to walk
  transitively for the full blast radius. For structural questions, skip
  ranking and use this directly.
- Or browse: `graft/INDEX.md` lists every node; follow the links.
- Monorepos and folders of multiple repos rank fairly across sub-projects —
  hits carry `[scope/]` labels naming which one they're from. Narrow with
  `graft ask "<task>" --in <scope>/` once you know where you're working.

If a returned span is truncated ("+N more lines"), open the file at that exact
range before finalizing. Only open source files when a node genuinely lacks a
needed detail, and then at the exact file:line the node points to — never
re-read whole files.

After big code changes, refresh the graph with `graft build` (deterministic,
no API key, $0).
<!-- graft:end -->
