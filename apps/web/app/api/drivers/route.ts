import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { query } from '@/lib/db';

/**
 * GET /api/drivers
 * List all drivers with their current status and location
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

    // Only coordinators and drivers can view driver list
    if (user.role === 'citizen') {
      return NextResponse.json(
        { error: 'Forbidden', message: 'Access denied' },
        { status: 403 }
      );
    }

    // Get all drivers with user info
    const result = await query(
      `SELECT d.*, u.full_name, u.email, u.phone 
       FROM drivers d
       JOIN users u ON d.user_id = u.id
       ORDER BY d.status, u.full_name`
    );

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error('Error fetching drivers:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to fetch drivers' },
      { status: 500 }
    );
  }
}
