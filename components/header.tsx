import { RefreshCw, Bell } from 'lucide-react'

interface HeaderProps {
  onRefresh: () => void
  lastRefresh: string
  isRefreshing?: boolean
}

export function Header({ onRefresh, lastRefresh, isRefreshing = false }: HeaderProps) {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">E-Commerce Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">WhatsApp Sales Management System</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Last Updated</p>
            <p className="text-sm font-semibold text-foreground">{lastRefresh || '--:--:--'}</p>
          </div>
          
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className={`p-2 rounded-lg transition-colors ${
              isRefreshing
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'hover:bg-muted text-primary hover:text-primary/80'
            }`}
            aria-label="Refresh data"
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>

          <button
            className="p-2 hover:bg-muted rounded-lg transition-colors text-primary hover:text-primary/80 relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
          </button>
        </div>
      </div>
    </header>
  )
}
