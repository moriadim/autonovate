import { AlertCircle } from 'lucide-react'
import { Product } from '@/hooks/useSheetyData'
import { LoadingSpinner } from './loading-spinner'

interface InventoryMonitorProps {
  products: Product[]
  loading?: boolean
}

export function InventoryMonitor({ products = [], loading = false }: InventoryMonitorProps) {
  const getStockStatus = (stock: number): 'high' | 'medium' | 'low' => {
    if (stock < 3) return 'low'
    if (stock < 10) return 'medium'
    return 'high'
  }

  const getStockColor = (status: 'high' | 'medium' | 'low') => {
    switch (status) {
      case 'high':
        return 'bg-success'
      case 'medium':
        return 'bg-warning'
      case 'low':
        return 'bg-error'
      default:
        return 'bg-muted'
    }
  }

  const getStatusText = (status: 'high' | 'medium' | 'low') => {
    switch (status) {
      case 'high':
        return 'In Stock'
      case 'medium':
        return 'Running Low'
      case 'low':
        return 'Critical'
      default:
        return 'Unknown'
    }
  }

  const getStatusBg = (status: 'high' | 'medium' | 'low') => {
    switch (status) {
      case 'high':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      case 'medium':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
      case 'low':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const stockPercentage = (current: number, max: number) => (current / max) * 100

  const displayProducts = products.slice(0, 8)
  const lowStockProducts = products.filter(p => (p.stock || 0) < 3)

  if (loading) {
    return <LoadingSpinner />
  }

  if (displayProducts.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-8">
        <p className="text-center text-muted-foreground">No products found. Try refreshing the data.</p>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-4 max-h-[700px] overflow-y-auto">
      {displayProducts.map((product, index) => {
        const stock = product.stock || 0
        const maxStock = 50 // Default maxStock as per requirements
        const status = getStockStatus(stock)
        const percentage = stockPercentage(stock, maxStock)

        return (
          <div key={index} className="space-y-2 pb-4 border-b border-border last:border-b-0 last:pb-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{product.productname || `Product ${index + 1}`}</p>
                <p className="text-xs text-muted-foreground">Price: {(product.unitprice || 0).toLocaleString('en-US')} DZD</p>
              </div>
              <div className="flex gap-1">
                {stock < 3 && (
                  <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
                )}
                <span className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ${getStatusBg(status)}`}>
                  {getStatusText(status)}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Stock Level</span>
                <span className="text-sm font-bold text-foreground">
                  {stock}/{maxStock}
                </span>
              </div>

              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${getStockColor(status)}`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                ></div>
              </div>

              <p className="text-xs text-muted-foreground">{percentage.toFixed(0)}% Capacity</p>
            </div>

            {stock < 3 && (
              <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded text-xs text-red-700 dark:text-red-400 flex gap-2">
                <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                <span>Low Stock Badge: {stock} units remaining</span>
              </div>
            )}
          </div>
        )
      })}

      <div className="mt-6 pt-4 border-t border-border">
        <button className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors">
          Reorder Low Stock ({lowStockProducts.length})
        </button>
      </div>
    </div>
  )
}
