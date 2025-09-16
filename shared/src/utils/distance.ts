import { LocationCoordinates } from '../types';

/**
 * Calculate the distance between two points using the Haversine formula
 * @param point1 First coordinate point
 * @param point2 Second coordinate point
 * @returns Distance in kilometers
 */
export const calculateDistance = (
  point1: LocationCoordinates,
  point2: LocationCoordinates
): number => {
  const R = 6371; // Earth's radius in kilometers
  
  const lat1Rad = toRadians(point1.latitude);
  const lat2Rad = toRadians(point2.latitude);
  const deltaLat = toRadians(point2.latitude - point1.latitude);
  const deltaLng = toRadians(point2.longitude - point1.longitude);
  
  const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) *
    Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c;
};

/**
 * Convert degrees to radians
 */
const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * Check if a point is within a certain radius of another point
 */
export const isWithinRadius = (
  center: LocationCoordinates,
  point: LocationCoordinates,
  radiusKm: number
): boolean => {
  return calculateDistance(center, point) <= radiusKm;
};

/**
 * Find the center point of multiple coordinates
 */
export const getCenterPoint = (coordinates: LocationCoordinates[]): LocationCoordinates => {
  if (coordinates.length === 0) {
    throw new Error('Cannot calculate center of empty coordinates array');
  }
  
  const totalLat = coordinates.reduce((sum, coord) => sum + coord.latitude, 0);
  const totalLng = coordinates.reduce((sum, coord) => sum + coord.longitude, 0);
  
  return {
    latitude: totalLat / coordinates.length,
    longitude: totalLng / coordinates.length
  };
};

/**
 * Generate a bounding box for a given center point and radius
 */
export const getBoundingBox = (
  center: LocationCoordinates,
  radiusKm: number
): {
  north: number;
  south: number;
  east: number;
  west: number;
} => {
  // Approximate conversion (good enough for most use cases)
  const latDelta = radiusKm / 111.32; // 1 degree latitude ≈ 111.32 km
  const lngDelta = radiusKm / (111.32 * Math.cos(toRadians(center.latitude)));
  
  return {
    north: center.latitude + latDelta,
    south: center.latitude - latDelta,
    east: center.longitude + lngDelta,
    west: center.longitude - lngDelta
  };
};