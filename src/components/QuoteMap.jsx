import L from 'leaflet';
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import { useEffect } from 'react';

const fallbackCenter = [-26.9189, -49.0661];

function createIcon(label, type) {
  return L.divIcon({
    className: '',
    html: `<span class="map-marker ${type}">${label}</span>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

function MapBounds({ origin, destination, routeCoordinates }) {
  const map = useMap();

  useEffect(() => {
    const points = routeCoordinates?.length
      ? routeCoordinates
      : [origin, destination].filter(Boolean).map((point) => [point.lat, point.lon]);
    if (points.length >= 2) {
      map.fitBounds(points, { padding: [44, 44], maxZoom: 14 });
    } else if (points.length === 1) {
      map.setView(points[0], 13);
    }
  }, [origin, destination, routeCoordinates, map]);

  return null;
}

function MapClickAdjuster({ adjustMode, origin, destination, onOriginChange, onDestinationChange }) {
  useMapEvents({
    click(event) {
      if (!adjustMode) return;
      const point = adjustMode === 'origin' ? origin : destination;
      const fallbackLabel = adjustMode === 'origin' ? 'Coleta ajustada no mapa' : 'Entrega ajustada no mapa';
      const nextPoint = {
        ...(point || {}),
        label: point?.label || fallbackLabel,
        lat: event.latlng.lat,
        lon: event.latlng.lng,
        manuallyAdjusted: true,
      };

      if (adjustMode === 'origin') {
        onOriginChange?.(nextPoint);
      } else {
        onDestinationChange?.(nextPoint);
      }
    },
  });

  return null;
}

export default function QuoteMap({
  origin,
  destination,
  routeCoordinates,
  adjustMode,
  onOriginChange,
  onDestinationChange,
}) {
  const fallbackRoute = [origin, destination].filter(Boolean).map((point) => [point.lat, point.lon]);
  const route = routeCoordinates?.length ? routeCoordinates : fallbackRoute;
  const markerHandlers = (point, onChange, suffix) => ({
    dragend(event) {
      const nextPosition = event.target.getLatLng();
      onChange?.({
        ...point,
        lat: nextPosition.lat,
        lon: nextPosition.lng,
        manuallyAdjusted: true,
        label: point.label?.includes('(pino ajustado)') ? point.label : `${point.label} (${suffix})`,
      });
    },
  });

  return (
    <MapContainer center={fallbackCenter} zoom={12} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapBounds origin={origin} destination={destination} routeCoordinates={routeCoordinates} />
      <MapClickAdjuster
        adjustMode={adjustMode}
        origin={origin}
        destination={destination}
        onOriginChange={onOriginChange}
        onDestinationChange={onDestinationChange}
      />
      {origin ? (
        <Marker
          position={[origin.lat, origin.lon]}
          icon={createIcon('A', 'origin')}
          draggable={Boolean(onOriginChange)}
          eventHandlers={markerHandlers(origin, onOriginChange, 'pino ajustado')}
        >
          <Popup>Coleta: {origin.label}</Popup>
        </Marker>
      ) : null}
      {destination ? (
        <Marker
          position={[destination.lat, destination.lon]}
          icon={createIcon('B', 'destination')}
          draggable={Boolean(onDestinationChange)}
          eventHandlers={markerHandlers(destination, onDestinationChange, 'pino ajustado')}
        >
          <Popup>Entrega: {destination.label}</Popup>
        </Marker>
      ) : null}
      {route.length >= 2 ? <Polyline positions={route} color="#e11d2f" weight={5} opacity={0.85} /> : null}
    </MapContainer>
  );
}
