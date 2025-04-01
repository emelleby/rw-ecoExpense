# EcoExpense - Project Brief

## Overview
EcoExpense is a web application built with RedwoodJS (v8.5.0) that allows organizations to track both financial expenses and environmental impact in one platform. It features a multi-tenant architecture with organizations, projects, and users.

## Core Objectives
- Track expenses with accurate currency conversion (to NOK)
- Monitor environmental impact, particularly flight emissions
- Provide organizations with insights on both financial and environmental costs
- Maintain a multi-tenant structure where organizations can manage their own users and projects

## Key Features
- **Organization Management**: Multi-tenant structure for separate organizational data
- **User Authentication**: Secure login via Clerk with role-based permissions
- **Expense Tracking**: Record, categorize, and monitor expenses with currency conversion
- **Trip Management**: Create trips associated with projects and track related expenses
- **Project Organization**: Group expenses and trips by projects
- **Environmental Impact**: Track CO2 emissions, particularly from flights
- **Receipt Management**: Attach and store receipt documents
- **Reporting**: Generate insights on spending and emissions

## Technical Requirements
- RedwoodJS v8.5.0 with TypeScript in strict mode
- PostgreSQL database with Prisma ORM
- Clerk for authentication
- React 18 with shadcn/ui components and Tailwind CSS
- GraphQL API with role-based access controls

## Target Users
- Organizations concerned with both financial tracking and environmental impact
- Finance departments tracking expenses and reimbursements
- Sustainability teams monitoring environmental impact
- Employees submitting expense reports

## Success Criteria
- Accurate expense tracking with proper currency conversion
- Reliable environmental impact calculation
- Intuitive user interface for all user types
- Secure multi-tenant architecture
- Scalable data model to accommodate growing organizations
