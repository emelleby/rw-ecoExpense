// import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

import { Button } from 'src/components/ui/Button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from 'src/components/ui/Card'

const HomePage = () => {
  const features = [
    {
      title: 'Add New Expense',
      description:
        'Record a new expense with details such as amount, date, and category.',
      buttonText: 'Add Expense',
    },
    {
      title: 'View Expenses',
      description: 'See a list of all recorded expenses and their details.',
      buttonText: 'View Expenses',
    },
    {
      title: 'Manage Suppliers',
      description: 'Add or view suppliers for your expenses.',
      buttonText: 'Manage Suppliers',
    },
    {
      title: 'Manage Trips',
      description: 'Create or view trips to associate with expenses.',
      buttonText: 'Manage Trips',
    },
    {
      title: 'Manage Projects',
      description: 'Create or view projects to associate with expenses.',
      buttonText: 'Manage Projects',
    },
  ]
  return (
    <>
      <Metadata title="Home" description="Home page" />

      <Metadata title="Home" description="Home page" />

      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-center text-2xl font-bold">
          Welcome to Expense Tracker
        </h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="flex flex-col transition hover:shadow-lg"
            >
              <CardHeader>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>

              <CardContent>
                <p className="mb-4">{feature.description}</p>
              </CardContent>
              <CardFooter className="mt-auto">
                <Button>{feature.buttonText}</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      {/*
          My default route is named `home`, link to me with:
          `<Link to={routes.home()}>Home</Link>`
      */}
    </>
  )
}

export default HomePage
