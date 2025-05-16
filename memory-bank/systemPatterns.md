# EcoExpense - System Patterns

## Architecture Overview

EcoExpense follows the RedwoodJS architecture with separate API and Web sides:

```
EcoExpense
├── api (Backend)
│   ├── prisma (Database schema)
│   └── src
│       ├── graphql (SDL definitions)
│       ├── services (Business logic)
│       └── functions (API handlers)
└── web (Frontend)
    └── src
        ├── components (UI components and cells)
        ├── layouts (Page layouts)
        ├── pages (Route components)
        └── utils (Helper functions)
```

## Key Design Patterns

### Multi-tenant Architecture
- Organizations are top-level entities that own projects, users, suppliers
- All data queries include organization context for proper data isolation
- Users belong to specific organizations with appropriate permissions

### Data Model Relationships
- **Organizations** contain Users, Projects, and Suppliers
- **Projects** organize Trips and Expenses
- **Trips** group related Expenses
- **Expenses** track financial and environmental data, with optional Receipt attachments
- **Categories** classify Expenses (with both English and Norwegian names)
- **Sectors** provide emissions factors for calculations

### Authentication & Authorization
- **Clerk** provides authentication services
- Users have organization affiliations
- Role-based access controls implemented at the GraphQL layer
- `requireAuth` directives on sensitive operations

### GraphQL API Design
- SDL-first approach defining types, queries, and mutations
- Resolvers implemented in corresponding service files
- Proper input validation and error handling
- Data access filtered by organization context

### UI Component Structure
- Shadcn/UI components as the foundation
- Tailwind CSS for styling with theme support
  - Theme-aware color classes (bg-background, text-foreground)
  - Dark/light mode toggle functionality
  - CSS variables for theme colors in index.css
- Redwood Cells for data fetching patterns
  - Loading states
  - Empty states
  - Error handling
  - Success rendering
  - Fallback data with visual indicators

### Environmental Impact Calculation
- CO2 emissions tracked across three scopes:
  - Scope 1: Direct emissions
  - Scope 2: Indirect emissions from purchased energy
  - Scope 3: All other indirect emissions
- Sector-specific factors applied to different expense types
- Flight emissions calculated based on distance, fuel efficiency, etc.

### Currency Handling
- Expenses recorded in original currency
- Exchange rates applied to convert to NOK
- Both original and converted amounts stored for reporting

## Technical Implementation Details

### Database Schema
- PostgreSQL with Prisma ORM
- Strong relationships between models
- Appropriate indexing for performance
- Enum types for status values

### Type Safety
- TypeScript in strict mode throughout
- Prisma-generated types for database models
- GraphQL SDL-generated types for API
- Prop typing for React components

### Testing Strategy
- Jest for unit and integration tests
- Storybook for component testing
- MSW for mocking API responses

### State Management
- Server state through GraphQL queries/mutations
- Local UI state with React hooks
- Form state with RedwoodJS Form components

### File Access Patterns
- External files (outside src directory) should be accessed via backend services
- Use proper path resolution for files in non-standard locations
- Implement fallback mechanisms for critical data with clear visual indicators
- Configuration files should remain in their designated locations
