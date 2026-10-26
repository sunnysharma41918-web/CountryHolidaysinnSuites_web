import { Property } from '../models/Property.js'
import { defaultResorts } from '../data/defaultResorts.js'
import mongoose from 'mongoose'

export const getPublicProperties = async (req, res, next) => {
  try {
    const {
      search,
      destination,
      featured,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query

    // Only active and published properties are ever visible to the public
    const query = {
      status: 'published',
      isActive: true,
    }

    if (destination && destination !== 'All') {
      query.destination = new RegExp(`^${destination.trim()}$`, 'i')
    }

    if (featured === 'true') {
      query.featured = true
    }

    if (search && String(search).trim()) {
      const searchRegex = new RegExp(String(search).trim(), 'i')
      query.$or = [
        { name: searchRegex },
        { location: searchRegex },
        { destination: searchRegex },
        { city: searchRegex },
        { state: searchRegex },
      ]
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1)
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20))
    const skip = (pageNum - 1) * limitNum

    const sortObj = {}
    sortObj[sortBy] = order === 'asc' ? 1 : -1

    // If MongoDB is connected and has records
    if (mongoose.connection.readyState === 1) {
      const [properties, total] = await Promise.all([
        Property.find(query)
          .sort(sortObj)
          .skip(skip)
          .limit(limitNum)
          .select('-createdBy -updatedBy -externalSyncNotes'),
        Property.countDocuments(query),
      ])

      if (total > 0) {
        const totalPages = Math.ceil(total / limitNum) || 1
        return res.status(200).json({
          success: true,
          count: properties.length,
          total,
          page: pageNum,
          totalPages,
          properties,
        })
      }
    }

    // Fallback: If DB is not connected or empty, filter from curated default baseline
    let filtered = defaultResorts.filter((item) => item.status === 'published' && item.isActive)

    if (destination && destination !== 'All') {
      filtered = filtered.filter(
        (item) => item.destination.toLowerCase() === destination.trim().toLowerCase()
      )
    }

    if (featured === 'true') {
      filtered = filtered.filter((item) => item.featured)
    }

    if (search && String(search).trim()) {
      const s = String(search).trim().toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(s) ||
          item.location.toLowerCase().includes(s) ||
          item.destination.toLowerCase().includes(s)
      )
    }

    const total = filtered.length
    const paginated = filtered.slice(skip, skip + limitNum)
    const totalPages = Math.ceil(total / limitNum) || 1

    return res.status(200).json({
      success: true,
      count: paginated.length,
      total,
      page: pageNum,
      totalPages,
      properties: paginated,
      isFallback: true,
    })
  } catch (error) {
    next(error)
  }
}

export const getPublicPropertyBySlugOrId = async (req, res, next) => {
  try {
    const { slugOrId } = req.params

    const query = {
      status: 'published',
      isActive: true,
      $or: [{ slug: slugOrId.toLowerCase() }],
    }

    if (mongoose.Types.ObjectId.isValid(slugOrId)) {
      query.$or.push({ _id: slugOrId })
    }

    if (mongoose.connection.readyState === 1) {
      const property = await Property.findOne(query).select('-createdBy -updatedBy -externalSyncNotes')

      if (property) {
        const relatedProperties = await Property.find({
          status: 'published',
          isActive: true,
          destination: property.destination,
          _id: { $ne: property._id },
        })
          .limit(4)
          .select('name slug location image destination amenities highlights')

        return res.status(200).json({
          success: true,
          property,
          relatedProperties,
        })
      }
    }

    // Fallback lookup
    const found = defaultResorts.find(
      (r) =>
        r.slug.toLowerCase() === slugOrId.toLowerCase() ||
        r.internalId?.toLowerCase() === slugOrId.toLowerCase()
    )

    if (!found) {
      return res.status(404).json({
        success: false,
        message: `Property '${slugOrId}' was not found or is currently not published`,
      })
    }

    const related = defaultResorts
      .filter((r) => r.destination === found.destination && r.slug !== found.slug)
      .slice(0, 4)

    res.status(200).json({
      success: true,
      property: found,
      relatedProperties: related,
      isFallback: true,
    })
  } catch (error) {
    next(error)
  }
}
