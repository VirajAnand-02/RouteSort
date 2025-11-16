/**
 * Tests for CVRP routing algorithm
 */

import { describe, it, expect } from 'vitest';
import {
  haversineDistance,
  clusterPickups,
  nearestNeighborTSP,
  twoOptImprovement,
  calculateRouteDistance,
  optimizeRoutes,
  PickupPoint,
  Vehicle,
  Coordinate
} from './cvrp';

describe('CVRP Routing Algorithm', () => {
  describe('haversineDistance', () => {
    it('should calculate distance between two points', () => {
      const coord1 = { lat: 40.7128, lng: -74.0060 }; // NYC
      const coord2 = { lat: 40.7580, lng: -73.9855 }; // Times Square
      
      const distance = haversineDistance(coord1, coord2);
      
      // Should be approximately 5-6 km
      expect(distance).toBeGreaterThan(4);
      expect(distance).toBeLessThan(7);
    });
    
    it('should return 0 for same coordinates', () => {
      const coord = { lat: 40.7128, lng: -74.0060 };
      
      expect(haversineDistance(coord, coord)).toBe(0);
    });
  });
  
  describe('clusterPickups', () => {
    it('should cluster pickups into groups', () => {
      const pickups: PickupPoint[] = [
        { id: 1, lat: 40.7128, lng: -74.0060, weight: 10, priority: 5 },
        { id: 2, lat: 40.7129, lng: -74.0061, weight: 15, priority: 5 },
        { id: 3, lat: 40.7580, lng: -73.9855, weight: 20, priority: 5 },
        { id: 4, lat: 40.7581, lng: -73.9856, weight: 25, priority: 5 },
      ];
      
      const clusters = clusterPickups(pickups, 2);
      
      expect(clusters.length).toBe(2);
      expect(clusters[0].length + clusters[1].length).toBe(4);
    });
    
    it('should return individual clusters if pickups <= numClusters', () => {
      const pickups: PickupPoint[] = [
        { id: 1, lat: 40.7128, lng: -74.0060, weight: 10, priority: 5 },
        { id: 2, lat: 40.7129, lng: -74.0061, weight: 15, priority: 5 },
      ];
      
      const clusters = clusterPickups(pickups, 3);
      
      expect(clusters.length).toBe(2);
      expect(clusters[0].length).toBe(1);
      expect(clusters[1].length).toBe(1);
    });
  });
  
  describe('nearestNeighborTSP', () => {
    it('should create a route visiting all pickups', () => {
      const start: Coordinate = { lat: 40.7128, lng: -74.0060 };
      const pickups: PickupPoint[] = [
        { id: 1, lat: 40.7129, lng: -74.0061, weight: 10, priority: 5 },
        { id: 2, lat: 40.7130, lng: -74.0062, weight: 15, priority: 5 },
        { id: 3, lat: 40.7131, lng: -74.0063, weight: 20, priority: 5 },
      ];
      
      const route = nearestNeighborTSP(pickups, start);
      
      expect(route.length).toBe(3);
      expect(route.map(p => p.id).sort()).toEqual([1, 2, 3]);
    });
    
    it('should return empty array for no pickups', () => {
      const start: Coordinate = { lat: 40.7128, lng: -74.0060 };
      const route = nearestNeighborTSP([], start);
      
      expect(route).toEqual([]);
    });
  });
  
  describe('calculateRouteDistance', () => {
    it('should calculate total route distance', () => {
      const start: Coordinate = { lat: 40.7128, lng: -74.0060 };
      const route: PickupPoint[] = [
        { id: 1, lat: 40.7129, lng: -74.0061, weight: 10, priority: 5 },
        { id: 2, lat: 40.7130, lng: -74.0062, weight: 15, priority: 5 },
      ];
      
      const distance = calculateRouteDistance(route, start);
      
      expect(distance).toBeGreaterThan(0);
    });
    
    it('should return 0 for empty route', () => {
      const start: Coordinate = { lat: 40.7128, lng: -74.0060 };
      
      expect(calculateRouteDistance([], start)).toBe(0);
    });
  });
  
  describe('optimizeRoutes', () => {
    it('should optimize routes for multiple vehicles', () => {
      const vehicles: Vehicle[] = [
        {
          id: 1,
          capacity: 100,
          start_location: { lat: 40.7128, lng: -74.0060 }
        },
        {
          id: 2,
          capacity: 100,
          start_location: { lat: 40.7580, lng: -73.9855 }
        }
      ];
      
      const pickups: PickupPoint[] = [
        { id: 1, lat: 40.7129, lng: -74.0061, weight: 10, priority: 5 },
        { id: 2, lat: 40.7130, lng: -74.0062, weight: 15, priority: 7 },
        { id: 3, lat: 40.7581, lng: -73.9856, weight: 20, priority: 5 },
        { id: 4, lat: 40.7582, lng: -73.9857, weight: 25, priority: 3 },
      ];
      
      const result = optimizeRoutes(vehicles, pickups);
      
      expect(result.routes.length).toBeGreaterThan(0);
      expect(result.routes.length).toBeLessThanOrEqual(2);
      
      // All routes should have valid structure
      result.routes.forEach(route => {
        expect(route.driver_id).toBeDefined();
        expect(route.path.length).toBeGreaterThan(0);
        expect(route.stops.length).toBeGreaterThan(0);
        expect(route.total_distance).toBeGreaterThan(0);
      });
    });
    
    it('should respect vehicle capacity constraints', () => {
      const vehicles: Vehicle[] = [
        {
          id: 1,
          capacity: 30, // Can only fit 2-3 pickups
          start_location: { lat: 40.7128, lng: -74.0060 }
        }
      ];
      
      const pickups: PickupPoint[] = [
        { id: 1, lat: 40.7129, lng: -74.0061, weight: 15, priority: 5 },
        { id: 2, lat: 40.7130, lng: -74.0062, weight: 15, priority: 5 },
        { id: 3, lat: 40.7131, lng: -74.0063, weight: 15, priority: 5 },
      ];
      
      const result = optimizeRoutes(vehicles, pickups);
      
      // Should assign only pickups that fit
      if (result.routes.length > 0) {
        const route = result.routes[0];
        expect(route.total_weight).toBeLessThanOrEqual(30);
      }
      
      // Some pickups might be unassigned
      const totalAssigned = result.routes.reduce((sum, r) => sum + r.stops.length, 0);
      const totalUnassigned = result.unassigned.length;
      
      expect(totalAssigned + totalUnassigned).toBe(3);
    });
    
    it('should return unassigned pickups when no vehicles available', () => {
      const vehicles: Vehicle[] = [];
      const pickups: PickupPoint[] = [
        { id: 1, lat: 40.7129, lng: -74.0061, weight: 10, priority: 5 },
      ];
      
      const result = optimizeRoutes(vehicles, pickups);
      
      expect(result.routes).toEqual([]);
      expect(result.unassigned.length).toBe(1);
    });
    
    it('should prioritize high-priority pickups', () => {
      const vehicles: Vehicle[] = [
        {
          id: 1,
          capacity: 20,
          start_location: { lat: 40.7128, lng: -74.0060 }
        }
      ];
      
      const pickups: PickupPoint[] = [
        { id: 1, lat: 40.7129, lng: -74.0061, weight: 15, priority: 2 },
        { id: 2, lat: 40.7130, lng: -74.0062, weight: 15, priority: 10 },
      ];
      
      const result = optimizeRoutes(vehicles, pickups);
      
      // High priority pickup should be assigned
      if (result.routes.length > 0) {
        const assignedIds = result.routes[0].stops.map(s => s.pickup_id);
        expect(assignedIds).toContain(2); // High priority pickup
      }
    });
  });
});
