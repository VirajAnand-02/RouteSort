import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { query } from '@/lib/db';

/**
 * POST /api/drivers/[id]/location
 * Update driver's current location
 * 
 * Body:
 * - latitude: number (required)
 * - longitude: number (required)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const driverId = parseInt(id);

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

    // Get driver record
    const driverResult = await query(
      'SELECT * FROM drivers WHERE id = $1',
      [driverId]
    );
    const driver = driverResult.rows[0];

    if (!driver) {
      return NextResponse.json(
        { error: 'Not Found', message: 'Driver not found' },
        { status: 404 }
      );
    }

    // Only the driver themselves or coordinators can update location
    if (user.role !== 'coordinator' && driver.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden', message: 'Access denied' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { latitude, longitude } = body;

    // Validate required fields
    if (latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Missing required fields: latitude, longitude' },
        { status: 400 }
      );
    }

    // Validate coordinates
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Invalid coordinates' },
        { status: 400 }
      );
    }

    // Update driver location
    const result = await query(
      `UPDATE drivers 
       SET current_latitude = $1, current_longitude = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [latitude, longitude, driverId]
    );

    const updatedDriver = result.rows[0];

    // Log the location update
    await query(
      `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details)
       VALUES ($1, 'UPDATE_LOCATION', 'driver', $2, $3)`,
      [user.id, driverId, JSON.stringify({ latitude, longitude })]
    );

    return NextResponse.json(
      { success: true, driver: updatedDriver },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating driver location:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to update location' },
      { status: 500 }
    );
  }
}
