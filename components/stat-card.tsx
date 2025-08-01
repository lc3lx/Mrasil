import { ArrowDown, ArrowUp } from "lucide-react"

interface StatCardProps {
  title: string
  value: string
  change: string
  trend: "up" | "down"
}

export function StatCard({ title, value, change, trend }: StatCardProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4 transition-all hover:border-primary/30 hover:bg-primary/5">
      <div>
        <div className="text-sm text-muted-foreground">{title}</div>
        <div className="text-xl font-bold">{value}</div>
      </div>
      <div
        className={`flex items-center rounded-full px-2.5 py-1.5 text-xs font-medium ${
          trend === "up" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}
      >
        {trend === "up" ? <ArrowUp className="mr-1 h-3 w-3" /> : <ArrowDown className="mr-1 h-3 w-3" />}
        {change}
      </div>
    </div>
  )
}
