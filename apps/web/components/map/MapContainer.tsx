'use client';

/**
 * MapContainer Component
 * Reusable map component using react-leaflet and OpenStreetMap
 * 
 * Props:
 * - center: [lat, lng] - Center coordinates
 * - zoom: number - Initial zoom level
 * - markers: Array of marker objects
 * - polylines: Array of polyline objects
 * - onMarkerClick: Callback when marker is clicked
 * - onMapClick: Callback when map is clicked
 */

import { MapContainer as LeafletMapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet';
import { LatLngExpression, Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

// Fix for default marker icons in Next.js
if (typeof window !== 'undefined') {
  // @ts-ignore
  delete Icon.Default.prototype._getIconUrl;
  Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
}

export interface MapMarker {
  id: string | number;
  position: [number, number];
  title?: string;
  color?: string;
  icon?: string;
  popup?: string;
}

export interface MapPolyline {
  id: string | number;
  positions: [number, number][];
  color?: string;
  weight?: number;
}

export interface MapContainerProps {
  center: [number, number];
  zoom: number;
  markers?: MapMarker[];
  polylines?: MapPolyline[];
  onMarkerClick?: (marker: MapMarker) => void;
  onMapClick?: (lat: number, lng: number) => void;
  height?: string;
  className?: string;
}

/**
 * Map click handler component
 */
function MapClickHandler({ onMapClick }: { onMapClick?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

/**
 * Main MapContainer component
 */
export default function MapContainer({
  center,
  zoom,
  markers = [],
  polylines = [],
  onMarkerClick,
  onMapClick,
  height = '400px',
  className = ''
}: MapContainerProps) {
  return (
    <div className={className} style={{ height, width: '100%' }}>
      <LeafletMapContainer
        center={center as LatLngExpression}
        zoom={zoom}
        style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
        scrollWheelZoom={true}
      >
        {/* OpenStreetMap tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Markers */}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.position as LatLngExpression}
            eventHandlers={{
              click: () => {
                if (onMarkerClick) {
                  onMarkerClick(marker);
                }
              },
            }}
          >
            {(marker.title || marker.popup) && (
              <Popup>
                <div>
                  {marker.title && <strong>{marker.title}</strong>}
                  {marker.popup && <p className="text-sm mt-1">{marker.popup}</p>}
                </div>
              </Popup>
            )}
          </Marker>
        ))}

        {/* Polylines (routes) */}
        {polylines.map((polyline) => (
          <Polyline
            key={polyline.id}
            positions={polyline.positions as LatLngExpression[]}
            pathOptions={{
              color: polyline.color || '#3b82f6',
              weight: polyline.weight || 4,
              opacity: 0.7,
            }}
          />
        ))}

        {/* Map click handler */}
        {onMapClick && <MapClickHandler onMapClick={onMapClick} />}
      </LeafletMapContainer>
    </div>
  );
}
