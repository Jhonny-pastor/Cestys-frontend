import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api/v1'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

const unwrapCollection = (payload) => {
  if (Array.isArray(payload?.data?.data)) return payload.data.data
  if (Array.isArray(payload?.data)) return payload.data
  return []
}

export const fetchCategories = async () => {
  try {
    const token = localStorage.getItem('access_token')
    if (!token) return []

    const { data } = await api.get('/admin/categories', {
      headers: { Authorization: `Bearer ${token}` },
    })
    return unwrapCollection(data)
  } catch {
    return []
  }
}

export const fetchCourses = async () => {
  try {
    const { data } = await api.get('/courses')
    return unwrapCollection(data)
  } catch {
    return []
  }
}

