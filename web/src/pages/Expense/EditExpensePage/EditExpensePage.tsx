import EditExpenseCell from 'src/components/Expense/EditExpenseCell'

type ExpensePageProps = {
  id: number
}

const EditExpensePage = ({ id }: ExpensePageProps) => {
  return <EditExpenseCell id={id} />
}

export default EditExpensePage
