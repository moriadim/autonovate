'use client'

import { useState, useEffect } from 'react'
import { StatsCards } from '@/components/stats-cards'
import { OrdersTable } from '@/components/orders-table'
import { InventoryMonitor } from '@/components/inventory-monitor'
import { WilayaChart } from '@/components/wilaya-chart'
import { Header } from '@/components/header'
import { useSheetyData, Order, Product } from '@/hooks/useSheetyData'

export default function Dashboard() {
  const [refreshTime, setRefreshTime] = useState<string>('')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { orders, products, loading, fetchAll, updateOrderStatus } = useSheetyData()

  // Initialize data on mount
  useEffect(() => {
    const initializeData = async () => {
      await fetchAll()
      setRefreshTime(new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }))
    }
    initializeData()
  }, [fetchAll])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchAll()
    setRefreshTime(new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }))
    setIsRefreshing(false)
  }

  // Calculate stats from orders
  const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.total_price) || 0), 0)
  const ordersToday = orders.length
  const lowStockProducts = products.filter(p => (Number(p.stock) || 0) < 5).length

  return (
    <main className="min-h-screen bg-background">
      <Header 
        onRefresh={handleRefresh} 
        lastRefresh={refreshTime} 
        isRefreshing={isRefreshing}
      />
      
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Live Stats */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">Live Statistics</h2>
          <StatsCards 
            totalRevenue={totalRevenue}
            ordersToday={ordersToday}
            lowStockAlerts={lowStockProducts}
            loading={loading}
          />
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Orders Table - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-foreground mb-6">Recent Orders</h2>
            <OrdersTable 
              orders={orders} 
              loading={loading} 
              onUpdateStatus={updateOrderStatus}
            />
          </div>

          {/* Inventory Monitor - Takes 1 column */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Inventory Status</h2>
            <InventoryMonitor products={products} loading={loading} />
          </div>
        </div>

        {/* Geographic Distribution */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">Sales by Wilaya</h2>
          <WilayaChart orders={orders} loading={loading} />
        </section>
      </div>
    </main>
  )
}
