import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { query } from '@/lib/db';

/**
 * GET /api/images/classify/[job_id]
 * Poll for classification job result
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { job_id: string } }
) {
  try {
    const jobId = params.job_id;

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

    // Get classification job
    const jobResult = await query(
      'SELECT * FROM classification_jobs WHERE id = $1',
      [jobId]
    );

    const job = jobResult.rows[0];

    if (!job) {
      return NextResponse.json(
        { error: 'Not Found', message: 'Job not found' },
        { status: 404 }
      );
    }

    // Only the owner or coordinators can view the job
    if (job.user_id !== user.id && user.role !== 'coordinator') {
      return NextResponse.json(
        { error: 'Forbidden', message: 'Access denied' },
        { status: 403 }
      );
    }

    // Return job status and results
    const response: any = {
      job_id: job.id,
      status: job.status
    };

    if (job.status === 'completed') {
      response.classification = job.classification;
      response.confidence = parseFloat(job.confidence);
      response.category = job.category;
      response.recyclable = job.recyclable;
      response.instructions = job.instructions;
    } else if (job.status === 'failed') {
      response.error_message = job.error_message;
    } else {
      response.message = 'Job is still processing';
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error fetching classification job:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to fetch job' },
      { status: 500 }
    );
  }
}
