import { Property } from '../models/Property.js'
import { AuditLog } from '../models/AuditLog.js'
import { logAudit } from '../services/auditService.js'

// Slug generator helper
const slugify = (text) => {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const getAdminProperties = async (req, res, next) => {
  try {
    const {
      search,
      status,
      source,
      destination,
      isActive,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query

    const query = {}

    // Status filter
    if (status && status !== 'All') {
      query.status = status
    }

    // Source filter
    if (source && source !== 'All') {
      query.source = source
    }

    // Destination filter
    if (destination && destination !== 'All') {
      query.destination = new RegExp(`^${destination.trim()}$`, 'i')
    }

    // Active status filter
    if (isActive !== undefined && isActive !== 'All') {
      query.isActive = isActive === 'true'
    }

    // Search filter across multiple fields
    if (search && String(search).trim()) {
      const s = String(search).trim()
      const searchRegex = new RegExp(s, 'i')
      query.$or = [
        { name: searchRegex },
        { slug: searchRegex },
        { internalId: searchRegex },
        { externalId: searchRegex },
        { location: searchRegex },
        { destination: searchRegex },
      ]
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1)
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10))
    const skip = (pageNum - 1) * limitNum

    const sortObj = {}
    sortObj[sortBy] = order === 'asc' ? 1 : -1

    const [properties, total] = await Promise.all([
      Property.find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(limitNum)
        .populate('createdBy', 'name email')
        .populate('updatedBy', 'name email'),
      Property.countDocuments(query),
    ])

    const totalPages = Math.ceil(total / limitNum) || 1

    res.status(200).json({
      success: true,
      count: properties.length,
      total,
      page: pageNum,
      totalPages,
      properties,
    })
  } catch (error) {
    next(error)
  }
}

export const getAdminPropertyById = async (req, res, next) => {
  try {
    const { id } = req.params

    const property = await Property.findById(id)
      .populate('createdBy', 'name email role')
      .populate('updatedBy', 'name email role')

    if (!property) {
      return res.status(404).json({
        success: false,
        message: `Property with ID '${id}' not found`,
      })
    }

    // Fetch related audit logs for this specific property
    const auditLogs = await AuditLog.find({
      targetType: 'PROPERTY',
      targetId: property._id.toString(),
    })
      .sort({ createdAt: -1 })
      .limit(20)

    res.status(200).json({
      success: true,
      property,
      auditLogs,
    })
  } catch (error) {
    next(error)
  }
}

export const createProperty = async (req, res, next) => {
  try {
    const payload = req.sanitizedBody || req.body

    // Ensure slug
    let slug = payload.slug ? slugify(payload.slug) : slugify(payload.name)

    // Check slug uniqueness
    const existingProperty = await Property.findOne({ slug })
    if (existingProperty) {
      slug = `${slug}-${Math.floor(100 + Math.random() * 900)}`
    }
    payload.slug = slug

    // Assign author
    payload.createdBy = req.user._id
    payload.updatedBy = req.user._id

    const property = new Property(payload)
    await property.save()

    // Record audit log
    await logAudit({
      req,
      user: req.user,
      action: 'PROPERTY_CREATE',
      targetType: 'PROPERTY',
      targetId: property._id.toString(),
      targetName: property.name,
      details: {
        slug: property.slug,
        status: property.status,
        source: property.source,
        externalId: property.externalId,
        destination: property.destination,
      },
    })

    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      property,
    })
  } catch (error) {
    next(error)
  }
}

export const updateProperty = async (req, res, next) => {
  try {
    const { id } = req.params
    const payload = req.sanitizedBody || req.body

    const property = await Property.findById(id)
    if (!property) {
      return res.status(404).json({
        success: false,
        message: `Property with ID '${id}' not found`,
      })
    }

    // Handle slug change if provided
    if (payload.slug && payload.slug !== property.slug) {
      const cleanSlug = slugify(payload.slug)
      const existing = await Property.findOne({ slug: cleanSlug, _id: { $ne: id } })
      if (existing) {
        return res.status(409).json({
          success: false,
          message: `Slug '${cleanSlug}' is already in use by another property. Please choose a unique slug.`,
        })
      }
      payload.slug = cleanSlug
    }

    // Calculate diff for audit log
    const changedFields = {}
    for (const key of Object.keys(payload)) {
      if (JSON.stringify(property[key]) !== JSON.stringify(payload[key])) {
        changedFields[key] = {
          from: property[key],
          to: payload[key],
        }
      }
    }

    // Apply updates
    Object.assign(property, payload)
    property.updatedBy = req.user._id
    await property.save()

    // Record audit log if there were changes
    if (Object.keys(changedFields).length > 0) {
      await logAudit({
        req,
        user: req.user,
        action: 'PROPERTY_UPDATE',
        targetType: 'PROPERTY',
        targetId: property._id.toString(),
        targetName: property.name,
        details: { changes: changedFields },
      })
    }

    res.status(200).json({
      success: true,
      message: 'Property updated successfully',
      property,
    })
  } catch (error) {
    next(error)
  }
}

export const updatePropertyStatus = async (req, res, next) => {
  try {
    const { id } = req.params
    const { status, isActive } = req.body

    const property = await Property.findById(id)
    if (!property) {
      return res.status(404).json({
        success: false,
        message: `Property with ID '${id}' not found`,
      })
    }

    const previousStatus = property.status
    const previousIsActive = property.isActive

    if (status !== undefined) {
      if (!['draft', 'published', 'archived'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Status must be one of: draft, published, archived',
        })
      }
      property.status = status
    }

    if (isActive !== undefined) {
      property.isActive = Boolean(isActive)
    }

    property.updatedBy = req.user._id
    await property.save()

    await logAudit({
      req,
      user: req.user,
      action: 'PROPERTY_STATUS_CHANGE',
      targetType: 'PROPERTY',
      targetId: property._id.toString(),
      targetName: property.name,
      details: {
        from: { status: previousStatus, isActive: previousIsActive },
        to: { status: property.status, isActive: property.isActive },
      },
    })

    res.status(200).json({
      success: true,
      message: `Property status updated to '${property.status}' (Active: ${property.isActive})`,
      property,
    })
  } catch (error) {
    next(error)
  }
}

export const archiveOrDeleteProperty = async (req, res, next) => {
  try {
    const { id } = req.params
    const { permanent = false } = req.query

    const property = await Property.findById(id)
    if (!property) {
      return res.status(404).json({
        success: false,
        message: `Property with ID '${id}' not found`,
      })
    }

    // Permanent hard delete is restricted to super_admin
    if (permanent === 'true') {
      if (req.user.role !== 'super_admin') {
        return res.status(403).json({
          success: false,
          message: 'Permanent deletion requires super_admin role privileges.',
        })
      }

      await Property.findByIdAndDelete(id)

      await logAudit({
        req,
        user: req.user,
        action: 'PROPERTY_PERMANENT_DELETE',
        targetType: 'PROPERTY',
        targetId: id,
        targetName: property.name,
        details: {
          snapshot: {
            name: property.name,
            slug: property.slug,
            internalId: property.internalId,
            destination: property.destination,
          },
        },
      })

      return res.status(200).json({
        success: true,
        message: `Property '${property.name}' permanently deleted from database.`,
      })
    }

    // Default: Safe archive
    const previousStatus = property.status
    property.status = 'archived'
    property.isActive = false
    property.updatedBy = req.user._id
    await property.save()

    await logAudit({
      req,
      user: req.user,
      action: 'PROPERTY_ARCHIVE',
      targetType: 'PROPERTY',
      targetId: property._id.toString(),
      targetName: property.name,
      details: { previousStatus, newStatus: 'archived' },
    })

    res.status(200).json({
      success: true,
      message: `Property '${property.name}' has been safely archived.`,
      property,
    })
  } catch (error) {
    next(error)
  }
}
