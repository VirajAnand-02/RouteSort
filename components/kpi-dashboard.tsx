import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

export function KPIDashboard() {
  const kpis = [
    {
      label: "Active Requests",
      value: "124",
      change: "+12%",
      positive: true,
      icon: "📍",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Segregation Rate",
      value: "82%",
      change: "+4% vs last week",
      positive: true,
      icon: "♻️",
      bgColor: "bg-green-500/10",
    },
    {
      label: "Route Efficiency",
      value: "89%",
      change: "+2% optimized",
      positive: true,
      icon: "🚛",
      bgColor: "bg-purple-500/10",
    },
    {
      label: "Emissions Saved",
      value: "2.1T",
      change: "+18% reduction",
      positive: true,
      icon: "🌍",
      bgColor: "bg-emerald-500/10",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, i) => (
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
