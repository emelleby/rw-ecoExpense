import { Metadata } from '@redwoodjs/web'

import TripReportCell from 'src/components/TripReportCell'

type TripReportPageProps = {
  id: number
}

const TripReportPage = ({ id }: TripReportPageProps) => {
  return (
    <>
      <Metadata title="Trip Report" description="Detailed report for a trip" />
      <div className="container mx-auto py-8">
        <TripReportCell id={id} />
      </div>
    </>
  )
}

export default TripReportPage
