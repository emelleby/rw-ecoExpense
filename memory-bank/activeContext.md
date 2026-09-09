# EcoExpense - Active Context

## Current Focus
- Implementing expense edit restrictions based on trip reimbursement status
- Enhancing UI to provide clear visual feedback for non-editable expenses
- Writing tests for the expense edit restrictions feature

## Recent Changes
- Implemented expense edit restrictions based on trip reimbursement status
- Added visual indicators and tooltips for non-editable expenses
- Updated the UI to disable edit/delete actions for expenses with restricted trip status
- Added tests for the expense edit restrictions feature

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
8. Trip reimbursement workflow:
   - Users create trips and add expenses
   - Users request reimbursement (trip status changes to PENDING)
   - Admins review and approve/reject reimbursement requests
   - When approved, trip status changes to REIMBURSED
   - Expenses cannot be modified when trip status is PENDING or REIMBURSED

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
- Expense edit restrictions based on trip status:
  - Backend validation in the expenses service
  - Frontend UI indicators for non-editable expenses
  - Tooltips to explain why expenses cannot be modified
  - Clear visual distinction between editable and non-editable expenses

## Next Steps
- Complete testing for the expense edit restrictions feature
- Explore additional UI enhancements for the expense management workflow
- Consider adding similar restrictions to other entities based on status
- Review the trip reimbursement workflow in detail
- Document the complete reimbursement process from request to payment
