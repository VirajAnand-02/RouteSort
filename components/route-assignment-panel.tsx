import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Zap, Pause, Play } from "lucide-react"

export function RouteAssignmentPanel() {
  const vehicles = [
    {
      id: "V001",
      driver: "John Martinez",
      status: "active",
      capacity: 78,
      maxCapacity: 100,
      location: "Downtown District",
      route: "Route-12A",
      stops: 8,
      completedStops: 5,
      efficiency: 94,
    },
    {
      id: "V002",
      driver: "Sarah Chen",
      status: "active",
      capacity: 45,
      maxCapacity: 100,
      location: "North Campus",
      route: "Route-08B",
      stops: 6,
      completedStops: 3,
      efficiency: 87,
    },
    {
      id: "V003",
      driver: "Michael Torres",
      status: "active",
      capacity: 92,
      maxCapacity: 100,
      location: "West Commercial",
      route: "Route-15C",
      stops: 10,
      completedStops: 7,
      efficiency: 91,
    },
    {
      id: "V004",
      driver: "Emma Williams",
      status: "inactive",
      capacity: 30,
      maxCapacity: 100,
      location: "Depot",
      route: "Standby",
      stops: 0,
      completedStops: 0,
      efficiency: 0,
    },
  ]

  const getCapacityColor = (capacity: number) => {
    if (capacity >= 85) return "text-red-600"
    if (capacity >= 60) return "text-yellow-600"
    return "text-green-600"
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Fleet & Route Management</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Assign batches, monitor capacity, and control routes in real-time
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {vehicles.map((vehicle) => (
          <Card key={vehicle.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-chart-1 to-chart-2 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {vehicle.id}
                    </div>
                    <div>
                      <p className="font-semibold">{vehicle.driver}</p>
                      <p className="text-xs text-muted-foreground">{vehicle.route}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={vehicle.status === "active" ? "bg-green-500" : "bg-gray-500"}>
                    {vehicle.status.toUpperCase()}
                  </Badge>
                  <Button size="sm" variant="outline" className="gap-1 bg-transparent">
                    {vehicle.status === "active" ? (
                      <>
                        <Pause className="w-4 h-4" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Resume
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Location</p>
                  <p className="font-semibold text-sm">{vehicle.location}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Stops Progress</p>
                  <p className="font-semibold text-sm">
                    {vehicle.completedStops}/{vehicle.stops}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Route Efficiency</p>
                  <p className="font-semibold text-sm text-green-600">{vehicle.efficiency}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Capacity</p>
                  <p className={`font-semibold text-sm ${getCapacityColor(vehicle.capacity)}`}>
                    {vehicle.capacity}/{vehicle.maxCapacity} kg
                  </p>
                </div>
                <div>
                  <Button size="sm" variant="outline" className="w-full bg-transparent">
                    Assign Batch
                  </Button>
                </div>
              </div>

              {/* Capacity Bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium">Capacity Usage</span>
                  <span className={`text-xs font-semibold ${getCapacityColor(vehicle.capacity)}`}>
                    {Math.round((vehicle.capacity / vehicle.maxCapacity) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      (vehicle.capacity / vehicle.maxCapacity) >= 0.85
                        ? "bg-red-500"
                        : vehicle.capacity / vehicle.maxCapacity >= 0.6
                          ? "bg-yellow-500"
                          : "bg-green-500"
                    }`}
                    style={{ width: `${(vehicle.capacity / vehicle.maxCapacity) * 100}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Batch Assignment Section */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Create New Batch
          </CardTitle>
          <CardDescription>Combine pending requests into optimized routes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium block mb-2">Batch Type</label>
              <select className="w-full border border-input rounded-lg px-3 py-2 text-sm">
                <option>All Types</option>
                <option>Recyclables</option>
                <option>Compost</option>
                <option>Mixed</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Priority</label>
              <select className="w-full border border-input rounded-lg px-3 py-2 text-sm">
                <option>Any</option>
                <option>High Priority</option>
                <option>Normal</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">Area</label>
              <select className="w-full border border-input rounded-lg px-3 py-2 text-sm">
                <option>All Areas</option>
                <option>Downtown</option>
                <option>Campus</option>
                <option>Commercial</option>
              </select>
            </div>
          </div>
          <Button className="w-full">Generate Optimized Routes</Button>
        </CardContent>
      </Card>
    </div>
  )
}
