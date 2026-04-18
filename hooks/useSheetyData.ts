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
      const data: SheetyResponse<any> = await response.json()
      const rawOrders = data.sales || []
      
      // Normalize data to snake_case as requested by user
      const normalizedOrders: Order[] = rawOrders.map((item: any) => ({
        id: item.id,
        product_name: item.product_name || item.productName,
        quantity: item.quantity,
        unit_price: item.unit_price || item.unitPrice,
        shipping_fee: item.shipping_fee || item.shippingFee,
        total_price: item.total_price || item.totalPrice,
        customer_phone: item.customer_phone || item.customerPhone,
        city: item.city,
        status: item.status,
      }))
      
      setOrders(normalizedOrders)
      return normalizedOrders
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
      const data: SheetyResponse<any> = await response.json()
      const rawProducts = data.products || []
      
      const normalizedProducts: Product[] = rawProducts.map((item: any) => ({
        id: item.id,
        product_name: item.product_name || item.productName,
        stock: item.stock,
        price: item.price || item.unitPrice,
      }))
      
      setProducts(normalizedProducts)
      return normalizedProducts
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
      const data: SheetyResponse<any> = await response.json()
      const rawCustomers = data.customers || []
      
      const normalizedCustomers: Customer[] = rawCustomers.map((item: any) => ({
        id: item.id,
        phone: item.phone || item.customerPhone,
        name: item.name,
        city: item.city,
      }))
      
      setCustomers(normalizedCustomers)
      return normalizedCustomers
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
      ]).catch(() => [
          { ok: false }, { ok: false }, { ok: false }
      ]) as any[]

      // Re-fetch individually if Promise.all fails or just use the results
      const salesResult = await fetchOrders()
      const productsResult = await fetchProducts()
      const customersResult = await fetchCustomers()

      return {
        orders: salesResult,
        products: productsResult,
        customers: customersResult
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch data'
      setError(errorMsg)
      console.error('[v0] Error fetching all data:', errorMsg)
      return { orders: [], products: [], customers: [] }
    } finally {
      setLoading(false)
    }
  }, [fetchOrders, fetchProducts, fetchCustomers])

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

