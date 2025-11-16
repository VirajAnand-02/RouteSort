import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { query } from '@/lib/db';

// Import CVRP algorithm (we'll need to build this as a shared module or copy it)
// For now, inline simplified version
interface Coordinate {
  lat: number;
  lng: number;
}

interface PickupPoint extends Coordinate {
  id: number;
  weight: number;
  priority: number;
}

interface Vehicle {
  id: number;
  capacity: number;
  start_location: Coordinate;
}

/**
 * Calculate Haversine distance between two coordinates in km
 */
function haversineDistance(coord1: Coordinate, coord2: Coordinate): number {
  const R = 6371;
  const dLat = (coord2.lat - coord1.lat) * (Math.PI / 180);
  const dLon = (coord2.lng - coord1.lng) * (Math.PI / 180);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(coord1.lat * (Math.PI / 180)) * Math.cos(coord2.lat * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Simple nearest neighbor TSP
 */
function nearestNeighborTSP(pickups: PickupPoint[], start: Coordinate): PickupPoint[] {
  if (pickups.length === 0) return [];
  
  const unvisited = new Set(pickups);
  const route: PickupPoint[] = [];
  let current: Coordinate = start;
  
  while (unvisited.size > 0) {
    let nearest: PickupPoint | null = null;
    let minDist = Infinity;
    
    for (const pickup of unvisited) {
      const dist = haversineDistance(current, pickup);
      if (dist < minDist) {
        minDist = dist;
        nearest = pickup;
      }
    }
    
    if (nearest) {
      route.push(nearest);
      unvisited.delete(nearest);
      current = nearest;
    }
  }
  
  return route;
}

/**
 * POST /api/routes/optimize
 * Optimize routes for drivers using CVRP algorithm
 * 
 * Body:
 * - driver_ids: number[] (required)
 * - pickup_ids: number[] (required)
 * - vehicle_capacities: Record<number, number> (optional)
 * - max_route_length: number (optional, in km)
 * - priority_weight: number (optional, 0-1)
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user from database
    const userResult = await query(
      'SELECT * FROM users WHERE clerk_id = $1',
      [userId]
    );
    const user = userResult.rows[0];

    if (!user) {
      return NextResponse.json(
        { error: 'Not Found', message: 'User not found' },
        { status: 404 }
      );
    }

    // Only coordinators can optimize routes
    if (user.role !== 'coordinator') {
      return NextResponse.json(
        { error: 'Forbidden', message: 'Only coordinators can optimize routes' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const {
      driver_ids,
      pickup_ids,
      vehicle_capacities = {},
      max_route_length = 100,
      priority_weight = 0.3
    } = body;

    // Validate required fields
    if (!driver_ids || !Array.isArray(driver_ids) || driver_ids.length === 0) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'driver_ids is required and must be a non-empty array' },
        { status: 400 }
      );
    }

    if (!pickup_ids || !Array.isArray(pickup_ids) || pickup_ids.length === 0) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'pickup_ids is required and must be a non-empty array' },
        { status: 400 }
      );
    }

    // Fetch drivers
    const driversResult = await query(
      `SELECT d.*, COALESCE(d.current_latitude, 40.7128) as lat, 
              COALESCE(d.current_longitude, -74.0060) as lng
       FROM drivers d
       WHERE d.id = ANY($1)`,
      [driver_ids]
    );

    if (driversResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Not Found', message: 'No drivers found' },
        { status: 404 }
      );
    }

    // Fetch pickups
    const pickupsResult = await query(
      `SELECT id, latitude as lat, longitude as lng, 
              COALESCE(weight_estimate, 10) as weight, 
              COALESCE(priority, 5) as priority
       FROM pickup_requests
       WHERE id = ANY($1) AND status = 'pending'`,
      [pickup_ids]
    );

    if (pickupsResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Not Found', message: 'No pending pickups found' },
        { status: 404 }
      );
    }

    // Build vehicles array
    const vehicles: Vehicle[] = driversResult.rows.map(d => ({
      id: d.id,
      capacity: vehicle_capacities[d.id] || d.capacity_kg || 5000,
      start_location: { lat: parseFloat(d.lat), lng: parseFloat(d.lng) }
    }));

    // Build pickups array
    const pickups: PickupPoint[] = pickupsResult.rows.map(p => ({
      id: p.id,
      lat: parseFloat(p.lat),
      lng: parseFloat(p.lng),
      weight: parseInt(p.weight),
      priority: parseInt(p.priority)
    }));

    // Simple clustering - divide pickups among vehicles
    const pickupsPerVehicle = Math.ceil(pickups.length / vehicles.length);
    const sortedPickups = [...pickups].sort((a, b) => b.priority - a.priority);
    
    const optimizedRoutes: any[] = [];
    const unassigned: number[] = [];
    let pickupIndex = 0;

    for (const vehicle of vehicles) {
      const vehiclePickups: PickupPoint[] = [];
      let totalWeight = 0;

      // Assign pickups to this vehicle
      while (pickupIndex < sortedPickups.length && vehiclePickups.length < pickupsPerVehicle) {
        const pickup = sortedPickups[pickupIndex];
        
        if (totalWeight + pickup.weight <= vehicle.capacity) {
          vehiclePickups.push(pickup);
          totalWeight += pickup.weight;
          pickupIndex++;
        } else {
          unassigned.push(pickup.id);
          pickupIndex++;
        }
      }

      if (vehiclePickups.length === 0) continue;

      // Optimize route using nearest neighbor
      const route = nearestNeighborTSP(vehiclePickups, vehicle.start_location);

      // Build path
      const path: Coordinate[] = [vehicle.start_location];
      const stops: any[] = [];
      let totalDistance = 0;
      let cumulativeTime = 0;

      for (let i = 0; i < route.length; i++) {
        const pickup = route[i];
        const prevPoint = i === 0 ? vehicle.start_location : route[i - 1];
        const segmentDistance = haversineDistance(prevPoint, pickup);
        
        totalDistance += segmentDistance;
        cumulativeTime += (segmentDistance / 40) * 60; // 40 km/h average speed
        cumulativeTime += 5; // 5 minutes service time

        path.push({ lat: pickup.lat, lng: pickup.lng });
        
        stops.push({
          pickup_id: pickup.id,
          seq: i + 1,
          eta: new Date(Date.now() + cumulativeTime * 60 * 1000).toISOString()
        });
      }

      // Return to start
      path.push(vehicle.start_location);
      totalDistance += haversineDistance(route[route.length - 1], vehicle.start_location);

      // Skip routes that exceed max length
      if (totalDistance > max_route_length) {
        unassigned.push(...vehiclePickups.map(p => p.id));
        continue;
      }

      optimizedRoutes.push({
        driver_id: vehicle.id,
        path,
        stops,
        total_distance: Math.round(totalDistance * 100) / 100,
        estimated_duration: Math.round(cumulativeTime)
      });
    }

    // Calculate stats
    const totalPickups = optimizedRoutes.reduce((sum, r) => sum + r.stops.length, 0);
    const totalDist = optimizedRoutes.reduce((sum, r) => sum + r.total_distance, 0);
    const avgRouteLength = optimizedRoutes.length > 0 ? totalDist / optimizedRoutes.length : 0;

    const response = {
      routes: optimizedRoutes,
      stats: {
        total_pickups: totalPickups,
        total_distance: Math.round(totalDist * 100) / 100,
        average_route_length: Math.round(avgRouteLength * 100) / 100,
        unassigned_pickups: unassigned
      }
    };

    // Save routes to database
    for (const route of optimizedRoutes) {
      const routeResult = await query(
        `INSERT INTO routes (driver_id, route_name, route_date, optimized_path, total_distance_km, status)
         VALUES ($1, $2, CURRENT_DATE, $3, $4, 'planned')
         RETURNING id`,
        [
          route.driver_id,
          `Route ${new Date().toISOString().split('T')[0]}`,
          JSON.stringify(route.path),
          route.total_distance
        ]
      );

      const routeId = routeResult.rows[0].id;

      // Save route stops
      for (const stop of route.stops) {
        await query(
          `INSERT INTO route_stops (route_id, pickup_request_id, stop_order, estimated_arrival, status)
           VALUES ($1, $2, $3, $4, 'pending')`,
          [routeId, stop.pickup_id, stop.seq, stop.eta]
        );

        // Update pickup status
        await query(
          `UPDATE pickup_requests SET status = 'scheduled' WHERE id = $1`,
          [stop.pickup_id]
        );
      }
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error optimizing routes:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to optimize routes' },
      { status: 500 }
    );
  }
}
