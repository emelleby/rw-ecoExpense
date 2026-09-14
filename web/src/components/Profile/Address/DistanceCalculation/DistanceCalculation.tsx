import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/Button'

interface DistanceCalculationProps {
  homeLocation: { lat: number; lng: number }
  workLocation: { lat: number; lng: number }
  isLoaded: boolean
}

type TravelModeType = 'DRIVING' | 'WALKING' | 'BICYCLING' | 'TRANSIT'

interface RouteInfo {
  distance: string
  duration: string
}

// ponytail: localStorage is the cache. A route between two fixed points doesn't
// change, so one Directions call per (origin, destination, mode) — ever.
// Move to the DB only if the distance needs to be queryable server-side.
const cacheGet = (key: string): RouteInfo | null => {
  try {
    return JSON.parse(localStorage.getItem(key) || 'null')
  } catch {
    return null
  }
}
const cacheSet = (key: string, value: RouteInfo) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* quota / private mode — the fetch still worked */
  }
}

const DistanceCalculation = ({
  homeLocation,
  workLocation,
  isLoaded,
}: DistanceCalculationProps) => {
  const [selectedMode, setSelectedMode] = useState<TravelModeType>('DRIVING')
  const [routes, setRoutes] = useState<
    Partial<Record<TravelModeType, RouteInfo>>
  >({})
  const [error, setError] = useState<string | null>(null)

  // Depend on the coordinates, not the prop objects: callers pass fresh object
  // literals every render, which re-fired this effect (and the API) endlessly.
  const { lat: oLat, lng: oLng } = homeLocation
  const { lat: dLat, lng: dLng } = workLocation

  // Only the selected mode is ever shown, so only the selected mode is fetched.
  useEffect(() => {
    if (!isLoaded) return

    const key = `route:${oLat},${oLng}>${dLat},${dLng}:${selectedMode}`
    const cached = cacheGet(key)
    if (cached) {
      setError(null)
      setRoutes((prev) => ({ ...prev, [selectedMode]: cached }))
      return
    }

    let cancelled = false
    setError(null)

    new window.google.maps.DirectionsService().route(
      {
        origin: new window.google.maps.LatLng(oLat, oLng),
        destination: new window.google.maps.LatLng(dLat, dLng),
        travelMode: window.google.maps.TravelMode[selectedMode],
      },
      (result, status) => {
        if (cancelled) return

        const leg = status === 'OK' ? result?.routes[0]?.legs?.[0] : undefined
        if (!leg) {
          setError(`Could not calculate route: ${status}`)
          return
        }

        const info = {
          distance: leg.distance?.text || 'Unknown',
          duration: leg.duration?.text || 'Unknown',
        }
        cacheSet(key, info)
        setRoutes((prev) => ({ ...prev, [selectedMode]: info }))
      }
    )

    return () => {
      cancelled = true
    }
  }, [isLoaded, oLat, oLng, dLat, dLng, selectedMode])

  const currentRouteInfo = routes[selectedMode]

  const getTravelModeIcon = (mode: TravelModeType) => {
    switch (mode) {
      case 'DRIVING':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="1" y="3" width="15" height="13" rx="1" />
            <path d="m16 8 2 3h4l-3 5H3l1.5-5H8l2-3h6Z" />
            <circle cx="5" cy="18" r="2" />
            <circle cx="14" cy="18" r="2" />
          </svg>
        )
      case 'WALKING':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="5" r="2" />
            <path d="m10 22 4-11 3 5 5-5-2 7" />
            <path d="m8 22 3-14 4 6" />
          </svg>
        )
      case 'BICYCLING':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="6" cy="15" r="4" />
            <circle cx="18" cy="15" r="4" />
            <path d="M6 15 8 7h6l1 4 5 1" />
            <path d="m12 7 3 8" />
          </svg>
        )
      case 'TRANSIT':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M7 10h10" />
            <path d="M7 14h10" />
            <path d="M10 7v10" />
            <path d="M14 7v10" />
          </svg>
        )
      default:
        return null
    }
  }

  const travelModeLabels: Record<TravelModeType, string> = {
    DRIVING: 'Driving',
    WALKING: 'Walking',
    BICYCLING: 'Cycling',
    TRANSIT: 'Transit',
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {(
          ['DRIVING', 'WALKING', 'BICYCLING', 'TRANSIT'] as TravelModeType[]
        ).map((mode) => (
          <Button
            key={mode}
            onClick={() => setSelectedMode(mode)}
            className={`flex items-center rounded-md px-3 py-2 transition-colors hover:bg-accent ${
              selectedMode === mode
                ? 'bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground'
                : 'bg-secondary text-secondary-foreground'
            }`}
          >
            <span className="mr-2">{getTravelModeIcon(mode)}</span>
            <span>{travelModeLabels[mode]}</span>
          </Button>
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2 h-5 w-5 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
          <span className="font-medium">Distance:</span>
          <span className="ml-2">
            {error ?? currentRouteInfo?.distance ?? 'Calculating…'}
          </span>
        </div>
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2 h-5 w-5 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="font-medium">Travel time:</span>
          <span className="ml-2">
            {error ?? currentRouteInfo?.duration ?? 'Calculating…'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default DistanceCalculation
