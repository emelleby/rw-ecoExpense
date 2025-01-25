// import { Link, routes } from '@redwoodjs/router'

import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

import { Button } from 'src/components/ui/Button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from 'src/components/ui/Card'

import HomeCell from '@/components/HomeCell/HomeCell'

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
  {
    title: 'Manage Suppliers',
    description: 'Add or view suppliers for your expenses.',
    buttonText: 'Manage Suppliers',
    url: 'test',
  },
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
const HomePage = () => {
  return (
    <>
      <Metadata title="Home" description="Home page" />
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-center text-2xl font-bold">
          Welcome to Expense Tracker
        </h1>
        <HomeCell />
      </div>
    </>
  )
}

export default HomePage
