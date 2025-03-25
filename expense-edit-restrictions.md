# Expense Edit Restrictions Plan

## Overview
Implement restrictions to prevent editing or deleting expenses when their associated trip has status PENDING or REIMBURSED.

## Backend Changes

### 1. Service Layer (api/src/services/expenses)
- Add validation function to check trip status before expense modifications
- Implement in both updateExpense and deleteExpense services
- Throw appropriate error if trip status is PENDING or REIMBURSED

```typescript
// Example validation
const validateTripStatus = async ({ tripId }) => {
  const trip = await db.trip.findUnique({ where: { id: tripId } })
  if (trip.reimbursementStatus === 'PENDING' || trip.reimbursementStatus === 'REIMBURSED') {
    throw new Error('Cannot modify expenses for trips that are pending or reimbursed')
  }
}
```

### 2. GraphQL SDL Updates (api/src/graphql/expenses.sdl.ts)
- Update error handling for these specific cases
- Add custom error type for better client feedback

```graphql
type ExpenseOperationError {
  message: String!
  code: String!
}

type Mutation {
  updateExpense(id: Int!, input: UpdateExpenseInput!): Expense! @requireAuth
  deleteExpense(id: Int!): Expense! @requireAuth
}
```

## Frontend Changes

### 1. Expense Components
- Update expense list/detail views to check trip status
- Disable edit/delete buttons when appropriate
- Add tooltips explaining why actions are disabled

### 2. UI Feedback
- Add clear visual indicators for non-editable expenses
- Show informative messages about why modifications are restricted
- Consider adding this information to the expense list view

## Implementation Phases

1. Backend Implementation
   - Add service layer validations
   - Update GraphQL schema
   - Add tests for new validation logic

2. Frontend Implementation
   - Update UI components to respect new restrictions
   - Add user feedback mechanisms
   - Update existing tests

3. Testing
   - Unit tests for new validation logic
   - Integration tests for full flow
   - UI testing for disabled states

## Error Messages

Standard error messages to use:
- "This expense cannot be modified because the trip is pending reimbursement"
- "This expense cannot be modified because the trip has been reimbursed"

## Next Steps

1. Switch to Code mode to implement backend changes
2. Update frontend components to handle new restrictions
3. Add comprehensive tests
4. Add user feedback mechanisms
