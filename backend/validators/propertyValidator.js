import validator from 'validator'

const ALLOWED_SOURCES = ['VIA_OTA', 'VIA_OTA_EXCHANGE']
const ALLOWED_STATUSES = ['draft', 'published', 'archived']
const ALLOWED_SYNC_STATUSES = ['SYNCED', 'PENDING', 'NOT_APPLICABLE', 'FAILED']

export const isValidUrl = (urlStr) => {
  if (!urlStr || typeof urlStr !== 'string') return false
  return validator.isURL(urlStr.trim(), {
    protocols: ['http', 'https'],
    require_protocol: true,
  })
}

export const validatePropertyInput = (isUpdate = false) => {
  return (req, res, next) => {
    const body = req.body || {}
    const errors = []

    // Name validation
    if (!isUpdate || body.name !== undefined) {
      if (!body.name || String(body.name).trim().length < 2) {
        errors.push('Property name must be at least 2 characters')
      } else if (String(body.name).trim().length > 200) {
        errors.push('Property name cannot exceed 200 characters')
      }
    }

    // Slug validation (if provided)
    if (body.slug !== undefined) {
      const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
      if (!slugPattern.test(String(body.slug).trim())) {
        errors.push('Slug must be in lowercase-hyphenated format (e.g. grand-resort-agra)')
      }
    }

    // Source validation
    if (body.source !== undefined && !ALLOWED_SOURCES.includes(body.source)) {
      errors.push(`Source must be one of: ${ALLOWED_SOURCES.join(', ')}`)
    }

    // Status validation
    if (body.status !== undefined && !ALLOWED_STATUSES.includes(body.status)) {
      errors.push(`Status must be one of: ${ALLOWED_STATUSES.join(', ')}`)
    }

    // External Sync Status validation
    if (body.externalSyncStatus !== undefined && !ALLOWED_SYNC_STATUSES.includes(body.externalSyncStatus)) {
      errors.push(`External sync status must be one of: ${ALLOWED_SYNC_STATUSES.join(', ')}`)
    }

    // Destination validation
    if (!isUpdate || body.destination !== undefined) {
      if (!body.destination || String(body.destination).trim().length === 0) {
        errors.push('Destination (e.g. Agra, Hawaii, Big Sur) is required')
      }
    }

    // Location validation
    if (!isUpdate || body.location !== undefined) {
      if (!body.location || String(body.location).trim().length === 0) {
        errors.push('Location is required')
      }
    }

    // Description validation
    if (!isUpdate || body.description !== undefined) {
      if (!body.description || String(body.description).trim().length < 10) {
        errors.push('Description must be at least 10 characters long')
      }
    }

    // Cover Image URL validation
    if (!isUpdate || body.image !== undefined) {
      if (!body.image || !isValidUrl(body.image)) {
        errors.push('A valid HTTP/HTTPS Cover Image URL is required')
      }
    }

    // Gallery URLs validation
    if (body.gallery !== undefined) {
      if (!Array.isArray(body.gallery)) {
        errors.push('Gallery must be an array of image URLs')
      } else {
        const invalidUrls = body.gallery.filter((url) => !isValidUrl(url))
        if (invalidUrls.length > 0) {
          errors.push(`Found ${invalidUrls.length} invalid image URL(s) in gallery`)
        }
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Property validation failed',
        errors,
      })
    }

    // Whitelist only safe payload fields to prevent mass assignment
    const sanitized = {}
    const allowedKeys = [
      'internalId',
      'name',
      'slug',
      'source',
      'externalId',
      'externalSyncStatus',
      'externalSyncNotes',
      'destination',
      'location',
      'city',
      'state',
      'country',
      'address',
      'mapQuery',
      'description',
      'destinationDescription',
      'knowYourDestination',
      'highlights',
      'amenities',
      'image',
      'gallery',
      'contactDetails',
      'status',
      'isActive',
      'featured',
      'sortOrder',
    ]

    for (const key of allowedKeys) {
      if (body[key] !== undefined) {
        sanitized[key] = body[key]
      }
    }

    req.sanitizedBody = sanitized
    next()
  }
}
