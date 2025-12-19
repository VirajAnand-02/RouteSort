import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, CheckCircle2 } from "lucide-react"

export function RequestList() {
  const requests = [
    {
      id: "REQ-001",
      address: "345 Oak Street, Campus North",
      type: "mixed",
      priority: "high",
      time: "2 mins ago",
      status: "pending",
      bins: 3,
      weight: "145 kg",
    },
    {
      id: "REQ-002",
      address: "982 Elm Avenue, Residential Block A",
      type: "recyclables",
      priority: "normal",
      time: "8 mins ago",
      status: "assigned",
      bins: 2,
      weight: "78 kg",
    },
    {
      id: "REQ-003",
      address: "567 Maple Drive, Commerce Park",
      type: "mixed",
      priority: "normal",
      time: "12 mins ago",
      status: "in-progress",
      bins: 4,
      weight: "289 kg",
    },
    {
      id: "REQ-004",
      address: "123 Cedar Lane, Residential C",
      type: "compost",
      priority: "normal",
      time: "18 mins ago",
      status: "completed",
      bins: 1,
      weight: "42 kg",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "assigned":
        return "bg-blue-100 text-blue-800"
      case "in-progress":
        return "bg-purple-100 text-purple-800"
      case "completed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "recyclables":
        return "♻️"
      case "compost":
        return "🌱"
      case "mixed":
        return "🗑️"
      default:
        return "📦"
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Live Requests</h2>
        <p className="text-muted-foreground text-sm mt-1">Manage pickup requests in real-time</p>
      </div>

      <div className="space-y-3">
        {requests.map((req) => (
          <Card key={req.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 flex gap-4">
                  <div className="text-2xl">{getTypeIcon(req.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-sm">{req.id}</span>
                      <Badge variant={req.priority === "high" ? "destructive" : "secondary"} className="text-xs">
                        {req.priority.toUpperCase()}
                      </Badge>
                      <Badge className={`text-xs ${getStatusColor(req.status)}`}>{req.status.toUpperCase()}</Badge>
                    </div>
                    <p className="text-sm font-medium flex items-center gap-2 mb-1">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      {req.address}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {req.time}
                      </span>
                      <span>•</span>
                      <span>{req.bins} bins</span>
                      <span>•</span>
                      <span>{req.weight}</span>
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {req.status === "pending" && (
                    <>
                      <Button size="sm" variant="outline">
                        Assign
                      </Button>
                      <Button size="sm" variant="destructive">
                        Dismiss
                      </Button>
                    </>
                  )}
                  {req.status === "assigned" && (
                    <Button size="sm" variant="outline">
                      Start
                    </Button>
                  )}
                  {req.status === "in-progress" && (
                    <Button size="sm" variant="outline">
                      Complete
                    </Button>
                  )}
                  {req.status === "completed" && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
