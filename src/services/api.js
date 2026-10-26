import { resorts, getResortBySlug } from '../data/resorts'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

const getHeaders = (hasBody = true) => {
  const headers = {}
  if (hasBody) {
    headers['Content-Type'] = 'application/json'
  }
  const token = localStorage.getItem('chis_admin_token')
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

const handleResponse = async (res) => {
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const error = new Error(data.message || `Request failed with status ${res.status}`)
    error.status = res.status
    error.errors = data.errors
    error.data = data
    throw error
  }
  return data
}

export const api = {
  // Public Properties
  async getProperties(params = {}) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        searchParams.append(key, val)
      }
    })

    try {
      const res = await fetch(`${API_BASE}/properties?${searchParams.toString()}`)
      if (res.ok) {
        return await res.json()
      }
    } catch {
      console.warn('Backend unavailable, using static resort fallback')
    }

    // Static fallback
    let filtered = [...resorts]
    if (params.destination && params.destination !== 'All') {
      filtered = filtered.filter(
        (r) => r.destination?.toLowerCase() === params.destination.toLowerCase()
      )
    }
    if (params.featured === 'true' || params.featured === true) {
      filtered = filtered.filter((r) => r.featured)
    }
    if (params.search) {
      const s = params.search.toLowerCase()
      filtered = filtered.filter(
        (r) =>
          r.name?.toLowerCase().includes(s) ||
          r.location?.toLowerCase().includes(s) ||
          r.destination?.toLowerCase().includes(s)
      )
    }

    return {
      success: true,
      count: filtered.length,
      total: filtered.length,
      page: 1,
      totalPages: 1,
      properties: filtered,
      isFallback: true,
    }
  },

  async getPropertyBySlug(slug) {
    try {
      const res = await fetch(`${API_BASE}/properties/${slug}`)
      if (res.ok) {
        return await res.json()
      }
    } catch {
      console.warn('Backend unavailable, using static fallback for slug:', slug)
    }

    const fallback = getResortBySlug(slug)
    if (!fallback) {
      throw new Error('Property not found')
    }

    const related = resorts.filter(
      (r) => r.destination === fallback.destination && r.slug !== fallback.slug
    )

    return {
      success: true,
      property: fallback,
      relatedProperties: related,
      isFallback: true,
    }
  },

  // Auth Endpoints
  async login(username, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, email: username, password }),
    })
    const data = await handleResponse(res)
    if (data.token) {
      localStorage.setItem('chis_admin_token', data.token)
    }
    return data
  },

  async logout() {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: getHeaders(false),
        credentials: 'include',
      })
    } finally {
      localStorage.removeItem('chis_admin_token')
    }
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      method: 'GET',
      headers: getHeaders(false),
      credentials: 'include',
    })
    return await handleResponse(res)
  },

  async forgotPassword(email) {
    const res = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    return await handleResponse(res)
  },

  async resetPassword(token, password, confirmPassword) {
    const res = await fetch(`${API_BASE}/auth/reset-password/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, confirmPassword }),
    })
    return await handleResponse(res)
  },

  // Admin Endpoints
  async getDashboardStats() {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      method: 'GET',
      headers: getHeaders(false),
      credentials: 'include',
    })
    return await handleResponse(res)
  },

  async getAdminProperties(params = {}) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        searchParams.append(key, val)
      }
    })
    const res = await fetch(`${API_BASE}/admin/properties?${searchParams.toString()}`, {
      method: 'GET',
      headers: getHeaders(false),
      credentials: 'include',
    })
    return await handleResponse(res)
  },

  async getAdminPropertyById(id) {
    const res = await fetch(`${API_BASE}/admin/properties/${id}`, {
      method: 'GET',
      headers: getHeaders(false),
      credentials: 'include',
    })
    return await handleResponse(res)
  },

  async createProperty(propertyData) {
    const res = await fetch(`${API_BASE}/admin/properties`, {
      method: 'POST',
      headers: getHeaders(true),
      credentials: 'include',
      body: JSON.stringify(propertyData),
    })
    return await handleResponse(res)
  },

  async updateProperty(id, propertyData) {
    const res = await fetch(`${API_BASE}/admin/properties/${id}`, {
      method: 'PATCH',
      headers: getHeaders(true),
      credentials: 'include',
      body: JSON.stringify(propertyData),
    })
    return await handleResponse(res)
  },

  async updatePropertyStatus(id, { status, isActive }) {
    const res = await fetch(`${API_BASE}/admin/properties/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(true),
      credentials: 'include',
      body: JSON.stringify({ status, isActive }),
    })
    return await handleResponse(res)
  },

  async archiveOrDeleteProperty(id, permanent = false) {
    const res = await fetch(`${API_BASE}/admin/properties/${id}?permanent=${permanent}`, {
      method: 'DELETE',
      headers: getHeaders(false),
      credentials: 'include',
    })
    return await handleResponse(res)
  },

  async getAuditLogs(params = {}) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        searchParams.append(key, val)
      }
    })
    const res = await fetch(`${API_BASE}/admin/audit-logs?${searchParams.toString()}`, {
      method: 'GET',
      headers: getHeaders(false),
      credentials: 'include',
    })
    return await handleResponse(res)
  },

  async getHealth() {
    const res = await fetch(`${API_BASE}/health`)
    return await handleResponse(res)
  },
}
