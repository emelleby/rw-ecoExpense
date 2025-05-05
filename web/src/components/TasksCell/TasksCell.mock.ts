export const standard = () => ({
  tasks: [
    {
      id: 1,
      title: 'Implement Trip Status Validation Function',
      description: 'Create a validation function in the service layer to check trip status before allowing expense modifications.',
      details: 'Sample details',
      testStrategy: 'Sample test strategy',
      priority: 'high',
      dependencies: [],
      status: 'pending',
      subtasks: [],
    },
    {
      id: 2,
      title: 'Update Expense Service Methods with Validation',
      description: 'Modify the updateExpense and deleteExpense service methods to use the new validation function.',
      details: 'Sample details',
      testStrategy: 'Sample test strategy',
      priority: 'medium',
      dependencies: [1],
      status: 'pending',
      subtasks: [],
    },
  ],
})
