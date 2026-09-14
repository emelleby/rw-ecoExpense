import { Metadata } from '@redwoodjs/web'

import SharedTripReportCell from 'src/components/SharedTripReportCell'

type SharedTripReportPageProps = {
  token: string
}

const SharedTripReportPage = ({ token }: SharedTripReportPageProps) => {
  return (
    <>
      <Metadata
        title="Trip Report"
        description="Shared trip report"
        robots="noindex, nofollow"
      />
      <div className="rw-scaffold min-h-screen">
        <div className="container mx-auto flex justify-end py-4 print:hidden">
          <button
            onClick={() => window.print()}
            className="flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Print Report
          </button>
        </div>
        <div className="py-4">
          <SharedTripReportCell token={token} />
        </div>
      </div>
    </>
  )
}

export default SharedTripReportPage
