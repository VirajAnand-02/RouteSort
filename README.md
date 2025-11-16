# RouteSort

A production-ready smart waste pickup system that optimizes collection routes and provides real-time fleet management. Built with Next.js, TypeScript, PostgreSQL, and advanced routing algorithms.

## 🚀 Features

### Citizen App
- **Schedule Pickups**: Easily schedule waste collection at your convenience
- **AI-Powered Recycling Guidance**: Upload photos to get instant recycling classification and instructions
- **Points & Rewards**: Earn points for eco-friendly behavior and redeem rewards
- **Track Status**: Monitor your pickup requests in real-time
- **Interactive Maps**: View pickup locations on OpenStreetMap

### Driver App
- **Optimized Routes**: Follow AI-optimized collection routes on interactive maps
- **Real-time Location**: Share location updates with coordinators
- **Turn-by-Turn Guidance**: Get directions to each stop
- **Stop Confirmation**: Mark pickups as completed with notes and photos
- **Route Updates**: Receive route changes and new assignments in real-time

### Coordinator Dashboard
- **Fleet Management**: Monitor and manage all vehicles in real-time
- **Request Management**: Review and assign pickup requests
- **CVRP Route Optimization**: Create and optimize collection routes using advanced algorithms
- **Analytics & KPIs**: Track performance metrics and efficiency
- **Real-time Telemetry**: Monitor fleet capacity and driver status

## 🏗️ Architecture

### Monorepo Structure
```
RouteSort/
├── apps/
│   └── web/              # Next.js application
│       ├── app/          # Next.js App Router
│       │   ├── api/      # API routes
│       │   ├── citizen/  # Citizen portal
│       │   ├── driver/   # Driver portal
│       │   └── coordinator/ # Coordinator dashboard
│       ├── components/   # Reusable components
│       └── lib/          # Utilities
├── packages/
│   └── shared/           # Shared types and utilities
│       └── types/        # TypeScript interfaces
├── services/
│   └── backend/          # Backend services
│       └── services/     # CVRP algorithm, classifiers
├── infra/                # Infrastructure config
│   ├── docker-compose.yml
│   └── seed.sql
├── .github/
│   └── workflows/        # CI/CD pipelines
├── openapi.yaml          # API specification
├── schema.sql            # Database schema
└── Makefile              # Development commands
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 14+ (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Clerk
- **Maps**: OpenStreetMap with Leaflet (react-leaflet)
- **Database**: PostgreSQL with PostGIS capabilities
- **Caching/Queue**: Redis for async jobs
- **Storage**: Supabase Storage or S3-compatible (MinIO for local dev)
- **Routing Algorithm**: Custom CVRP implementation (Greedy + 2-opt)
- **Image Classification**: Pluggable ML API (OpenAI Vision, Google Cloud Vision, Azure)
- **Testing**: Vitest
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel-ready

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Redis 7+ (for job queue)
- Clerk account for authentication
- (Optional) Docker for local infrastructure

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/VirajAnand-02/RouteSort.git
cd RouteSort
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
# Edit .env with your credentials
```

Required environment variables:
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/routesort

# Redis (for job queue)
REDIS_URL=redis://localhost:6379

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Start Infrastructure (Docker)

```bash
make docker-up
# or
docker-compose -f infra/docker-compose.yml up -d
```

This starts PostgreSQL, Redis, and MinIO for local development.

### 4. Database Setup

```bash
# Run migrations
make migrate

# Seed with sample data
make seed
```

Alternatively:
```bash
psql $DATABASE_URL -f schema.sql
psql $DATABASE_URL -f infra/seed.sql
```

### 5. Start Development Server

```bash
make dev
# or
npm run dev
```

Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Development Guide

### Common Commands

```bash
# Start all services
make setup              # Complete setup (install, docker, migrate, seed)

# Development
make dev                # Start dev server
make build              # Build all workspaces
make test               # Run all tests
make lint               # Run linter

# Database
make migrate            # Run database migrations
make seed               # Seed database with sample data

# Docker
make docker-up          # Start Docker services
make docker-down        # Stop Docker services
make docker-logs        # View Docker logs

# Cleanup
make clean              # Remove build artifacts and node_modules
```

### Project Structure

#### API Routes (`apps/web/app/api/`)

- `POST /api/auth/login` - Authenticate with Clerk
- `GET /api/pickups` - List pickup requests (role-based filtering)
- `POST /api/pickups` - Create pickup request (citizens only)
- `GET /api/drivers` - List drivers (coordinators/drivers only)
- `POST /api/drivers/:id/location` - Update driver location
- `POST /api/routes/optimize` - Optimize routes using CVRP (coordinators only)
- `POST /api/images/classify` - Upload image for classification (async)
- `GET /api/images/classify/:job_id` - Poll classification result

Full API documentation available in [`openapi.yaml`](./openapi.yaml)

#### Database Schema

Core tables:
- `users` - User accounts with roles and points
- `pickup_requests` - Waste collection requests
- `drivers` - Driver/vehicle information
- `routes` - Optimized collection routes
- `route_stops` - Individual stops within routes
- `recycling_guides` - Recycling information database
- `rewards` - Points and rewards tracking
- `audit_logs` - Activity logging with photos
- `classification_jobs` - Async image classification jobs

See [`schema.sql`](./schema.sql) for complete schema.

#### CVRP Algorithm

Location: `services/backend/services/cvrp.ts`

The Capacitated Vehicle Routing Problem (CVRP) solver implements:
1. **Clustering**: K-means clustering of pickups by proximity and priority
2. **Assignment**: Assign clusters to vehicles respecting capacity constraints
3. **TSP Solving**: Nearest neighbor algorithm for initial route
4. **Optimization**: 2-opt local improvement to eliminate crossing edges
5. **Validation**: Ensures no vehicle exceeds capacity

Parameters:
- `max_route_length` - Maximum route length in km (default: 100)
- `priority_weight` - Weight for priority pickups 0-1 (default: 0.3)
- `average_speed` - Average speed for ETA calculation (default: 40 km/h)

#### Map Components

Location: `apps/web/components/map/`

**DynamicMap** - SSR-safe map component using dynamic import:
```tsx
import { DynamicMap } from '@/components/map';

<DynamicMap
  center={[40.7128, -74.0060]}
  zoom={13}
  markers={[
    { id: 1, position: [40.7128, -74.0060], title: 'Pickup Location' }
  ]}
  polylines={[
    { id: 1, positions: [[40.7128, -74.0060], [40.7580, -73.9855]], color: '#3b82f6' }
  ]}
  onMarkerClick={(marker) => console.log(marker)}
  onMapClick={(lat, lng) => console.log(lat, lng)}
/>
```

Props:
- `center: [lat, lng]` - Map center coordinates
- `zoom: number` - Initial zoom level
- `markers: MapMarker[]` - Array of markers to display
- `polylines: MapPolyline[]` - Array of routes/polylines
- `onMarkerClick?: (marker) => void` - Marker click handler
- `onMapClick?: (lat, lng) => void` - Map click handler
- `height?: string` - Map height (default: '400px')

### Testing

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npx vitest services/backend/services/cvrp.test.ts
```

Tests cover:
- CVRP routing algorithm validation
- Capacity constraint enforcement
- Priority-based assignment
- Route optimization quality

### Image Classification

The image classification pipeline uses async job processing:

1. **Upload**: `POST /api/images/classify` with image file
2. **Job Creation**: Returns `job_id` immediately (202 Accepted)
3. **Processing**: Background job classifies image using ML API
4. **Polling**: `GET /api/images/classify/:job_id` to check status
5. **Result**: Returns classification, confidence, category, recyclability

#### Mock Classifier (Development)

Location: `apps/web/app/api/images/classify/route.ts`

Returns random mock results for local development. Replace `classifyImage()` function with actual ML API integration:

**OpenAI Vision Example:**
```typescript
async function classifyImage(imageUrl: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    messages: [{
      role: "user",
      content: [
        { type: "text", text: "Identify this waste item and provide recycling guidance" },
        { type: "image_url", image_url: { url: imageUrl } }
      ]
    }]
  });
  // Parse and return structured result
}
```

## 🔐 Security

### Role-Based Access Control (RBAC)

Three user roles with distinct permissions:

- **Citizen**: Create pickups, view own pickups, upload images
- **Driver**: View assigned routes, update location, mark stops complete
- **Coordinator**: All permissions, optimize routes, manage fleet

Implemented via middleware in API routes using Clerk authentication.

### Input Validation

All API endpoints validate:
- Authentication tokens (Clerk JWT)
- Request body schema
- Coordinate bounds (-90 to 90 lat, -180 to 180 lng)
- File types and sizes (images < 10MB)
- Enum values (waste types, statuses, roles)

### Rate Limiting

TODO: Implement rate limiting for sensitive endpoints:
- Image uploads: 10 requests/minute per user
- Route optimization: 5 requests/minute per coordinator
- Location updates: 60 requests/minute per driver

## 🚢 Deployment

### Vercel Deployment

1. **Connect Repository**: Import project in Vercel dashboard
2. **Configure Environment Variables**: Add all variables from `.env.example`
3. **Database**: Use Supabase or managed PostgreSQL
4. **Redis**: Use Upstash Redis or managed Redis
5. **Deploy**: Automatic deployments on push to main

### CI/CD Pipeline

GitHub Actions workflow (`.github/workflows/ci-cd.yml`):

1. **Lint**: ESLint and TypeScript checks
2. **Build**: Build all workspaces
3. **Test**: Run unit and integration tests with PostgreSQL/Redis services
4. **Security**: npm audit and Trivy vulnerability scan
5. **Deploy Staging**: Auto-deploy main branch to staging
6. **Deploy Production**: Deploy on version tags (v*)

### Environment-Specific Configs

**Staging**: Automatic deployment on push to `main`
- URL: `https://routesort-staging.vercel.app`
- Database: Staging PostgreSQL instance
- Redis: Staging Redis instance

**Production**: Manual deployment on tagged releases
- URL: `https://routesort.vercel.app`
- Database: Production PostgreSQL instance
- Redis: Production Redis instance
- Monitoring: Sentry, PostHog

## 📊 API Documentation

Complete OpenAPI 3.0 specification: [`openapi.yaml`](./openapi.yaml)

View interactive docs:
```bash
npx @redocly/cli preview-docs openapi.yaml
```

Or use Swagger UI:
```bash
npx swagger-ui-watcher openapi.yaml
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- TypeScript for all new code
- Follow existing patterns and conventions
- Add JSDoc comments for public functions
- Include tests for new features
- Run `make lint` before committing

## 📄 License

ISC

## 📞 Support

For support, please open an issue in the GitHub repository.

## 🙏 Acknowledgments

- OpenStreetMap for map tiles
- Leaflet for map library
- Clerk for authentication
- Vercel for hosting
