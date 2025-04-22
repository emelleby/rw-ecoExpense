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

const HomePage = ({ title = 'Dashboard' }) => {
  return (
    <>
      <Metadata title="Home" description="Home page" />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-gradient-blue-green mb-6 w-fit text-center text-2xl font-bold">
          Welcome to Expense Tracker
        </h1>
        <HomeCell />
      </div>
    </>
  )
}

export default HomePage
