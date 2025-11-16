# RouteSort

A smart waste pickup system that optimizes collection routes and provides real-time fleet management.

## 🚀 Features

### Citizen App
- **Schedule Pickups**: Easily schedule waste collection at your convenience
- **Recycling Guidance**: Get AI-powered guidance on recycling by uploading photos
- **Track Status**: Monitor your pickup requests in real-time
- **Interactive Maps**: View pickup locations on OpenStreetMap

### Driver App
- **Optimized Routes**: Follow AI-optimized collection routes on interactive maps
- **Turn-by-Turn Navigation**: Get directions to each stop
- **Stop Confirmation**: Mark pickups as completed with notes
- **Real-time Updates**: Receive route changes and new assignments

### Coordinator Dashboard
- **Fleet Management**: Monitor and manage all vehicles in real-time
- **Request Management**: Review and assign pickup requests
- **Route Planning**: Create and optimize collection routes
- **Analytics**: Track performance metrics and efficiency

## 🛠️ Tech Stack

- **Frontend**: Next.js 14+ with TypeScript and App Router
- **Styling**: Tailwind CSS
- **Authentication**: Clerk
- **Maps**: OpenStreetMap with Leaflet
- **Database**: PostgreSQL
- **Deployment**: Vercel-ready

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Clerk account for authentication

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/VirajAnand-02/RouteSort.git
   cd RouteSort
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your configuration:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key
   - `CLERK_SECRET_KEY`: Your Clerk secret key
   - `DATABASE_URL`: Your PostgreSQL connection string

4. **Set up the database**
   ```bash
   psql -U your_username -d your_database -f schema.sql
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗺️ Application Structure

```
RouteSort/
├── app/
│   ├── citizen/          # Citizen portal
│   │   ├── schedule/     # Schedule pickups
│   │   └── recycling/    # Recycling guidance
│   ├── driver/           # Driver portal
│   │   └── routes/       # Route management
│   ├── coordinator/      # Coordinator dashboard
│   │   ├── requests/     # Request management
│   │   ├── routes/       # Route planning
│   │   └── fleet/        # Fleet management
│   ├── layout.tsx        # Root layout with Clerk
│   ├── page.tsx          # Landing page
│   └── globals.css       # Global styles
├── lib/
│   └── db.ts             # Database utilities
├── schema.sql            # Database schema
└── package.json          # Dependencies
```

## 🔑 Key Features Implementation

### Authentication & Authorization
- Role-based access control (Citizen, Driver, Coordinator)
- Secure authentication via Clerk
- Protected routes for each user type

### Interactive Maps
- OpenStreetMap integration via Leaflet
- Real-time location tracking
- Route visualization with polylines
- Custom markers for pickup locations

### Database Schema
- Users with role-based access
- Pickup requests management
- Route optimization data
- Fleet tracking
- Recycling guidance database

## 📱 User Roles

### Citizen
- Schedule waste pickups
- Upload photos for recycling guidance
- Track pickup status
- View pickup history

### Driver
- View assigned routes
- Navigate to pickup locations
- Confirm completed stops
- Report issues

### Coordinator
- Manage all pickup requests
- Assign routes to drivers
- Monitor fleet in real-time
- View analytics and reports

## 🔧 Development

### Build for production
```bash
npm run build
```

### Start production server
```bash
npm start
```

### Lint code
```bash
npm run lint
```

## 🌐 Deployment

This project is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables
4. Deploy!

## 📄 License

ISC

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support, please open an issue in the GitHub repository.
