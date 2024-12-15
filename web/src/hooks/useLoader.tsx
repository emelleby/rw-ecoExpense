import { useState } from 'react'

import Spinner from 'src/components/ui/Spinner'

const useLoader = () => {
  const [loading, setLoading] = useState(false)

  const showLoader = () => setLoading(true)
  const hideLoader = () => setLoading(false)

  const Loader = () =>
    loading ? (
      <div className="absolute left-[50%] top-10 h-full  w-full -translate-x-[50%] bg-white opacity-50">
        <Spinner />
      </div>
    ) : null

  return { showLoader, hideLoader, Loader }
}

export default useLoader
