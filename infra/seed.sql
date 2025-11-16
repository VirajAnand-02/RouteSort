-- Seed data for development
-- This file contains sample data for local development and testing

-- Sample users (Note: clerk_id values are placeholders, use real Clerk IDs in production)
INSERT INTO users (clerk_id, email, role, full_name, phone, points_balance) VALUES
('user_test_citizen1', 'john.doe@example.com', 'citizen', 'John Doe', '+1-555-0101', 150),
('user_test_citizen2', 'jane.smith@example.com', 'citizen', 'Jane Smith', '+1-555-0102', 200),
('user_test_driver1', 'mike.wilson@example.com', 'driver', 'Mike Wilson', '+1-555-0201', 0),
('user_test_driver2', 'sarah.johnson@example.com', 'driver', 'Sarah Johnson', '+1-555-0202', 0),
('user_test_coord1', 'admin@routesort.com', 'coordinator', 'Admin User', '+1-555-0301', 0)
ON CONFLICT (clerk_id) DO NOTHING;

-- Sample drivers
INSERT INTO drivers (user_id, vehicle_number, vehicle_type, capacity_kg, status, current_latitude, current_longitude)
SELECT id, 'TRK-001', 'compactor', 5000, 'available', 40.7580, -73.9855
FROM users WHERE email = 'mike.wilson@example.com'
UNION ALL
SELECT id, 'TRK-002', 'pickup', 3000, 'available', 40.7489, -73.9680
FROM users WHERE email = 'sarah.johnson@example.com'
ON CONFLICT DO NOTHING;

-- Sample pickup requests
INSERT INTO pickup_requests (user_id, address, latitude, longitude, waste_type, description, scheduled_date, time_slot, status, weight_estimate, priority)
SELECT 
  u.id,
  '123 Main St, New York, NY 10001',
  40.7506,
  -73.9934,
  'recyclable',
  'Mixed recyclables - plastic and glass',
  CURRENT_DATE + INTERVAL '2 days',
  'morning',
  'pending',
  15,
  5
FROM users u WHERE u.email = 'john.doe@example.com'
UNION ALL
SELECT 
  u.id,
  '456 Oak Ave, Brooklyn, NY 11201',
  40.6982,
  -73.9442,
  'organic',
  'Yard waste and compost',
  CURRENT_DATE + INTERVAL '3 days',
  'afternoon',
  'pending',
  25,
  3
FROM users u WHERE u.email = 'jane.smith@example.com'
UNION ALL
SELECT 
  u.id,
  '789 Pine St, Queens, NY 11101',
  40.7614,
  -73.9246,
  'bulky',
  'Old furniture - couch and table',
  CURRENT_DATE + INTERVAL '5 days',
  'morning',
  'pending',
  100,
  7
FROM users u WHERE u.email = 'john.doe@example.com'
UNION ALL
SELECT 
  u.id,
  '321 Elm Dr, Bronx, NY 10451',
  40.8209,
  -73.9249,
  'general',
  'Regular household waste',
  CURRENT_DATE + INTERVAL '1 day',
  'evening',
  'scheduled',
  20,
  5
FROM users u WHERE u.email = 'jane.smith@example.com';

-- Sample rewards
INSERT INTO rewards (user_id, amount, description, redeemed_at)
SELECT id, 50, 'Signup bonus', NULL FROM users WHERE email = 'john.doe@example.com'
UNION ALL
SELECT id, 100, 'Perfect recycling score', NULL FROM users WHERE email = 'john.doe@example.com'
UNION ALL
SELECT id, 50, 'Signup bonus', NULL FROM users WHERE email = 'jane.smith@example.com'
UNION ALL
SELECT id, 150, 'Monthly recycling champion', NULL FROM users WHERE email = 'jane.smith@example.com';

-- Sample audit logs
INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details)
SELECT id, 'CREATE', 'pickup_request', 1, '{"status": "pending"}'::jsonb FROM users WHERE email = 'john.doe@example.com'
UNION ALL
SELECT id, 'UPDATE', 'pickup_request', 4, '{"status": "scheduled"}'::jsonb FROM users WHERE email = 'jane.smith@example.com';

COMMIT;

-- Print summary
DO $$
DECLARE
  user_count INTEGER;
  driver_count INTEGER;
  pickup_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO user_count FROM users;
  SELECT COUNT(*) INTO driver_count FROM drivers;
  SELECT COUNT(*) INTO pickup_count FROM pickup_requests;
  
  RAISE NOTICE 'Seed data loaded successfully!';
  RAISE NOTICE 'Users: %', user_count;
  RAISE NOTICE 'Drivers: %', driver_count;
  RAISE NOTICE 'Pickup requests: %', pickup_count;
END $$;
