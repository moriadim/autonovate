import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Order } from '@/hooks/useSheetyData'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number | string): string {
  const value = typeof amount === 'string' ? parseFloat(amount) : amount
  return `${(value || 0).toLocaleString('en-US')} DZD`
}

export function getOrderPrice(order: Order): number {
  // Pull from total_order_price or subtotal
  const totalPrice = Number(order.total_order_price) || Number(order.subtotal) || Number(order.total_price) || 0
  
  if (totalPrice > 0) {
    return totalPrice
  }

  // If missing or 0, calculate it by multiplying unit_price * quantity
  const unitPrice = Number(order.unit_price) || 0
  const quantity = Number(order.quantity) || 0
  return unitPrice * quantity
}
