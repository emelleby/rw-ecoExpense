import Spinner from 'src/components/ui/Spinner'

// Shown by Redwood's `whileLoadingPage` while a lazy page chunk loads.
// Kept transparent so the surrounding layout/background shows through
// instead of flashing a full-screen colored page.
const LoaderSpinner = () => {
  return (
    <div className="flex min-h-[50vh] w-full items-center justify-center">
      <Spinner />
    </div>
  )
}

export default LoaderSpinner
