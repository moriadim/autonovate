import { useState, useCallback } from 'react'

export interface Order {
  id?: string
  orderId?: string
  product?: string
  quantity?: number
  city?: string
  phone?: string
  totalPrice?: number
  status?: 'confirmed' | 'pending'
  timestamp?: string
  createdDate?: string
}

export interface Product {
  id?: string
  productname?: string
  sku?: string
  unitprice?: number
  stock?: number
}

interface SheetyResponse<T> {
  [key: string]: T[]
}

export function useSheetyData() {
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(
        'https://api.sheety.co/e57b6237c201e793e15b97104eeb261a/yesn8N/feuille1'
      )
      if (!response.ok) throw new Error('Failed to fetch orders')
      const data: SheetyResponse<Order> = await response.json()
      const ordersArray = data.feuille1 || []
      setOrders(ordersArray)
      return ordersArray
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch orders'
      setError(errorMsg)
      console.error('[v0] Error fetching orders:', errorMsg)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(
        'https://api.sheety.co/e57b6237c201e793e15b97104eeb261a/yesn8N/products'
      )
      if (!response.ok) throw new Error('Failed to fetch products')
      const data: SheetyResponse<Product> = await response.json()
      const productsArray = data.products || []
      setProducts(productsArray)
      return productsArray
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch products'
      setError(errorMsg)
      console.error('[v0] Error fetching products:', errorMsg)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [ordersData, productsData] = await Promise.all([
        fetch(
          'https://api.sheety.co/e57b6237c201e793e15b97104eeb261a/yesn8N/feuille1'
        ),
        fetch(
          'https://api.sheety.co/e57b6237c201e793e15b97104eeb261a/yesn8N/products'
        ),
      ])

      if (!ordersData.ok || !productsData.ok) {
        throw new Error('Failed to fetch data')
      }

      const ordersJson: SheetyResponse<Order> = await ordersData.json()
      const productsJson: SheetyResponse<Product> = await productsData.json()

      setOrders(ordersJson.feuille1 || [])
      setProducts(productsJson.products || [])

      return {
        orders: ordersJson.feuille1 || [],
        products: productsJson.products || [],
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch data'
      setError(errorMsg)
      console.error('[v0] Error fetching all data:', errorMsg)
      return { orders: [], products: [] }
    } finally {
      setLoading(false)
    }
  }, [])

  const updateOrderStatus = useCallback(async (id: string, newStatus: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(
        `https://api.sheety.co/e57b6237c201e793e15b97104eeb261a/yesn8N/feuille1/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            feuille1: {
              status: newStatus,
            },
          }),
        }
      )

      if (!response.ok) throw new Error('Failed to update order status')
      
      const data = await response.json()
      const updatedOrder = data.feuille1

      // Update local state to reflect changes instantly
      setOrders(prev => prev.map(order => 
        (order.id === id || (order.id as any) == id) ? { ...order, status: updatedOrder.status as any } : order
      ))

      return updatedOrder
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update order status'
      setError(errorMsg)
      console.error('[v0] Error updating order status:', errorMsg)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    orders,
    products,
    loading,
    error,
    fetchOrders,
    fetchProducts,
    fetchAll,
    updateOrderStatus,
  }
}
