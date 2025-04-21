// Type definitions for Google Maps JavaScript API
declare namespace google.maps {
  interface Place {
    geometry?: {
      location?: {
        lat(): number
        lng(): number
      }
    }
    formattedAddress?: string
    formatted_address?: string
  }
}

declare interface Window {
  google: {
    maps: {
      Map: any
      Marker: any
      Geocoder: any
      GeocoderStatus: {
        OK: any
      }
      LatLngBounds: any
      LatLng: any
      Polyline: any
      DirectionsService: any
      DirectionsRenderer: any
      TravelMode: {
        DRIVING: any
        WALKING: any
        BICYCLING: any
        TRANSIT: any
      }
      SymbolPath: {
        CIRCLE: any
        FORWARD_CLOSED_ARROW: any
        FORWARD_OPEN_ARROW: any
        BACKWARD_CLOSED_ARROW: any
        BACKWARD_OPEN_ARROW: any
        HOME: any
      }
      marker?: {
        AdvancedMarkerElement: any
      }
      places: {
        Autocomplete: any
        AutocompleteService: any
        PlacesService: any
        PlacesServiceStatus: any
        PlaceAutocompleteElement: {
          new (options: {
            types?: string[]
            inputPlaceholder?: string
            inputValue?: string
            componentRestrictions?: {
              country?: string[]
            }
          }): HTMLElement & {
            addEventListener(
              event: string,
              callback: (event: {
                detail: { place: google.maps.Place }
              }) => void
            ): void
          }
        }
        Place: google.maps.Place
      }
    }
  }
  initMap?: () => void // Global callback function for Google Maps API
}
