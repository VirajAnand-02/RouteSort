import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { query } from '@/lib/db';
import { randomUUID } from 'crypto';

/**
 * Mock classifier for development
 * In production, replace with actual ML API (OpenAI Vision, Google Cloud Vision, etc.)
 */
async function classifyImage(imageUrl: string): Promise<{
  classification: string;
  confidence: number;
  category: string;
  recyclable: boolean;
  instructions: string;
}> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mock classification based on common patterns
  // In production, this would call an actual ML API
  const mockResults = [
    {
      classification: 'Plastic Bottle #1',
      confidence: 0.92,
      category: 'Plastic',
      recyclable: true,
      instructions: 'Rinse and remove cap before recycling'
    },
    {
      classification: 'Aluminum Can',
      confidence: 0.88,
      category: 'Metal',
      recyclable: true,
      instructions: 'Rinse before recycling'
    },
    {
      classification: 'Glass Jar',
      confidence: 0.85,
      category: 'Glass',
      recyclable: true,
      instructions: 'Clean and remove labels'
    },
    {
      classification: 'Pizza Box (Greasy)',
      confidence: 0.78,
      category: 'Paper',
      recyclable: false,
      instructions: 'Grease-stained boxes cannot be recycled'
    },
    {
      classification: 'Styrofoam Container',
      confidence: 0.81,
      category: 'Plastic',
      recyclable: false,
      instructions: 'Not accepted in most recycling programs'
    }
  ];

  // Return random result for demo
  return mockResults[Math.floor(Math.random() * mockResults.length)];
}

/**
 * POST /api/images/classify
 * Upload and classify an image for recycling guidance
 * Returns job_id immediately for async processing
 * 
 * Body (multipart/form-data):
 * - image: File (required)
 * - user_id: number (optional, auto-detected from auth)
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

    // Parse multipart form data
    const formData = await request.formData();
    const image = formData.get('image') as File;

    if (!image) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Image file is required' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!image.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'File must be an image' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    if (image.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Bad Request', message: 'Image size must be less than 10MB' },
        { status: 400 }
      );
    }

    // Generate job ID
    const jobId = randomUUID();

    // In production, upload image to storage (Supabase, S3, etc.)
    // For now, use a mock URL
    const imageUrl = `https://storage.example.com/uploads/${jobId}/${image.name}`;

    // Create classification job
    await query(
      `INSERT INTO classification_jobs 
       (id, user_id, image_url, status)
       VALUES ($1, $2, $3, 'pending')`,
      [jobId, user.id, imageUrl]
    );

    // Process classification asynchronously
    // In production, this would be pushed to a job queue (Redis, Bull, etc.)
    processClassificationJob(jobId, imageUrl).catch(err => 
      console.error('Classification job failed:', err)
    );

    return NextResponse.json(
      {
        job_id: jobId,
        classification: 'Processing...',
        confidence: 0,
        category: '',
        recyclable: false,
        instructions: 'Image is being processed. Poll this job_id for results.'
      },
      { status: 202 } // 202 Accepted
    );
  } catch (error) {
    console.error('Error classifying image:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to classify image' },
      { status: 500 }
    );
  }
}

/**
 * Background job to process image classification
 */
async function processClassificationJob(jobId: string, imageUrl: string) {
  try {
    // Update status to processing
    await query(
      `UPDATE classification_jobs 
       SET status = 'processing', updated_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [jobId]
    );

    // Call classification API
    const result = await classifyImage(imageUrl);

    // Update job with results
    await query(
      `UPDATE classification_jobs 
       SET status = 'completed',
           classification = $1,
           confidence = $2,
           category = $3,
           recyclable = $4,
           instructions = $5,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $6`,
      [
        result.classification,
        result.confidence,
        result.category,
        result.recyclable,
        result.instructions,
        jobId
      ]
    );

    console.log(`Classification job ${jobId} completed successfully`);
  } catch (error) {
    console.error(`Classification job ${jobId} failed:`, error);
    
    // Update job with error
    await query(
      `UPDATE classification_jobs 
       SET status = 'failed',
           error_message = $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2`,
      [String(error), jobId]
    );
  }
}
