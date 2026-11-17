import { useState } from 'react'

import Spinner from 'src/components/ui/Spinner'

const useLoader = () => {
  const [loading, setLoading] = useState(false)

  const showLoader = () => setLoading(true)
  const hideLoader = () => setLoading(false)

  const Loader = () =>
    loading ? (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-[1px]">
        <Spinner fill={false} />
      </div>
    ) : null

  return { showLoader, hideLoader, Loader }
}

export default useLoader
