import { useState, useCallback } from 'react'

export interface Order {
  id?: string | number
  product_name?: string
  quantity?: number | string
  unit_price?: number | string
  shipping_fee?: number | string
  total_price?: number | string
  customer_phone?: string
  city?: string
  status?: string
}

export interface Product {
  id?: string | number
  product_name?: string
  stock?: number | string
  price?: number | string
}

export interface Customer {
  id?: string | number
  phone?: string
  name?: string
  city?: string
}

interface SheetyResponse<T> {
  [key: string]: T[]
}

export function useSheetyData() {
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(
        'https://api.sheety.co/e57b6237c201e793e15b97104eeb261a/yesn8N/sales'
      )
      if (!response.ok) throw new Error('Failed to fetch sales')
      const data: SheetyResponse<Order> = await response.json()
      const ordersArray = data.sales || []
      setOrders(ordersArray)
      return ordersArray
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch sales'
      setError(errorMsg)
      console.error('[v0] Error fetching sales:', errorMsg)
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

  const fetchCustomers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(
        'https://api.sheety.co/e57b6237c201e793e15b97104eeb261a/yesn8N/customers'
      )
      if (!response.ok) throw new Error('Failed to fetch customers')
      const data: SheetyResponse<Customer> = await response.json()
      const customersArray = data.customers || []
      setCustomers(customersArray)
      return customersArray
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch customers'
      setError(errorMsg)
      console.error('[v0] Error fetching customers:', errorMsg)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [salesData, productsData, customersData] = await Promise.all([
        fetch('https://api.sheety.co/e57b6237c201e793e15b97104eeb261a/yesn8N/sales'),
        fetch('https://api.sheety.co/e57b6237c201e793e15b97104eeb261a/yesn8N/products'),
        fetch('https://api.sheety.co/e57b6237c201e793e15b97104eeb261a/yesn8N/customers'),
      ])

      if (!salesData.ok || !productsData.ok || !customersData.ok) {
        throw new Error('Failed to fetch data')
      }

      const salesJson: SheetyResponse<Order> = await salesData.json()
      const productsJson: SheetyResponse<Product> = await productsData.json()
      const customersJson: SheetyResponse<Customer> = await customersData.json()

      const ordersArray = salesJson.sales || []
      const productsArray = productsJson.products || []
      const customersArray = customersJson.customers || []

      setOrders(ordersArray)
      setProducts(productsArray)
      setCustomers(customersArray)

      return {
        orders: ordersArray,
        products: productsArray,
        customers: customersArray
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch data'
      setError(errorMsg)
      console.error('[v0] Error fetching all data:', errorMsg)
      return { orders: [], products: [], customers: [] }
    } finally {
      setLoading(false)
    }
  }, [])

  const updateOrderStatus = useCallback(async (id: string, newStatus: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(
        `https://api.sheety.co/e57b6237c201e793e15b97104eeb261a/yesn8N/sales/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sale: {
              status: newStatus,
            },
          }),
        }
      )

      if (!response.ok) throw new Error('Failed to update order status')
      
      const data = await response.json()
      const updatedOrder = data.sale

      // Update local state to reflect changes instantly
      setOrders((prev: Order[]) => prev.map((order: Order) => 
        (order.id === id || String(order.id) === String(id)) 
          ? { ...order, status: updatedOrder?.status || order.status } 
          : order
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
    customers,
    loading,
    error,
    fetchOrders,
    fetchProducts,
    fetchCustomers,
    fetchAll,
    updateOrderStatus,
  }
}

