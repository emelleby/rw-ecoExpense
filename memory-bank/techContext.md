# EcoExpense - Technical Context

## Technology Stack

### Core Framework
- **RedwoodJS** v8.6.1
  - Full-stack JavaScript/TypeScript framework
  - Integrated frontend and backend
  - API and web sides with clear separation

### Frontend
- **React** 18.x
- **TypeScript** 5.x in strict mode
- **Tailwind CSS** 3.x for styling
  - Dark/light theme support via CSS variables
  - Theme-aware color classes
- **shadcn/ui** (via rw-shad v2.x) for UI components
- **Storybook** 7.x for component development and testing

### Backend
- **Node.js** 20.x
- **GraphQL** API through RedwoodJS
- **Prisma** 5.x as the ORM
- **PostgreSQL** for database (by Neon)

### Authentication
- **Clerk** (via @clerk/express) for authentication
- JWT-based authentication flow
- Role-based access controls

### Testing
- **Jest** 29.x for unit and integration testing
- **MSW** for mocking API responses
- **Storybook** for component testing
- Scenario-based testing for service functions
- Mocking GraphQL queries and mutations
- Testing validation functions independently
- Testing UI components with different data states

### Deployment
- Configuration for Netlify deployment
- Environment variables for configuration

## Development Environment
- Neon cloud database branch

### Prerequisites
- Node.js 20.x
- Yarn 4.x
- PostgreSQL database
- Clerk account and credentials

### Local Setup
1. Clone repository
2. Install dependencies: `yarn install`
3. Set up environment variables (see `.env.defaults` for required values)
4. Create local or cloud database
5. Run migrations: `yarn rw prisma migrate dev`
6. Start development server: `yarn rw dev`

### Development Commands
- `yarn rw dev` - Start development server
- `yarn rw test` - Run tests
- `yarn rw prisma studio` - Open Prisma Studio for database management
- `yarn rw prisma migrate dev` - Apply database migrations
- `yarn rw storybook` - Start Storybook for component development
- `yarn rw g page <name>` - Generate a new page
- `yarn rw g component <name>` - Generate a new component
- `yarn rw g cell <name>` - Generate a new cell
- `yarn rw g service <name>` - Generate a new service
- `yarn rw g sdl <name>` - Generate a new SDL file

## Project Structure

### API Side
- `api/prisma/schema.prisma` - Database schema definition
- `api/src/graphql/*.sdl.ts` - GraphQL schema definitions
- `api/src/services/` - Business logic and resolvers
- `api/src/functions/` - API endpoints and authentication

### Web Side
- `web/src/components/` - Reusable UI components
- `web/src/pages/` - Page components corresponding to routes
- `web/src/layouts/` - Layout components
- `web/src/utils/` - Utility functions
- `web/src/components/ui/` - shadcn/ui components

## Technical Constraints

### Data Models
- Multi-tenant architecture with organization-based isolation
- Specific models for expenses, trips, projects, users, etc.
- Enum types for statuses (USER_STATUS, ReimbursementStatus)
- Relationships defined in Prisma schema

### API Design
- GraphQL SDL-first approach
- Role-based access control through directives
- Service-based resolver implementation
- Union types for operation results with potential errors
- Custom error types for specific validation failures
- Service-level validation functions for business rules
- Trip status validation for expense modifications

### UI Components
- shadcn/ui integration through rw-shad
- Tailwind-based styling with theme support
  - Dark/light mode toggle via useTheme hook
  - Theme-aware color classes (bg-background, text-foreground)
- Redwood Cell pattern for data fetching
  - Fallback mechanisms for critical data
  - Visual indicators for fallback content
- Interactive UI elements with status-based restrictions:
  - Disabled buttons for restricted actions
  - Tooltips to explain restrictions (using ShadcN Tooltip component)
  - Visual indicators for non-editable items
  - Status badges to show current state

### Environment Configuration
- `.env` file for local development
- Environment variables for deployment
- Different configurations for development and production

### File Access Patterns
- External files (outside src directory) accessed via backend services
- Configuration files like tasks.json remain in their designated locations
- Backend services provide proper path resolution for non-standard file locations
- Fallback mechanisms implemented for critical data sources
