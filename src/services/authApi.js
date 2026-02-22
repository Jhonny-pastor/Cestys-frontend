import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api/v1'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

const extractApiError = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message
  }

  if (error.response?.data?.errors) {
    const messages = Object.values(error.response.data.errors).flat()
    if (messages.length > 0) {
      return messages.join(' ')
    }
  }

  return 'Error de conexión con el servidor.'
}

export const loginUser = async (payload) => {
  try {
    const { data } = await api.post('/auth/login', payload)
    return data
  } catch (error) {
    throw new Error(extractApiError(error))
  }
}

export const registerUser = async (payload) => {
  try {
    const { data } = await api.post('/auth/register', payload)
    return data
  } catch (error) {
    throw new Error(extractApiError(error))
  }
}

