import { DollarSign, ShoppingCart, AlertTriangle, Users } from 'lucide-react'
import { LoadingSpinner } from './loading-spinner'

interface StatsCardsProps {
  totalRevenue: number
  ordersToday: number
  lowStockAlerts: number
  loading?: boolean
}

interface StatCard {
  title: string
  value: string | number
  unit?: string
  icon: React.ReactNode
  trend?: string
  trendUp?: boolean
  bgColor: string
}

export function StatsCards({ totalRevenue, ordersToday, lowStockAlerts, loading = false }: StatsCardsProps) {
  if (loading) {
    return <LoadingSpinner />
  }

  const stats: StatCard[] = [
    {
      title: 'Total Revenue',
      value: totalRevenue.toLocaleString('en-US'),
      unit: 'DZD',
      icon: <DollarSign className="w-6 h-6" />,
      trend: 'All time',
      trendUp: true,
      bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    },
    {
      title: 'Orders Today',
      value: ordersToday,
      icon: <ShoppingCart className="w-6 h-6" />,
      trend: `${ordersToday} total orders`,
      trendUp: true,
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
    },
    {
      title: 'Low Stock Alerts',
      value: lowStockAlerts,
      icon: <AlertTriangle className="w-6 h-6" />,
      trend: 'Items below 5 units',
      trendUp: lowStockAlerts === 0,
      bgColor: 'bg-amber-50 dark:bg-amber-950/30',
    },
    {
      title: 'Avg Order Value',
      value: ordersToday > 0 ? (totalRevenue / ordersToday).toFixed(0) : 0,
      unit: 'DZD',
      icon: <Users className="w-6 h-6" />,
      trend: 'Per order',
      trendUp: true,
      bgColor: 'bg-purple-50 dark:bg-purple-950/30',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`${stat.bgColor} border border-border rounded-lg p-6 transition-all hover:shadow-lg`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="text-primary">{stat.icon}</div>
            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-primary/10 text-primary">
              {stat.trendUp ? '↑' : '⚠'} {stat.trend}
            </span>
          </div>

          <h3 className="text-sm font-medium text-muted-foreground mb-2">{stat.title}</h3>
          
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-foreground">{stat.value}</span>
            {stat.unit && <span className="text-sm text-muted-foreground">{stat.unit}</span>}
          </div>
        </div>
      ))}
    </div>
  )
}
