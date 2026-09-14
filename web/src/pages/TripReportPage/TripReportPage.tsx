import { Metadata } from '@redwoodjs/web'

import ShareTripControls from 'src/components/ShareTripControls/ShareTripControls'
import TripPrivacyToggle from 'src/components/TripPrivacyToggle/TripPrivacyToggle'
import TripReportCell from 'src/components/TripReportCell'

type TripReportPageProps = {
  id: number
}

const TripReportPage = ({ id }: TripReportPageProps) => {
  return (
    <>
      <Metadata title="Trip Report" description="Detailed report for a trip" />
      <div className="py-4">
        <ShareTripControls tripId={id} />
        <TripPrivacyToggle tripId={id} />
        <TripReportCell id={id} />
      </div>
    </>
  )
}

export default TripReportPage
