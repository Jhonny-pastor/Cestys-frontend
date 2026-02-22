import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api/v1'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

const authHeaders = () => {
  const token = localStorage.getItem('access_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const extractMessage = (error) => {
  if (error.response?.data?.message) return error.response.data.message
  if (error.response?.data?.error) return error.response.data.error
  return 'No se pudo completar la operacion.'
}

export const fetchCart = async () => {
  const { data } = await api.get('/me/cart', { headers: authHeaders() })
  return data.data
}

export const addCourseToCart = async (cursoId) => {
  try {
    const { data } = await api.post(
      '/me/cart/items',
      { cursoId },
      { headers: authHeaders() },
    )
    return data.data
  } catch (error) {
    throw new Error(extractMessage(error))
  }
}

export const removeCourseFromCart = async (cursoId) => {
  const { data } = await api.delete(`/me/cart/items/${cursoId}`, {
    headers: authHeaders(),
  })
  return data.data
}

export const clearCart = async () => {
  const { data } = await api.delete('/me/cart', { headers: authHeaders() })
  return data
}

export const createOrder = async () => {
  try {
    const { data } = await api.post('/orders', {}, { headers: authHeaders() })
    return data
  } catch (error) {
    throw new Error(extractMessage(error))
  }
}

export const simulatePayment = async ({ orderId, paymentId }) => {
  const { data } = await api.post('/payments/webhook', {
    orderId,
    status: 'PAID',
    paymentId,
  })
  return data
}

export const fetchMyOrders = async () => {
  const { data } = await api.get('/me/orders', { headers: authHeaders() })
  return data.data?.data ?? []
}

