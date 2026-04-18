'use client'

import { useState } from 'react'
import { ChevronRight, Loader2 } from 'lucide-react'
import { Order } from '@/hooks/useSheetyData'
import { LoadingSpinner } from './loading-spinner'
import { getOrderPrice, formatCurrency } from '@/lib/utils'

interface OrdersTableProps {
  orders: Order[]
  loading?: boolean
  onUpdateStatus?: (id: string, status: string) => Promise<any>
}

export function OrdersTable({ orders = [], loading = false, onUpdateStatus }: OrdersTableProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const getStatusColor = (status?: string) => {
    if (!status) return 'bg-muted text-muted-foreground'
    const statusLower = status.toLowerCase()
    return statusLower === 'confirmed'
      ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-green-200 dark:border-green-800'
      : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800'
  }

  const handleStatusToggle = async (order: Order) => {
    const id = order.id
    if (!id || !onUpdateStatus || updatingId) return

    setUpdatingId(id)
    const currentStatus = order.status?.toLowerCase() || 'pending'
    const newStatus = currentStatus === 'confirmed' ? 'pending' : 'confirmed'
    
    try {
      await onUpdateStatus(id, newStatus)
    } catch (error) {
      console.error('Failed to toggle status:', error)
    } finally {
      setUpdatingId(null)
    }
  }

  const displayOrders = orders.slice(-5).reverse() // Show last 5 orders, newest first

  if (loading && orders.length === 0) {
    return <LoadingSpinner />
  }

  if (displayOrders.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-12">
        <p className="text-center text-muted-foreground">No orders found. Try refreshing the data.</p>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Order ID</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Phone</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Product</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">City</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Total (DZD)</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Date</th>
              <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {displayOrders.map((order, index) => {
              const isUpdating = updatingId === order.id
              return (
                <tr
                  key={order.id || index}
                  className="hover:bg-muted/30 transition-colors group"
                >
                  <td className="px-6 py-4 text-sm font-medium text-primary">
                    {order.id ? `#${order.id}` : `ORD-${index + 1}`}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {order.customer_phone || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground max-w-[150px] truncate">
                    {order.product_name || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">{order.city || '-'}</td>
                  <td className="px-6 py-4 text-sm font-bold text-foreground">
                    {formatCurrency(getOrderPrice(order))}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleStatusToggle(order)}
                      disabled={isUpdating}
                      className={`
                        inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border transition-all
                        ${getStatusColor(order.status)}
                        ${isUpdating ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105 active:scale-95 cursor-pointer'}
                      `}
                    >
                      {isUpdating ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Pending'
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {order.createdDate || order.timestamp || '-'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="p-2 hover:bg-muted rounded-full transition-all text-muted-foreground hover:text-primary group-hover:translate-x-1">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-muted/20">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Showing {displayOrders.length} of {orders.length} orders
        </p>
        <button className="text-sm font-bold text-primary hover:text-primary/80 transition-all flex items-center gap-1">
          View All Orders <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
