"use client";

import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface Stop {
  id: number;
  address: string;
  lat: number;
  lng: number;
  status: string;
}

interface Route {
  id: number;
  name: string;
  stops: Stop[];
}

interface RouteMapProps {
  route: Route;
}

export default function RouteMap({ route }: RouteMapProps) {
  const positions: [number, number][] = route.stops.map((stop) => [
    stop.lat,
    stop.lng,
  ]);

  const center: [number, number] = positions[0] || [40.7128, -74.0060];

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Draw route line */}
      <Polyline positions={positions} color="blue" weight={3} />
      
      {/* Add markers for each stop */}
      {route.stops.map((stop, index) => (
        <Marker key={stop.id} position={[stop.lat, stop.lng]}>
          <Popup>
            <div>
              <strong>Stop {index + 1}</strong>
              <br />
              {stop.address}
              <br />
              Status: {stop.status}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
