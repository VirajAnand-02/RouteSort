/**
 * CVRP (Capacitated Vehicle Routing Problem) Solver
 * Implements greedy + 2-opt local improvement heuristic
 * 
 * Algorithm Overview:
 * 1. Cluster pickups by proximity and priority
 * 2. Assign clusters to vehicles (considering capacity)
 * 3. For each vehicle, solve TSP using nearest neighbor
 * 4. Apply 2-opt improvement to each route
 * 5. Return optimized routes with polylines
 */

export interface Coordinate {
  lat: number;
  lng: number;
}

export interface PickupPoint extends Coordinate {
  id: number;
  weight: number;
  priority: number;
  address?: string;
}

export interface Vehicle {
  id: number;
  capacity: number;
  start_location: Coordinate;
}

export interface RouteStop {
  pickup_id: number;
  seq: number;
  eta?: string;
  distance_from_prev?: number;
}

export interface OptimizedRoute {
  driver_id: number;
  path: Coordinate[];
  stops: RouteStop[];
  total_distance: number;
  estimated_duration: number;
  total_weight: number;
}

export interface OptimizationParams {
  max_route_length?: number; // km
  priority_weight?: number; // 0-1, weight for priority in clustering
  average_speed?: number; // km/h for ETA calculation
}

/**
 * Calculate Haversine distance between two coordinates in km
 */
export function haversineDistance(coord1: Coordinate, coord2: Coordinate): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(coord2.lat - coord1.lat);
  const dLon = toRad(coord2.lng - coord1.lng);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coord1.lat)) * Math.cos(toRad(coord2.lat)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Simple k-means clustering for pickups
 * Groups pickups by proximity considering priority
 */
export function clusterPickups(
  pickups: PickupPoint[],
  numClusters: number,
  priorityWeight: number = 0.3
): PickupPoint[][] {
  if (pickups.length === 0) return [];
  if (pickups.length <= numClusters) {
    return pickups.map(p => [p]);
  }

  // Initialize centroids randomly
  const centroids: Coordinate[] = [];
  const usedIndices = new Set<number>();
  
  for (let i = 0; i < numClusters; i++) {
    let idx;
    do {
      idx = Math.floor(Math.random() * pickups.length);
    } while (usedIndices.has(idx));
    usedIndices.add(idx);
    centroids.push({ lat: pickups[idx].lat, lng: pickups[idx].lng });
  }

  // K-means iterations
  const maxIterations = 10;
  let clusters: PickupPoint[][] = [];
  
  for (let iter = 0; iter < maxIterations; iter++) {
    // Assign pickups to nearest centroid
    clusters = Array.from({ length: numClusters }, () => []);
    
    for (const pickup of pickups) {
      let minDist = Infinity;
      let closestCluster = 0;
      
      for (let i = 0; i < centroids.length; i++) {
        const dist = haversineDistance(pickup, centroids[i]);
        // Factor in priority - higher priority = prefer closer assignment
        const weightedDist = dist / (1 + priorityWeight * pickup.priority / 10);
        
        if (weightedDist < minDist) {
          minDist = weightedDist;
          closestCluster = i;
        }
      }
      
      clusters[closestCluster].push(pickup);
    }
    
    // Update centroids
    for (let i = 0; i < numClusters; i++) {
      if (clusters[i].length > 0) {
        const avgLat = clusters[i].reduce((sum, p) => sum + p.lat, 0) / clusters[i].length;
        const avgLng = clusters[i].reduce((sum, p) => sum + p.lng, 0) / clusters[i].length;
        centroids[i] = { lat: avgLat, lng: avgLng };
      }
    }
  }
  
  return clusters.filter(c => c.length > 0);
}

/**
 * Nearest neighbor algorithm for TSP
 * Starts from depot, visits nearest unvisited node
 */
export function nearestNeighborTSP(
  pickups: PickupPoint[],
  start: Coordinate
): PickupPoint[] {
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
 * 2-opt improvement algorithm
 * Tries to eliminate crossing edges in the route
 */
export function twoOptImprovement(route: PickupPoint[], start: Coordinate): PickupPoint[] {
  if (route.length < 4) return route;
  
  let improved = true;
  let bestRoute = [...route];
  
  while (improved) {
    improved = false;
    
    for (let i = 0; i < bestRoute.length - 1; i++) {
      for (let j = i + 2; j < bestRoute.length; j++) {
        // Calculate current distance
        const point1 = i === 0 ? start : bestRoute[i - 1];
        const point2 = bestRoute[i];
        const point3 = bestRoute[j];
        const point4 = j === bestRoute.length - 1 ? start : bestRoute[j + 1];
        
        const currentDist = 
          haversineDistance(point1, point2) + haversineDistance(point3, point4);
        
        // Calculate distance after swap
        const newDist = 
          haversineDistance(point1, point3) + haversineDistance(point2, point4);
        
        // If improvement, reverse the segment
        if (newDist < currentDist) {
          const newRoute = [
            ...bestRoute.slice(0, i),
            ...bestRoute.slice(i, j + 1).reverse(),
            ...bestRoute.slice(j + 1)
          ];
          bestRoute = newRoute;
          improved = true;
        }
      }
    }
  }
  
  return bestRoute;
}

/**
 * Calculate total distance of a route
 */
export function calculateRouteDistance(
  route: PickupPoint[],
  start: Coordinate
): number {
  if (route.length === 0) return 0;
  
  let total = haversineDistance(start, route[0]);
  
  for (let i = 0; i < route.length - 1; i++) {
    total += haversineDistance(route[i], route[i + 1]);
  }
  
  // Return to start
  total += haversineDistance(route[route.length - 1], start);
  
  return total;
}

/**
 * Main CVRP optimization function
 */
export function optimizeRoutes(
  vehicles: Vehicle[],
  pickups: PickupPoint[],
  params: OptimizationParams = {}
): {
  routes: OptimizedRoute[];
  unassigned: PickupPoint[];
} {
  const {
    max_route_length = 100,
    priority_weight = 0.3,
    average_speed = 40
  } = params;
  
  if (vehicles.length === 0 || pickups.length === 0) {
    return { routes: [], unassigned: pickups };
  }
  
  // Sort pickups by priority (descending)
  const sortedPickups = [...pickups].sort((a, b) => b.priority - a.priority);
  
  // Cluster pickups
  const clusters = clusterPickups(sortedPickups, vehicles.length, priority_weight);
  
  const routes: OptimizedRoute[] = [];
  const unassigned: PickupPoint[] = [];
  
  // Assign each cluster to a vehicle
  for (let i = 0; i < Math.min(clusters.length, vehicles.length); i++) {
    const vehicle = vehicles[i];
    const cluster = clusters[i];
    
    // Check capacity constraint
    const totalWeight = cluster.reduce((sum, p) => sum + p.weight, 0);
    
    if (totalWeight > vehicle.capacity) {
      // Sort by priority and take as many as fit
      const fitted: PickupPoint[] = [];
      let currentWeight = 0;
      
      for (const pickup of cluster.sort((a, b) => b.priority - a.priority)) {
        if (currentWeight + pickup.weight <= vehicle.capacity) {
          fitted.push(pickup);
          currentWeight += pickup.weight;
        } else {
          unassigned.push(pickup);
        }
      }
      
      if (fitted.length === 0) continue;
      
      // Optimize route
      let route = nearestNeighborTSP(fitted, vehicle.start_location);
      route = twoOptImprovement(route, vehicle.start_location);
      
      const distance = calculateRouteDistance(route, vehicle.start_location);
      
      if (distance <= max_route_length) {
        routes.push(buildOptimizedRoute(vehicle, route, distance, average_speed));
      } else {
        unassigned.push(...fitted);
      }
    } else {
      // Optimize route
      let route = nearestNeighborTSP(cluster, vehicle.start_location);
      route = twoOptImprovement(route, vehicle.start_location);
      
      const distance = calculateRouteDistance(route, vehicle.start_location);
      
      if (distance <= max_route_length) {
        routes.push(buildOptimizedRoute(vehicle, route, distance, average_speed));
      } else {
        unassigned.push(...cluster);
      }
    }
  }
  
  // Any remaining clusters become unassigned
  for (let i = vehicles.length; i < clusters.length; i++) {
    unassigned.push(...clusters[i]);
  }
  
  return { routes, unassigned };
}

/**
 * Build optimized route object with path and stops
 */
function buildOptimizedRoute(
  vehicle: Vehicle,
  route: PickupPoint[],
  totalDistance: number,
  averageSpeed: number
): OptimizedRoute {
  const path: Coordinate[] = [vehicle.start_location];
  const stops: RouteStop[] = [];
  
  let cumulativeDistance = 0;
  let cumulativeTime = 0; // minutes
  
  for (let i = 0; i < route.length; i++) {
    const pickup = route[i];
    const prevPoint = i === 0 ? vehicle.start_location : route[i - 1];
    const segmentDistance = haversineDistance(prevPoint, pickup);
    
    cumulativeDistance += segmentDistance;
    cumulativeTime += (segmentDistance / averageSpeed) * 60; // Convert to minutes
    
    path.push({ lat: pickup.lat, lng: pickup.lng });
    
    // Add service time (5 minutes per stop)
    cumulativeTime += 5;
    
    const eta = new Date(Date.now() + cumulativeTime * 60 * 1000).toISOString();
    
    stops.push({
      pickup_id: pickup.id,
      seq: i + 1,
      eta,
      distance_from_prev: segmentDistance
    });
  }
  
  // Return to start
  path.push(vehicle.start_location);
  
  const totalWeight = route.reduce((sum, p) => sum + p.weight, 0);
  
  return {
    driver_id: vehicle.id,
    path,
    stops,
    total_distance: totalDistance,
    estimated_duration: cumulativeTime,
    total_weight: totalWeight
  };
}
