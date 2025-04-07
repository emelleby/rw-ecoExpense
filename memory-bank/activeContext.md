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
- **User**: System users with organization affiliations
- **Project**: Organizational unit for grouping expenses and trips
- **Trip**: Travel event that contains multiple expenses
- **Expense**: Financial transaction with environmental impact data
- **Sector**: Reference data for emissions calculations

## Application Workflows
1. User authentication via Clerk
2. Organization-based data access
3. Project and trip management
4. Expense tracking with financial and environmental data
5. Reporting on both financial and emissions metrics

## Current Decisions & Considerations
- Multi-tenant architecture with clear data isolation
- Integration of financial and environmental tracking
- Role-based access control for different user types
- Currency conversion to standardize on NOK
- Emissions tracking across different scopes

## Next Steps
- Review application functionality in detail
- Explore specific features like flight emissions calculation
- Understand the currency conversion implementation
- Review user onboarding and authentication flow
- Document the reporting and analytics capabilities
