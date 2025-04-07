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
