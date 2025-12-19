"use client"

import { useState } from "react"
import { signOut } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"
import { TrendingUp, Menu, Search, Bell, Settings, LogOut, Filter, Download } from "lucide-react"
import { RequestList } from "./request-list"
import { RouteAssignmentPanel } from "./route-assignment-panel"
import { KPIDashboard } from "./kpi-dashboard"

const mockKPIData = [
  { month: "Sep", segregation: 68, recycled: 1240, emissions: 2.8 },
  { month: "Oct", segregation: 72, recycled: 1420, emissions: 2.5 },
  { month: "Nov", segregation: 78, recycled: 1680, emissions: 2.2 },
  { month: "Dec", segregation: 82, recycled: 1920, emissions: 1.9 },
]

const mockCapacityData = [
  { name: "Vehicle 1", capacity: 100, current: 78, status: "active" },
  { name: "Vehicle 2", capacity: 100, current: 45, status: "active" },
  { name: "Vehicle 3", capacity: 100, current: 92, status: "active" },
  { name: "Vehicle 4", capacity: 100, current: 30, status: "inactive" },
]

const mockRouteData = [
  { time: "6am", pending: 24, assigned: 18, completed: 12 },
  { time: "9am", pending: 18, assigned: 28, completed: 24 },
  { time: "12pm", pending: 14, assigned: 22, completed: 42 },
  { time: "3pm", pending: 8, assigned: 16, completed: 58 },
  { time: "6pm", pending: 3, assigned: 8, completed: 71 },
]

const mockWasteComposition = [
  { name: "Recyclables", value: 45, color: "hsl(var(--chart-1))" },
  { name: "Compost", value: 28, color: "hsl(var(--chart-2))" },
  { name: "General", value: 18, color: "hsl(var(--chart-3))" },
  { name: "Hazardous", value: 9, color: "hsl(var(--chart-5))" },
]

export function CoordinatorDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedTab, setSelectedTab] = useState("overview")

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "w-64" : "w-0"} bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col overflow-hidden`}
      >
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            <h1 className="text-lg font-bold text-sidebar-primary">RouteSort</h1>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: "overview", label: "Overview", icon: "📊" },
            { id: "requests", label: "Live Requests", icon: "📍" },
            { id: "routes", label: "Routes & Fleet", icon: "🚛" },
            { id: "rewards", label: "Rewards", icon: "🎁" },
            { id: "analytics", label: "Analytics", icon: "📈" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedTab(item.id)}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                selectedTab === item.id
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-sidebar-border space-y-2">
          <button className="w-full text-left px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50">
            <Settings className="w-4 h-4 inline mr-2" />
            Settings
          </button>
          <button
            onClick={() => signOut({ callbackUrl: "/signin" })}
            className="w-full text-left px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50"
          >
            <LogOut className="w-4 h-4 inline mr-2" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="border-b border-border bg-card h-16 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-muted rounded-lg">
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search requests, vehicles..."
                  className="w-full bg-muted/30 border border-input rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-muted rounded-lg relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
            </button>
            <div className="w-8 h-8 bg-linear-to-br from-chart-1 to-chart-2 rounded-full"></div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          {selectedTab === "overview" && (
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold">Dashboard Overview</h2>
                  <p className="text-muted-foreground text-sm mt-1">
                    Real-time waste management metrics and operational status
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Download className="w-4 h-4" />
                    Export Report
                  </Button>
                  <Button size="sm" className="gap-2">
                    <Filter className="w-4 h-4" />
                    Filter
                  </Button>
                </div>
              </div>

              {/* KPI Cards */}
              <KPIDashboard />

              {/* Main Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Segregation Trend */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Segregation & Recycling Trend</CardTitle>
                    <CardDescription>Monthly performance metrics</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={mockKPIData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorSeg" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="month" stroke="rgba(255,255,255,0.6)" style={{ fontSize: "12px" }} />
                        <YAxis stroke="rgba(255,255,255,0.6)" style={{ fontSize: "12px" }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                          labelStyle={{ color: "hsl(var(--foreground))" }}
                        />
                        <Area
                          type="monotone"
                          dataKey="segregation"
                          stroke="hsl(var(--chart-1))"
                          fillOpacity={1}
                          fill="url(#colorSeg)"
                          name="Segregation %"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Waste Composition */}
                <Card>
                  <CardHeader>
                    <CardTitle>Waste Composition</CardTitle>
                    <CardDescription>Today's breakdown</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={mockWasteComposition}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          dataKey="value"
                        >
                          {mockWasteComposition.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Request Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Request Processing Timeline</CardTitle>
                  <CardDescription>Today's pickup request status throughout the day</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockRouteData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="time" stroke="rgba(255,255,255,0.6)" style={{ fontSize: "12px" }} />
                      <YAxis stroke="rgba(255,255,255,0.6)" style={{ fontSize: "12px" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                        labelStyle={{ color: "hsl(var(--foreground))" }}
                      />
                      <Legend />
                      <Bar dataKey="pending" stackId="a" fill="hsl(var(--chart-5))" name="Pending" />
                      <Bar dataKey="assigned" stackId="a" fill="hsl(var(--chart-4))" name="Assigned" />
                      <Bar dataKey="completed" stackId="a" fill="hsl(var(--chart-2))" name="Completed" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}

          {selectedTab === "requests" && <RequestList />}
          {selectedTab === "routes" && <RouteAssignmentPanel />}

          {["rewards", "analytics"].includes(selectedTab) && (
            <div className="p-6">
              <Card>
                <CardHeader>
                  <CardTitle>{selectedTab === "rewards" ? "Rewards Management" : "Advanced Analytics"}</CardTitle>
                  <CardDescription>Feature coming soon</CardDescription>
                </CardHeader>
                <CardContent className="py-12 text-center text-muted-foreground">
                  This section is under development
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
