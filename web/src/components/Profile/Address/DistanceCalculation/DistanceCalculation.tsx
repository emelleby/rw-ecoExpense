import { useEffect, useState, useCallback } from 'react'

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
  loading: boolean
  error: string | null
}

const DistanceCalculation = ({
  homeLocation,
  workLocation,
  isLoaded,
}: DistanceCalculationProps) => {
  console.log('Home Location:', homeLocation)
  console.log('Work Location:', workLocation)
  const [selectedMode, setSelectedMode] = useState<TravelModeType>('DRIVING')
  const [routeInfo, setRouteInfo] = useState<Record<TravelModeType, RouteInfo>>(
    {
      DRIVING: { distance: '', duration: '', loading: true, error: null },
      WALKING: { distance: '', duration: '', loading: true, error: null },
      BICYCLING: { distance: '', duration: '', loading: true, error: null },
      TRANSIT: { distance: '', duration: '', loading: true, error: null },
    }
  )

  const calculateRoute = useCallback(
    (travelMode: TravelModeType) => {
      if (!isLoaded || !homeLocation || !workLocation) {
        return
      }

      // Update loading state for this travel mode
      setRouteInfo((prev) => ({
        ...prev,
        [travelMode]: { ...prev[travelMode], loading: true, error: null },
      }))

      try {
        const directionsService = new window.google.maps.DirectionsService()

        directionsService.route(
          {
            origin: new window.google.maps.LatLng(
              homeLocation.lat,
              homeLocation.lng
            ),
            destination: new window.google.maps.LatLng(
              workLocation.lat,
              workLocation.lng
            ),
            travelMode: window.google.maps.TravelMode[travelMode],
          },
          (result, status) => {
            if (status === 'OK' && result) {
              const route = result.routes[0]
              if (route && route.legs && route.legs[0]) {
                setRouteInfo((prev) => ({
                  ...prev,
                  [travelMode]: {
                    distance: route.legs[0].distance?.text || 'Unknown',
                    duration: route.legs[0].duration?.text || 'Unknown',
                    loading: false,
                    error: null,
                  },
                }))
              } else {
                setRouteInfo((prev) => ({
                  ...prev,
                  [travelMode]: {
                    ...prev[travelMode],
                    loading: false,
                    error: 'Could not calculate route details',
                  },
                }))
              }
            } else {
              setRouteInfo((prev) => ({
                ...prev,
                [travelMode]: {
                  ...prev[travelMode],
                  loading: false,
                  error: `Could not calculate route: ${status}`,
                },
              }))
            }
          }
        )
      } catch (err) {
        console.error(`Error calculating ${travelMode} route:`, err)
        setRouteInfo((prev) => ({
          ...prev,
          [travelMode]: {
            ...prev[travelMode],
            loading: false,
            error: 'Error calculating distance',
          },
        }))
      }
    },
    [isLoaded, homeLocation, workLocation]
  )

  // Calculate the route for the selected travel mode when component mounts or locations change
  useEffect(() => {
    if (!isLoaded || !homeLocation || !workLocation) {
      return
    }

    // Calculate routes for all travel modes
    calculateRoute('DRIVING')
    calculateRoute('WALKING')
    calculateRoute('BICYCLING')
    calculateRoute('TRANSIT')
  }, [isLoaded, homeLocation, workLocation, calculateRoute])

  const currentRouteInfo = routeInfo[selectedMode]

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

  if (currentRouteInfo.loading) {
    return (
      <div className="rw-text-gray">
        Calculating {travelModeLabels[selectedMode].toLowerCase()} route...
      </div>
    )
  }

  if (currentRouteInfo.error) {
    return <div className="rw-text-error">{currentRouteInfo.error}</div>
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
            disabled={routeInfo[mode].loading}
          >
            <span className="mr-2">{getTravelModeIcon(mode)}</span>
            <span>{travelModeLabels[mode]}</span>
            {routeInfo[mode].loading && (
              <span className="ml-2 animate-pulse">...</span>
            )}
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
          <span className="ml-2">{currentRouteInfo.distance}</span>
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
          <span className="ml-2">{currentRouteInfo.duration}</span>
        </div>
      </div>
    </div>
  )
}

export default DistanceCalculation
