const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const mapProvider = import.meta.env.VITE_MAP_PROVIDER || 'auto';

let googleLoaderPromise = null;

export function shouldUseGoogleMaps() {
  return Boolean(googleMapsApiKey) && mapProvider !== 'osm';
}

export async function geocodeWithGoogle(address) {
  const google = await loadGoogleMaps();
  if (!google) return null;

  const geocoder = new google.maps.Geocoder();
  const response = await geocoder.geocode({
    address,
    componentRestrictions: {
      country: 'BR',
      locality: 'Blumenau',
      administrativeArea: 'SC',
    },
    region: 'br',
  });

  const result = response.results?.[0];
  const location = result?.geometry?.location;
  if (!location) return null;

  return {
    label: result.formatted_address || address,
    lat: location.lat(),
    lon: location.lng(),
    source: 'google',
  };
}

export async function calculateGoogleRoute(origin, destination) {
  const google = await loadGoogleMaps();
  if (!google || !origin || !destination) return null;

  const directionsService = new google.maps.DirectionsService();
  const response = await directionsService.route({
    origin: { lat: origin.lat, lng: origin.lon },
    destination: { lat: destination.lat, lng: destination.lon },
    travelMode: google.maps.TravelMode.DRIVING,
    provideRouteAlternatives: false,
    region: 'br',
  });

  const route = response.routes?.[0];
  const leg = route?.legs?.[0];
  if (!route || !leg) return null;

  return {
    distanceKm: Number(((leg.distance?.value || 0) / 1000).toFixed(1)),
    durationMinutes: Math.max(1, Math.ceil((leg.duration?.value || 0) / 60)),
    coordinates: route.overview_path.map((point) => [point.lat(), point.lng()]),
    provider: 'Google Maps',
  };
}

async function loadGoogleMaps() {
  if (!shouldUseGoogleMaps()) return null;
  if (window.google?.maps?.Geocoder && window.google?.maps?.DirectionsService) {
    return window.google;
  }

  if (!googleLoaderPromise) {
    googleLoaderPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-google-maps-loader="true"]');
      if (existing) {
        existing.addEventListener('load', () => resolve(window.google));
        existing.addEventListener('error', reject);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(googleMapsApiKey)}&libraries=places&language=pt-BR&region=BR`;
      script.async = true;
      script.defer = true;
      script.dataset.googleMapsLoader = 'true';
      script.onload = () => resolve(window.google);
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  try {
    return await googleLoaderPromise;
  } catch {
    return null;
  }
}
