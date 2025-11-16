# RouteSort - Development Checklist

## Quick Start Checklist

### Prerequisites
- [ ] Node.js 18+ installed
- [ ] PostgreSQL 14+ installed (or use Docker)
- [ ] Redis 7+ installed (or use Docker)
- [ ] Clerk account created
- [ ] Git installed

### Initial Setup (5-10 minutes)

1. **Clone and Install**
   ```bash
   git clone https://github.com/VirajAnand-02/RouteSort.git
   cd RouteSort
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials:
   # - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
   # - CLERK_SECRET_KEY
   # - DATABASE_URL
   # - REDIS_URL (optional for image classification)
   ```

3. **Start Infrastructure**
   ```bash
   # Option A: Using Docker (Recommended)
   make docker-up
   
   # Option B: Using existing services
   # Make sure PostgreSQL and Redis are running
   ```

4. **Database Setup**
   ```bash
   make migrate  # Run schema.sql
   make seed     # Load sample data
   ```

5. **Start Development Server**
   ```bash
   make dev
   # or
   npm run dev
   ```

6. **Open Browser**
   - Navigate to http://localhost:3000
   - You should see the RouteSort landing page

### Verification Steps

- [ ] Landing page loads successfully
- [ ] Can navigate to /citizen, /driver, and /coordinator portals
- [ ] Clerk authentication works (if configured)
- [ ] Map components load on schedule pickup page
- [ ] No console errors in browser

## Development Workflow

### Daily Development

```bash
# Start all services
make setup              # First time only
make dev                # Start dev server

# Make changes...

# Test your changes
make lint               # Check code style
make build              # Verify build works
make test               # Run tests (if available)

# Commit
git add .
git commit -m "Description of changes"
git push
```

### Working with the Database

```bash
# View database
psql $DATABASE_URL

# Run migrations
make migrate

# Reset and reseed
psql $DATABASE_URL -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
make migrate
make seed

# Backup database
pg_dump $DATABASE_URL > backup.sql
```

### Working with Docker

```bash
# Start services
make docker-up

# View logs
make docker-logs

# Stop services
make docker-down

# Clean restart
make docker-down
make docker-up
make migrate
make seed
```

### Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
cd services/backend
npx vitest

# Run specific test
npx vitest services/cvrp.test.ts
```

### Building for Production

```bash
# Build all workspaces
make build

# Build specific workspace
npm run build --workspace=apps/web

# Start production server (local)
npm run start --workspace=apps/web
```

## Troubleshooting

### Build Errors

**Issue**: `Cannot find module 'next'`
```bash
# Solution: Install from root
cd /path/to/RouteSort
npm install
```

**Issue**: Turbopack workspace errors
```bash
# Solution: Build with proper env vars
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_mock \
CLERK_SECRET_KEY=sk_test_mock \
DATABASE_URL=postgresql://mock:mock@localhost:5432/mock \
npm run build --workspace=apps/web
```

**Issue**: TypeScript errors about async params
```bash
# This is fixed in the latest version
# Make sure you're using Next.js 16+ compatible param handling
```

### Database Errors

**Issue**: Connection refused
```bash
# Check if PostgreSQL is running
pg_isready

# Check your DATABASE_URL in .env
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL
```

**Issue**: Schema errors
```bash
# Reset database
psql $DATABASE_URL -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
make migrate
```

### Docker Errors

**Issue**: Port already in use
```bash
# Find what's using the port
lsof -i :5432
lsof -i :6379

# Kill the process or change ports in docker-compose.yml
```

**Issue**: Docker not running
```bash
# Start Docker daemon
sudo systemctl start docker  # Linux
# Or start Docker Desktop app # Mac/Windows
```

### Clerk Authentication Errors

**Issue**: Invalid publishable key
```bash
# Get your keys from https://dashboard.clerk.com
# Make sure you're using the correct environment (test/production)
# Update .env with correct keys
```

**Issue**: Build fails with Clerk error
```bash
# For builds without real Clerk keys, the app will work without auth
# The layout.tsx checks for valid keys and disables Clerk if not found
```

### Map Component Errors

**Issue**: Map not loading
```bash
# Check browser console for errors
# Common issues:
# 1. Leaflet CSS not loaded (check <head> in layout.tsx)
# 2. SSR hydration error (use DynamicMap, not MapContainer directly)
# 3. Invalid coordinates
```

**Issue**: Markers not showing
```bash
# Verify marker data structure:
# { id: string|number, position: [lat, lng], title?: string }
```

## Feature Development Guide

### Adding a New API Endpoint

1. **Create route file**
   ```bash
   # For /api/new-endpoint
   touch apps/web/app/api/new-endpoint/route.ts
   ```

2. **Implement handler**
   ```typescript
   import { NextRequest, NextResponse } from 'next/server';
   import { auth } from '@clerk/nextjs/server';
   import { query } from '@/lib/db';
   
   export async function GET(request: NextRequest) {
     const { userId } = await auth();
     if (!userId) {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
     }
     
     // Your logic here
     const result = await query('SELECT * FROM table');
     return NextResponse.json(result.rows);
   }
   ```

3. **Add to OpenAPI spec**
   - Edit `openapi.yaml`
   - Add path, parameters, responses

4. **Test endpoint**
   ```bash
   curl -X GET http://localhost:3000/api/new-endpoint \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

### Adding a Database Table

1. **Update schema.sql**
   ```sql
   CREATE TABLE IF NOT EXISTS new_table (
     id SERIAL PRIMARY KEY,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

2. **Add indexes**
   ```sql
   CREATE INDEX idx_new_table_field ON new_table(field);
   ```

3. **Update seed.sql** (if needed)

4. **Run migration**
   ```bash
   make migrate
   ```

### Adding a Map to a Page

```typescript
'use client';

import { DynamicMap } from '@/components/map';
import { useState } from 'react';

export default function MyPage() {
  const [markers, setMarkers] = useState([
    { id: 1, position: [40.7128, -74.0060], title: 'NYC' }
  ]);
  
  return (
    <DynamicMap
      center={[40.7128, -74.0060]}
      zoom={13}
      markers={markers}
      onMarkerClick={(marker) => console.log(marker)}
    />
  );
}
```

## API Usage Examples

### Create a Pickup

```bash
curl -X POST http://localhost:3000/api/pickups \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "address": "123 Main St",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "waste_type": "recyclable",
    "scheduled_date": "2024-01-20",
    "time_slot": "morning"
  }'
```

### Optimize Routes

```bash
curl -X POST http://localhost:3000/api/routes/optimize \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "driver_ids": [1, 2],
    "pickup_ids": [1, 2, 3, 4, 5],
    "max_route_length": 50
  }'
```

### Classify Image

```bash
curl -X POST http://localhost:3000/api/images/classify \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@photo.jpg"
```

## Performance Tips

1. **Database**
   - Use indexes for frequently queried fields
   - Limit query results with LIMIT
   - Use connection pooling (pg.Pool)

2. **Next.js**
   - Use dynamic imports for heavy components
   - Enable caching where appropriate
   - Optimize images with next/image

3. **Maps**
   - Limit number of markers rendered
   - Use marker clustering for large datasets
   - Debounce map interactions

## Security Checklist

- [ ] All API routes have authentication
- [ ] Input validation on all endpoints
- [ ] SQL queries use parameterized statements
- [ ] File uploads are validated (type, size)
- [ ] Sensitive data not logged
- [ ] Environment variables not committed
- [ ] HTTPS in production
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Dependencies updated regularly

## Deployment Checklist

### Pre-Deployment

- [ ] All tests passing
- [ ] Build succeeds without errors
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] No console.log in production code
- [ ] Error handling comprehensive
- [ ] Security review completed

### Vercel Deployment

1. Connect GitHub repository
2. Configure environment variables
3. Set up PostgreSQL (Supabase/Neon/etc.)
4. Set up Redis (Upstash)
5. Deploy
6. Verify all features work
7. Set up monitoring (Sentry)

### Post-Deployment

- [ ] Test all critical paths
- [ ] Verify authentication works
- [ ] Check database connections
- [ ] Monitor error rates
- [ ] Set up alerts
- [ ] Document any issues

## Support

- Documentation: README.md
- API Spec: openapi.yaml
- Issues: GitHub Issues
- Architecture: See README.md Architecture section

## Useful Commands Reference

```bash
# Development
make dev                 # Start dev server
make build              # Build all workspaces
make test               # Run tests
make lint               # Lint code

# Database
make migrate            # Run migrations
make seed               # Seed database

# Docker
make docker-up          # Start services
make docker-down        # Stop services
make docker-logs        # View logs

# Utilities
make clean              # Clean build artifacts
make setup              # Complete setup
```

## Next Steps

After completing setup:

1. Explore the codebase
2. Try creating a pickup request
3. Test the route optimization
4. Customize the UI
5. Add your own features
6. Deploy to production

Happy coding! 🚀
