import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { query } from '@/lib/db';

/**
 * GET /api/pickups
 * List pickup requests with optional filtering
 * 
 * Query params:
 * - status: Filter by status (pending, scheduled, in_progress, completed, cancelled)
 * - user_id: Filter by user (coordinators only)
 * - limit: Results per page (default 50)
 * - offset: Offset for pagination (default 0)
 */
export async function GET(request: NextRequest) {
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

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const requestedUserId = searchParams.get('user_id');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query based on user role
    let queryText = 'SELECT * FROM pickup_requests';
    const params: any[] = [];
    const conditions: string[] = [];

    // Role-based filtering
    if (user.role === 'citizen') {
      // Citizens can only see their own pickups
      conditions.push(`user_id = $${params.length + 1}`);
      params.push(user.id);
    } else if (user.role === 'driver') {
      // Drivers can see all pending and scheduled pickups
      conditions.push(`status IN ('pending', 'scheduled', 'in_progress')`);
    } else if (user.role === 'coordinator') {
      // Coordinators can see all pickups, optionally filtered by user
      if (requestedUserId) {
        conditions.push(`user_id = $${params.length + 1}`);
        params.push(parseInt(requestedUserId));
      }
    }

    // Status filter
    if (status) {
      conditions.push(`status = $${params.length + 1}`);
      params.push(status);
    }

    // Add conditions to query
    if (conditions.length > 0) {
      queryText += ' WHERE ' + conditions.join(' AND ');
    }

    // Add ordering and pagination
    queryText += ' ORDER BY created_at DESC';
    queryText += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await query(queryText, params);

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error('Error fetching pickups:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to fetch pickups' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/pickups
 * Create a new pickup request
 * 
 * Body:
 * - address: string (required)
 * - latitude: number (required)
 * - longitude: number (required)
 * - waste_type: string (required)
 * - description: string (optional)
 * - photo_url: string (optional)
 * - scheduled_date: string (optional)
 * - time_slot: string (optional)
 * - weight_estimate: number (optional)
 * - priority: number (optional, 1-10)
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

    // Only citizens can create pickup requests
    if (user.role !== 'citizen') {
      return NextResponse.json(
        { error: 'Forbidden', message: 'Only citizens can create pickup requests' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const {
      address,
      latitude,
      longitude,
      waste_type,
      description,
      photo_url,
      scheduled_date,
      time_slot,
      weight_estimate,
      priority
    } = body;

    // Validate required fields
    if (!address || !latitude || !longitude || !waste_type) {
      return NextResponse.json(
        { 
          error: 'Bad Request', 
          message: 'Missing required fields: address, latitude, longitude, waste_type' 
        },
        { status: 400 }
      );
    }

    // Validate waste_type
    const validWasteTypes = ['general', 'recyclable', 'organic', 'bulky', 'hazardous'];
    if (!validWasteTypes.includes(waste_type)) {
      return NextResponse.json(
        { 
          error: 'Bad Request', 
          message: `Invalid waste_type. Must be one of: ${validWasteTypes.join(', ')}` 
        },
        { status: 400 }
      );
    }

    // Validate priority if provided
    if (priority !== undefined && (priority < 1 || priority > 10)) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Priority must be between 1 and 10' },
        { status: 400 }
      );
    }

    // Create pickup request
    const result = await query(
      `INSERT INTO pickup_requests 
       (user_id, address, latitude, longitude, waste_type, description, photo_url, 
        scheduled_date, time_slot, weight_estimate, priority, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'pending')
       RETURNING *`,
      [
        user.id,
        address,
        latitude,
        longitude,
        waste_type,
        description || null,
        photo_url || null,
        scheduled_date || null,
        time_slot || null,
        weight_estimate || null,
        priority || 5
      ]
    );

    const pickup = result.rows[0];

    // Award points to user
    await query(
      'UPDATE users SET points_balance = points_balance + $1 WHERE id = $2',
      [10, user.id] // 10 points for creating a pickup
    );

    // Log the action
    await query(
      `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details)
       VALUES ($1, 'CREATE', 'pickup_request', $2, $3)`,
      [user.id, pickup.id, JSON.stringify({ status: 'pending' })]
    );

    return NextResponse.json(pickup, { status: 201 });
  } catch (error) {
    console.error('Error creating pickup:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to create pickup' },
      { status: 500 }
    );
  }
}
