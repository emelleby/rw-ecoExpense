import { AlertCircle } from 'lucide-react'
import type { FindHomeQuery, FindHomeQueryVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type {
  CellSuccessProps,
  CellFailureProps,
  TypedDocumentNode,
} from '@redwoodjs/web'

import { Button } from 'src/components/ui/Button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from 'src/components/ui/Card'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert'

export const QUERY: TypedDocumentNode<FindHomeQuery, FindHomeQueryVariables> =
  gql`
    query FindHome {
      projects {
        id
      }
    }
  `
const features = [
  {
    title: 'Add New Expense',
    description:
      'Record a new expense with details such as amount, date, and category.',
    buttonText: 'Add Expense',
    url: 'newExpense',
  },
  {
    title: 'View Expenses',
    description: 'See a list of all recorded expenses and their details.',
    buttonText: 'View Expenses',
    url: 'expenses',
  },
  // {
  //   title: 'Manage Suppliers',
  //   description: 'Add or view suppliers for your expenses.',
  //   buttonText: 'Manage Suppliers',
  //   url: 'test',
  // },
  {
    title: 'Manage Trips',
    description: 'Create or view trips to associate with expenses.',
    buttonText: 'Manage Trips',
    url: 'trips',
  },
  {
    title: 'Manage Projects',
    description: 'Create or view projects to associate with expenses.',
    buttonText: 'Manage Projects',
    url: 'projects',
  },
]
export const Loading = () => <div>Loading...</div>

export const Empty = () => (
  <Alert variant="warning">
    <AlertCircle className="h-5 w-5" />
    <AlertTitle>No Projects Found</AlertTitle>
    <AlertDescription>
      <p>Your organization needs at least one project to track expenses.</p>
      <Link
        to={routes.newProject()}
        className="text-warning hover:text-warning/80 mt-2 inline-block font-medium"
      >
        Create First Project →
      </Link>
    </AlertDescription>
  </Alert>
)

export const Failure = ({
  error,
}: CellFailureProps<FindHomeQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({}: CellSuccessProps<
  FindHomeQuery,
  FindHomeQueryVariables
>) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {features.map((feature, index) => (
        <Card key={index} className="flex flex-col transition hover:shadow-lg">
          <CardHeader>
            <CardTitle>{feature.title}</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="mb-4">{feature.description}</p>
          </CardContent>
          <CardFooter className="mt-auto">
            {routes[feature.url] ? (
              <Link to={routes[feature.url]()}>
                <Button>{feature.buttonText}</Button>
              </Link>
            ) : (
              <p>Invalid route</p>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
