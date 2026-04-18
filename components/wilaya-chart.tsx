'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { Order } from '@/hooks/useSheetyData'
import { LoadingSpinner } from './loading-spinner'

interface WilayaData {
  name: string
  sales: number
  orders: number
}

const WILAYAS = [
  'Algiers',
  'Setif',
  'Oran',
  'Constantine',
  'Annaba',
  'Batna',
  'Blida',
  'Tlemcen',
  'Tizi Ouzou',
  'Bejaïa',
]

interface WilayaChartProps {
  orders: Order[]
  loading?: boolean
}

export function WilayaChart({ orders = [], loading = false }: WilayaChartProps) {
  // Group orders by wilaya (city)
  const wilayaStats: Record<string, WilayaData> = {}

  orders.forEach((order) => {
    const city = order.city || 'Unknown'
    if (!wilayaStats[city]) {
      wilayaStats[city] = { name: city, sales: 0, orders: 0 }
    }
    wilayaStats[city].sales += Number(order.total_price) || 0
    wilayaStats[city].orders += 1
  })

  // Convert to array and sort by sales
  const data = Object.values(wilayaStats).sort((a, b) => b.sales - a.sales)

  const totalRevenue = data.reduce((sum, w) => sum + w.sales, 0)
  const totalOrders = data.reduce((sum, w) => sum + w.orders, 0)
  const topWilaya = data.length > 0 ? data[0] : null
  const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(0) : 0

  const colors = [
    '#1e40af',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
    '#06b6d4',
    '#ec4899',
    '#f97316',
    '#14b8a6',
    '#f87171',
  ]

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-semibold text-foreground">{payload[0].payload.name}</p>
          <p className="text-sm text-primary">
            Sales: {payload[0].value.toLocaleString('en-US')} DZD
          </p>
          <p className="text-sm text-accent">Orders: {payload[0].payload.orders}</p>
        </div>
      )
    }
    return null
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (data.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-12">
        <p className="text-center text-muted-foreground">No sales data available. Try refreshing the data.</p>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-muted rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">Total Revenue</p>
          <p className="text-2xl font-bold text-primary">
            {(totalRevenue / 1000000).toFixed(2)}M DZD
          </p>
          <p className="text-xs text-muted-foreground mt-2">All wilayas combined</p>
        </div>
        <div className="bg-muted rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">Total Orders</p>
          <p className="text-2xl font-bold text-accent">{totalOrders}</p>
          <p className="text-xs text-muted-foreground mt-2">Across all wilayas</p>
        </div>
        <div className="bg-muted rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">Top Wilaya</p>
          <p className="text-2xl font-bold text-primary">{topWilaya?.name || 'N/A'}</p>
          <p className="text-xs text-muted-foreground mt-2">
            {topWilaya ? `${(topWilaya.sales / totalRevenue * 100).toFixed(0)}% of revenue` : 'N/A'}
          </p>
        </div>
        <div className="bg-muted rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">Avg Order Value</p>
          <p className="text-2xl font-bold text-accent">{avgOrderValue}</p>
          <p className="text-xs text-muted-foreground mt-2">DZD per order</p>
        </div>
      </div>

      <div className="w-full h-96 mt-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={100}
              tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
            />
            <YAxis
              label={{ value: 'Sales (DZD)', angle: -90, position: 'insideLeft' }}
              tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="square" />
            <Bar dataKey="sales" fill="#1e40af" radius={[8, 8, 0, 0]} name="Sales (DZD)">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {data.length > 0 && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {data.slice(0, 8).map((wilaya, index) => (
            <div key={index} className="text-center">
              <div
                className="w-3 h-3 rounded-full mx-auto mb-2"
                style={{ backgroundColor: colors[index % colors.length] }}
              ></div>
              <p className="text-xs font-medium text-foreground truncate">{wilaya.name}</p>
              <p className="text-xs text-muted-foreground">{wilaya.orders} orders</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
