'use client';

/**
 * DynamicMap Component
 * SSR-safe wrapper for MapContainer using Next.js dynamic import
 * 
 * Usage:
 * import DynamicMap from '@/components/map/DynamicMap';
 * 
 * <DynamicMap
 *   center={[40.7128, -74.0060]}
 *   zoom={13}
 *   markers={[...]}
 *   polylines={[...]}
 * />
 */

import dynamic from 'next/dynamic';
import { MapContainerProps } from './MapContainer';

// Dynamically import MapContainer with SSR disabled
const MapContainer = dynamic(() => import('./MapContainer'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full w-full bg-gray-100 rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading map...</p>
      </div>
    </div>
  ),
});

export default function DynamicMap(props: MapContainerProps) {
  return <MapContainer {...props} />;
}
