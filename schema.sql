-- RouteSort Database Schema

-- Users are managed by Clerk, but we store additional app-specific data
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  clerk_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('citizen', 'driver', 'coordinator')),
  full_name VARCHAR(255),
  phone VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pickup requests from citizens
CREATE TABLE IF NOT EXISTS pickup_requests (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  waste_type VARCHAR(100) NOT NULL,
  description TEXT,
  photo_url TEXT,
  scheduled_date DATE,
  time_slot VARCHAR(50),
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Drivers/Vehicles in the fleet
CREATE TABLE IF NOT EXISTS drivers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  vehicle_number VARCHAR(50) NOT NULL,
  vehicle_type VARCHAR(50),
  capacity_kg INTEGER,
  status VARCHAR(50) DEFAULT 'available' CHECK (status IN ('available', 'on_route', 'offline')),
  current_latitude DECIMAL(10, 8),
  current_longitude DECIMAL(11, 8),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Routes assigned to drivers
CREATE TABLE IF NOT EXISTS routes (
  id SERIAL PRIMARY KEY,
  driver_id INTEGER REFERENCES drivers(id) ON DELETE SET NULL,
  route_name VARCHAR(255),
  route_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  status VARCHAR(50) DEFAULT 'planned' CHECK (status IN ('planned', 'active', 'completed', 'cancelled')),
  total_distance_km DECIMAL(10, 2),
  optimized_path JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stops within a route
CREATE TABLE IF NOT EXISTS route_stops (
  id SERIAL PRIMARY KEY,
  route_id INTEGER REFERENCES routes(id) ON DELETE CASCADE,
  pickup_request_id INTEGER REFERENCES pickup_requests(id) ON DELETE CASCADE,
  stop_order INTEGER NOT NULL,
  estimated_arrival TIME,
  actual_arrival TIME,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'arrived', 'completed', 'skipped')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Recycling guidance
CREATE TABLE IF NOT EXISTS recycling_guides (
  id SERIAL PRIMARY KEY,
  item_name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  recyclable BOOLEAN NOT NULL,
  instructions TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pickup_requests_user ON pickup_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_pickup_requests_status ON pickup_requests(status);
CREATE INDEX IF NOT EXISTS idx_pickup_requests_date ON pickup_requests(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_routes_driver ON routes(driver_id);
CREATE INDEX IF NOT EXISTS idx_routes_date ON routes(route_date);
CREATE INDEX IF NOT EXISTS idx_route_stops_route ON route_stops(route_id);
CREATE INDEX IF NOT EXISTS idx_users_clerk ON users(clerk_id);

-- Insert some sample recycling guides
INSERT INTO recycling_guides (item_name, category, recyclable, instructions) VALUES
('Plastic Bottle', 'Plastic', true, 'Rinse and remove cap before recycling'),
('Glass Jar', 'Glass', true, 'Clean and remove labels'),
('Pizza Box', 'Paper', false, 'Grease-stained boxes cannot be recycled'),
('Aluminum Can', 'Metal', true, 'Rinse before recycling'),
('Styrofoam', 'Plastic', false, 'Not accepted in most recycling programs'),
('Newspaper', 'Paper', true, 'Keep dry and bundle together'),
('Electronics', 'E-Waste', true, 'Take to special e-waste collection center'),
('Food Waste', 'Organic', true, 'Compostable in organic waste bins')
ON CONFLICT DO NOTHING;
