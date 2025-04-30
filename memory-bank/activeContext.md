# EcoExpense - Active Context

## Current Focus
- Initial Memory Bank setup for the EcoExpense project
- Understanding the application architecture and data models
- Documenting key features and workflows

## Recent Changes
- Created the Memory Bank documentation structure
- Analyzed the existing codebase structure
- Documented system patterns and technical context

## Key Files & Components
- `api/db/schema.prisma`: Database schema with models for Organization, User, Project, Trip, Expense, etc.
- `api/src/graphql/*.sdl.ts`: GraphQL schema definitions for various entities
- `web/src/pages/*`: Page components for different sections of the application
- `web/src/components/*`: Reusable UI components including cells for data fetching

## Data Models
The application revolves around these core models:
- **Organization**: Multi-tenant container for users, projects, and data
- **User**: System users with organization affiliations and roles managed through Clerk's metadata
- **Project**: Organizational unit for grouping expenses and trips
- **Trip**: Travel event that contains multiple expenses
- **Expense**: Financial transaction with environmental impact data across three scopes of emissions
- **Sector**: Reference data for emissions calculations
- **Receipt**: Attachments for expense documentation

## Application Workflows
1. User authentication via Clerk with role-based permissions
2. Organization-based data access with multi-tenant isolation
3. Project and trip management for organizing expenses
4. Expense tracking with financial data and currency conversion to NOK
5. Environmental impact tracking across three scopes of emissions
6. Flight emissions calculation using the g-flightapi-318955611692.europe-north1.run.app API
7. Reporting on both financial and emissions metrics

## Current Decisions & Considerations
- Multi-tenant architecture with clear data isolation
- Integration of financial and environmental tracking
- Role-based access control for different user types through Clerk's metadata
- Currency conversion to standardize on NOK
- Emissions tracking across three different scopes
- Form validation using Redwood components with patterns including:
  - Required fields validation
  - Email format validation
  - Numeric validation with min/max values
  - Custom validation functions
- UI components using shadcn/ui with subtle text gradients

## Next Steps
- Review application functionality in detail
- Explore specific features like flight emissions calculation
- Understand the currency conversion implementation
- Review user onboarding and authentication flow
- Document the reporting and analytics capabilities
