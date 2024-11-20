import type { Prisma, ExpenseCategory } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.ExpenseCategoryCreateArgs>({
  expenseCategory: {
    one: { data: { name: 'String7465576' } },
    two: { data: { name: 'String2984634' } },
  },
})

export type StandardScenario = ScenarioData<ExpenseCategory, 'expenseCategory'>
