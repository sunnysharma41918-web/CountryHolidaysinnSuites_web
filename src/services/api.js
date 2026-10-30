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
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, email: username, password }),
      })
      if (res.ok) {
        const data = await res.json()
        if (data.token) {
          localStorage.setItem('chis_admin_token', data.token)
        }
        return data
      }
      const data = await res.json().catch(() => ({}))
      if (res.status === 401 || res.status === 403) {
        throw new Error(data.message || 'Invalid username or password credentials')
      }
    } catch (err) {
      if (err.message && err.message.includes('credentials')) {
        throw err
      }
      console.warn('Backend unavailable, using dev admin fallback')
    }

    // Dev/Offline Admin Fallback
    const u = String(username || '').trim().toLowerCase()
    const p = String(password || '').trim()
    if (
      (u === 'admin' || u.startsWith('admin@')) &&
      ['admin', 'admin123', 'admin@123', 'Admin@CHIS2026!', 'password', '123456'].includes(p)
    ) {
      const devToken = `chis_dev_token_${Date.now()}`
      localStorage.setItem('chis_admin_token', devToken)
      return {
        success: true,
        token: devToken,
        user: {
          id: 'dev_admin_001',
          name: 'Principal Administrator',
          email: 'admin@countryholidaysinnsuites.com',
          role: 'super_admin',
          isActive: true,
          lastLogin: new Date().toISOString(),
        },
      }
    }

    throw new Error('Invalid username or password. (Demo Admin: admin / admin)')
  },

  async logout() {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: getHeaders(false),
        credentials: 'include',
      })
    } catch {
      // offline fallback
    } finally {
      localStorage.removeItem('chis_admin_token')
    }
  },

  async getMe() {
    const token = localStorage.getItem('chis_admin_token')
    if (!token) {
      return { success: false, user: null }
    }

    if (token.startsWith('chis_dev_token_')) {
      return {
        success: true,
        user: {
          id: 'dev_admin_001',
          name: 'Principal Administrator',
          email: 'admin@countryholidaysinnsuites.com',
          role: 'super_admin',
          isActive: true,
        },
      }
    }

    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        method: 'GET',
        headers: getHeaders(false),
        credentials: 'include',
      })
      if (res.ok) {
        return await res.json()
      }
    } catch {
      // Fallback
    }

    return {
      success: true,
      user: {
        id: 'dev_admin_001',
        name: 'Principal Administrator',
        email: 'admin@countryholidaysinnsuites.com',
        role: 'super_admin',
        isActive: true,
      },
    }
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
    try {
      const res = await fetch(`${API_BASE}/admin/stats`, {
        method: 'GET',
        headers: getHeaders(false),
        credentials: 'include',
      })
      return await handleResponse(res)
    } catch {
      // Offline fallback computed from local resorts data
      const total = resorts.length
      const destinationStats = [...resorts.reduce((acc, r) => {
        acc.set(r.destination, (acc.get(r.destination) || 0) + 1)
        return acc
      }, new Map())].map(([destination, count]) => ({ destination, count }))

      return {
        success: true,
        stats: {
          totalProperties: total,
          publishedCount: resorts.filter((r) => r.featured).length,
          draftCount: 0,
          archivedCount: 0,
          activeCount: total,
          inactiveCount: 0,
          sourceBreakdown: { VIA_OTA: total, VIA_OTA_EXCHANGE: 0 },
          totalUsers: 1,
          destinationStats,
          recentActivity: [],
          isFallback: true,
        },
      }
    }
  },

  async getAdminProperties(params = {}) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        searchParams.append(key, val)
      }
    })

    try {
      const res = await fetch(`${API_BASE}/admin/properties?${searchParams.toString()}`, {
        method: 'GET',
        headers: getHeaders(false),
        credentials: 'include',
      })
      return await handleResponse(res)
    } catch {
      // Offline fallback from local resorts data
      let filtered = [...resorts]

      if (params.search) {
        const s = String(params.search).toLowerCase()
        filtered = filtered.filter(
          (r) =>
            r.name.toLowerCase().includes(s) ||
            r.slug.toLowerCase().includes(s) ||
            r.destination.toLowerCase().includes(s) ||
            r.location.toLowerCase().includes(s)
        )
      }

      if (params.status && params.status !== 'All') {
        filtered = filtered.filter(() => params.status === 'published')
      }

      if (params.source && params.source !== 'All') {
        filtered = filtered.filter((r) => r.source === params.source)
      }

      if (params.destination && params.destination !== 'All') {
        filtered = filtered.filter(
          (r) => r.destination.toLowerCase() === params.destination.toLowerCase()
        )
      }

      if (params.isActive !== undefined && params.isActive !== 'All') {
        const isActive = params.isActive === 'true'
        filtered = filtered.filter(() => isActive)
      }

      const pageNum = Math.max(1, parseInt(params.page, 10) || 1)
      const limitNum = Math.min(100, Math.max(1, parseInt(params.limit, 10) || 10))
      const skip = (pageNum - 1) * limitNum

      const total = filtered.length
      const paginated = filtered.slice(skip, skip + limitNum)
      const totalPages = Math.ceil(total / limitNum) || 1

      const properties = paginated.map((r) => ({
        _id: r.id,
        id: r.id,
        name: r.name,
        title: r.name,
        slug: r.slug,
        internalId: `CHIS-PROP-${String(r.id).padStart(4, '0')}`,
        externalId: '',
        status: 'published',
        isActive: true,
        source: 'VIA_OTA',
        destination: r.destination,
        location: r.location,
        image: r.image,
        coverImage: r.image,
        gallery: r.gallery || [],
        amenities: r.amenities || [],
        createdAt: new Date().toISOString(),
      }))

      return {
        success: true,
        count: properties.length,
        total,
        page: pageNum,
        totalPages,
        properties,
        isFallback: true,
      }
    }
  },

  async getAdminPropertyById(id) {
    try {
      const res = await fetch(`${API_BASE}/admin/properties/${id}`, {
        method: 'GET',
        headers: getHeaders(false),
        credentials: 'include',
      })
      return await handleResponse(res)
    } catch {
      const resort = resorts.find((r) => String(r.id) === id || r.slug === id)
      if (!resort) {
        throw new Error('Property not found')
      }
      return {
        success: true,
        property: {
          _id: resort.id,
          id: resort.id,
          name: resort.name,
          slug: resort.slug,
          internalId: `CHIS-PROP-${String(resort.id).padStart(4, '0')}`,
          status: 'published',
          isActive: true,
          source: 'VIA_OTA',
          destination: resort.destination,
          location: resort.location,
          image: resort.image,
          gallery: resort.gallery || [],
          amenities: resort.amenities || [],
          description: resort.description,
        },
        auditLogs: [],
        isFallback: true,
      }
    }
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
