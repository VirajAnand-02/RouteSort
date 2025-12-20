import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

type CoordinatorKpis = {
  activeRequests: number
  activeRequestsChangePct: number
  segregationRate: number
  segregationRateDeltaPts: number
  routeEfficiency: number
  routeEfficiencyDeltaPts: number
  totalCarbonReduced: number
}

function formatSignedPct(value: number) {
  const rounded = Math.round(value * 10) / 10
  const sign = rounded > 0 ? "+" : rounded < 0 ? "" : "+"
  return `${sign}${rounded}%`
}

function formatSignedPts(value: number) {
  const rounded = Math.round(value * 10) / 10
  const sign = rounded > 0 ? "+" : rounded < 0 ? "" : "+"
  return `${sign}${rounded} pts`
}

export function KPIDashboard({ kpis }: { kpis?: CoordinatorKpis }) {
  const fallbackKpis: CoordinatorKpis = {
    activeRequests: 124,
    activeRequestsChangePct: 12,
    segregationRate: 82,
    segregationRateDeltaPts: 4,
    routeEfficiency: 89,
    routeEfficiencyDeltaPts: 2,
    totalCarbonReduced: 2.1,
  }

  const live = kpis ?? fallbackKpis

  const cards = [
    {
      label: "Active Requests",
      value: String(live.activeRequests),
      change: `${formatSignedPct(live.activeRequestsChangePct)} vs last week`,
      positive: live.activeRequestsChangePct >= 0,
      icon: "📍",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Segregation Rate",
      value: `${Math.round(live.segregationRate)}%`,
      change: `${formatSignedPts(live.segregationRateDeltaPts)} vs last week`,
      positive: live.segregationRateDeltaPts >= 0,
      icon: "♻️",
      bgColor: "bg-green-500/10",
    },
    {
      label: "Route Efficiency",
      value: `${Math.round(live.routeEfficiency)}%`,
      change: `${formatSignedPts(live.routeEfficiencyDeltaPts)} vs last week`,
      positive: live.routeEfficiencyDeltaPts >= 0,
      icon: "🚛",
      bgColor: "bg-purple-500/10",
    },
    {
      label: "Emissions Saved",
      positive: true,
      value: `${live.totalCarbonReduced}T`,
      change: "All-time total",
      icon: "🌍",
      bgColor: "bg-emerald-500/10",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((kpi, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground font-medium">{kpi.label}</p>
                <p className="text-3xl font-bold mt-2">{kpi.value}</p>
                <p
                  className={`text-sm mt-2 flex items-center gap-1 ${kpi.positive ? "text-green-600" : "text-red-600"}`}
                >
                  {kpi.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {kpi.change}
                </p>
              </div>
              <div className={`${kpi.bgColor} w-12 h-12 rounded-lg flex items-center justify-center text-xl`}>
                {kpi.icon}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
