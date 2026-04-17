export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-border"></div>
        <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
      <span className="ml-4 text-sm font-medium text-muted-foreground">Loading...</span>
    </div>
  )
}
