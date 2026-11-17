import { Metadata } from '@redwoodjs/web'

import SharedTripReportCell from 'src/components/SharedTripReportCell'
import { useReportPrintTheme } from 'src/hooks/useReportPrintTheme'

type SharedTripReportPageProps = {
  token: string
}

const SharedTripReportPage = ({ token }: SharedTripReportPageProps) => {
  // Print on white even when the document boots in dark mode
  useReportPrintTheme()

  return (
    <>
      <Metadata
        title="Trip Report"
        description="Shared trip report"
        robots="noindex, nofollow"
      />
      <div className="rw-scaffold">
        <div className="container mx-auto flex justify-end py-4 print:hidden">
          <button
            onClick={() => window.print()}
            className="flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Print Report
          </button>
        </div>
        <div className="container mx-auto py-4">
          <SharedTripReportCell token={token} />
        </div>
      </div>
    </>
  )
}

export default SharedTripReportPage
