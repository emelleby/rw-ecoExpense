// Type definitions for Google Maps JavaScript API
declare interface Window {
  google: {
    maps: {
      Map: any;
      Marker: any;
      Geocoder: any;
      GeocoderStatus: {
        OK: any;
      };
      LatLngBounds: any;
      LatLng: any;
      Polyline: any;
      DirectionsService: any;
      DirectionsRenderer: any;
      TravelMode: {
        DRIVING: any;
        WALKING: any;
        BICYCLING: any;
        TRANSIT: any;
      };
      SymbolPath: {
        CIRCLE: any;
        FORWARD_CLOSED_ARROW: any;
        FORWARD_OPEN_ARROW: any;
        BACKWARD_CLOSED_ARROW: any;
        BACKWARD_OPEN_ARROW: any;
        HOME: any;
      };
      marker?: {
        AdvancedMarkerElement: any;
      };
      places: {
        Autocomplete: any;
        AutocompleteService: any;
        PlacesService: any;
        PlacesServiceStatus: any;
      };
    };
  };
  initMap?: () => void; // Global callback function for Google Maps API
}
