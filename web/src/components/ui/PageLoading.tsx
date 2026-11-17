import Spinner from 'src/components/ui/Spinner'

// Shared in-page loading state: cells' `Loading` and the Routes page fallback.
const PageLoading = () => (
  <div className="flex justify-center py-16">
    <Spinner />
  </div>
)

export default PageLoading
