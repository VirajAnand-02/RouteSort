/**
 * Shared TypeScript types for the RouteSort application
 * These types are used across the frontend, backend, and mobile apps
 */

// User roles
export type UserRole = 'citizen' | 'driver' | 'coordinator';

// Status enums
export type PickupStatus = 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
export type RouteStatus = 'planned' | 'active' | 'completed' | 'cancelled';
export type DriverStatus = 'available' | 'on_route' | 'offline';
export type StopStatus = 'pending' | 'arrived' | 'completed' | 'skipped';

// Coordinate type for lat/lng
export interface Coordinate {
  lat: number;
  lng: number;
}

// User model
export interface User {
  id: number;
  clerk_id: string;
  email: string;
  role: UserRole;
  full_name?: string;
  phone?: string;
  points_balance?: number;
  created_at: string;
  updated_at: string;
}

// Pickup request model
export interface PickupRequest {
  id: number;
  user_id: number;
  address: string;
  latitude: number;
  longitude: number;
  waste_type: string;
  description?: string;
  photo_url?: string;
  scheduled_date?: string;
  time_slot?: string;
  status: PickupStatus;
  weight_estimate?: number;
  priority?: number;
  type_guess?: string;
  created_at: string;
  updated_at: string;
}

// Driver model
export interface Driver {
  id: number;
  user_id: number;
  vehicle_number: string;
  vehicle_type?: string;
  capacity_kg?: number;
  status: DriverStatus;
  current_latitude?: number;
  current_longitude?: number;
  created_at: string;
  updated_at: string;
}

// Route model
export interface Route {
  id: number;
  driver_id?: number;
  route_name?: string;
  route_date: string;
  start_time?: string;
  end_time?: string;
  status: RouteStatus;
  total_distance_km?: number;
  optimized_path?: Coordinate[];
  created_at: string;
  updated_at: string;
}

// Route stop model
export interface RouteStop {
  id: number;
  route_id: number;
  pickup_request_id: number;
  stop_order: number;
  estimated_arrival?: string;
  actual_arrival?: string;
  status: StopStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Recycling guide model
export interface RecyclingGuide {
  id: number;
  item_name: string;
  category: string;
  recyclable: boolean;
  instructions?: string;
  image_url?: string;
  created_at: string;
}

// Reward model
export interface Reward {
  id: number;
  user_id: number;
  amount: number;
  description?: string;
  redeemed_at?: string;
  created_at: string;
}

// Audit log model
export interface AuditLog {
  id: number;
  user_id: number;
  action: string;
  entity_type: string;
  entity_id: number;
  details?: Record<string, any>;
  photo_url?: string;
  created_at: string;
}

// API Request/Response types
export interface CreatePickupRequest {
  user_id: number;
  address: string;
  latitude: number;
  longitude: number;
  waste_type: string;
  description?: string;
  photo_url?: string;
  scheduled_date?: string;
  time_slot?: string;
  weight_estimate?: number;
  priority?: number;
}

export interface UpdateDriverLocationRequest {
  latitude: number;
  longitude: number;
}

export interface OptimizeRouteRequest {
  driver_ids: number[];
  pickup_ids: number[];
  vehicle_capacities?: Record<number, number>;
  max_route_length?: number;
  priority_weight?: number;
}

export interface OptimizeRouteResponse {
  routes: {
    driver_id: number;
    path: Coordinate[];
    stops: {
      pickup_id: number;
      seq: number;
      eta?: string;
    }[];
    total_distance: number;
    estimated_duration: number;
  }[];
  stats: {
    total_pickups: number;
    total_distance: number;
    average_route_length: number;
    unassigned_pickups: number[];
  };
}

export interface ClassifyImageRequest {
  image: File | Blob | string; // base64 or multipart
  user_id?: number;
}

export interface ClassifyImageResponse {
  classification: string;
  confidence: number;
  category: string;
  recyclable: boolean;
  instructions?: string;
  job_id?: string; // For async processing
}

// Map component props
export interface MapComponentProps {
  center: Coordinate;
  zoom: number;
  markers?: MapMarker[];
  polylines?: MapPolyline[];
  onMarkerClick?: (marker: MapMarker) => void;
  onMapClick?: (coord: Coordinate) => void;
}

export interface MapMarker {
  id: string | number;
  position: Coordinate;
  title?: string;
  icon?: string;
  color?: string;
}

export interface MapPolyline {
  id: string | number;
  positions: Coordinate[];
  color?: string;
  weight?: number;
}

// Error response
export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
  details?: any;
}
