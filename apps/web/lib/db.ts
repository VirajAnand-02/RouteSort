import { Pool } from 'pg';

// Database connection configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Database query helper
export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Get user by Clerk ID
export const getUserByClerkId = async (clerkId: string) => {
  const result = await query(
    'SELECT * FROM users WHERE clerk_id = $1',
    [clerkId]
  );
  return result.rows[0];
};

// Create or update user
export const upsertUser = async (clerkId: string, email: string, role: string, fullName?: string) => {
  const result = await query(
    `INSERT INTO users (clerk_id, email, role, full_name)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (clerk_id)
     DO UPDATE SET email = $2, full_name = $4, updated_at = CURRENT_TIMESTAMP
     RETURNING *`,
    [clerkId, email, role, fullName]
  );
  return result.rows[0];
};

// Pickup requests
export const createPickupRequest = async (data: {
  userId: number;
  address: string;
  latitude: number;
  longitude: number;
  wasteType: string;
  description?: string;
  photoUrl?: string;
  scheduledDate?: string;
  timeSlot?: string;
}) => {
  const result = await query(
    `INSERT INTO pickup_requests 
     (user_id, address, latitude, longitude, waste_type, description, photo_url, scheduled_date, time_slot)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [
      data.userId,
      data.address,
      data.latitude,
      data.longitude,
      data.wasteType,
      data.description,
      data.photoUrl,
      data.scheduledDate,
      data.timeSlot,
    ]
  );
  return result.rows[0];
};

export const getPickupRequestsByUser = async (userId: number) => {
  const result = await query(
    'SELECT * FROM pickup_requests WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return result.rows;
};

export const getAllPickupRequests = async (status?: string) => {
  const queryText = status
    ? 'SELECT * FROM pickup_requests WHERE status = $1 ORDER BY created_at DESC'
    : 'SELECT * FROM pickup_requests ORDER BY created_at DESC';
  const params = status ? [status] : [];
  const result = await query(queryText, params);
  return result.rows;
};

// Routes
export const createRoute = async (data: {
  driverId: number;
  routeName: string;
  routeDate: string;
  optimizedPath?: any;
}) => {
  const result = await query(
    `INSERT INTO routes (driver_id, route_name, route_date, optimized_path)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [data.driverId, data.routeName, data.routeDate, JSON.stringify(data.optimizedPath)]
  );
  return result.rows[0];
};

export const getRoutesByDriver = async (driverId: number) => {
  const result = await query(
    'SELECT * FROM routes WHERE driver_id = $1 ORDER BY route_date DESC',
    [driverId]
  );
  return result.rows;
};

export const getAllRoutes = async () => {
  const result = await query(
    'SELECT r.*, d.vehicle_number, u.full_name as driver_name FROM routes r LEFT JOIN drivers d ON r.driver_id = d.id LEFT JOIN users u ON d.user_id = u.id ORDER BY r.route_date DESC'
  );
  return result.rows;
};

// Route stops
export const createRouteStop = async (data: {
  routeId: number;
  pickupRequestId: number;
  stopOrder: number;
  estimatedArrival?: string;
}) => {
  const result = await query(
    `INSERT INTO route_stops (route_id, pickup_request_id, stop_order, estimated_arrival)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [data.routeId, data.pickupRequestId, data.stopOrder, data.estimatedArrival]
  );
  return result.rows[0];
};

export const getRouteStops = async (routeId: number) => {
  const result = await query(
    `SELECT rs.*, pr.address, pr.latitude, pr.longitude, pr.waste_type
     FROM route_stops rs
     JOIN pickup_requests pr ON rs.pickup_request_id = pr.id
     WHERE rs.route_id = $1
     ORDER BY rs.stop_order`,
    [routeId]
  );
  return result.rows;
};

export const updateRouteStopStatus = async (stopId: number, status: string, actualArrival?: string) => {
  const result = await query(
    'UPDATE route_stops SET status = $1, actual_arrival = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
    [status, actualArrival, stopId]
  );
  return result.rows[0];
};

// Recycling guides
export const searchRecyclingGuides = async (searchTerm: string) => {
  const result = await query(
    'SELECT * FROM recycling_guides WHERE item_name ILIKE $1 OR category ILIKE $1',
    [`%${searchTerm}%`]
  );
  return result.rows;
};

export const getAllRecyclingGuides = async () => {
  const result = await query('SELECT * FROM recycling_guides ORDER BY item_name');
  return result.rows;
};

export default pool;
