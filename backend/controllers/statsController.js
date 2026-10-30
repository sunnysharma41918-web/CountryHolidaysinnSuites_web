import mongoose from 'mongoose'
import { Property } from '../models/Property.js'
import { AuditLog } from '../models/AuditLog.js'
import { User } from '../models/User.js'
import { defaultResorts } from '../data/defaultResorts.js'

export const getDashboardStats = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const total = defaultResorts.length
      const destinationStats = [...defaultResorts.reduce((acc, r) => {
        acc.set(r.destination, (acc.get(r.destination) || 0) + 1)
        return acc
      }, new Map())].map(([destination, count]) => ({ _id: destination, count }))

      return res.status(200).json({
        success: true,
        stats: {
          totalProperties: total,
          publishedCount: defaultResorts.filter((r) => r.status === 'published').length,
          draftCount: 0,
          archivedCount: 0,
          activeCount: total,
          inactiveCount: 0,
          sourceBreakdown: { VIA_OTA: defaultResorts.filter((r) => r.source === 'VIA_OTA').length, VIA_OTA_EXCHANGE: defaultResorts.filter((r) => r.source === 'VIA_OTA_EXCHANGE').length },
          totalUsers: 1,
          destinationStats,
          recentActivity: [],
          isFallback: true,
        },
      })
    }

    const [
      totalProperties,
      publishedCount,
      draftCount,
      archivedCount,
      activeCount,
      viaOtaCount,
      viaOtaExchangeCount,
      totalUsers,
      recentAuditLogs,
      destinationStats,
    ] = await Promise.all([
      Property.countDocuments(),
      Property.countDocuments({ status: 'published' }),
      Property.countDocuments({ status: 'draft' }),
      Property.countDocuments({ status: 'archived' }),
      Property.countDocuments({ isActive: true }),
      Property.countDocuments({ source: 'VIA_OTA' }),
      Property.countDocuments({ source: 'VIA_OTA_EXCHANGE' }),
      User.countDocuments({ isActive: true }),
      AuditLog.find().sort({ createdAt: -1 }).limit(8),
      Property.aggregate([
        { $group: { _id: '$destination', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 6 },
      ]),
    ])

    const effectiveTotal = totalProperties || defaultResorts.length
    const effectivePublished = totalProperties ? publishedCount : defaultResorts.filter((r) => r.status === 'published').length
    const effectiveActive = totalProperties ? activeCount : defaultResorts.length

    res.status(200).json({
      success: true,
      stats: {
        totalProperties: effectiveTotal,
        publishedCount: effectivePublished,
        draftCount,
        archivedCount,
        activeCount: effectiveActive,
        sourceBreakdown: {
          VIA_OTA: viaOtaCount || defaultResorts.filter((r) => r.source === 'VIA_OTA').length,
          VIA_OTA_EXCHANGE: viaOtaExchangeCount || defaultResorts.filter((r) => r.source === 'VIA_OTA_EXCHANGE').length,
        },
        totalUsers: totalUsers || 1,
        destinationStats: destinationStats.length ? destinationStats : [...defaultResorts.reduce((acc, r) => {
          acc.set(r.destination, (acc.get(r.destination) || 0) + 1)
          return acc
        }, new Map())].map(([destination, count]) => ({ _id: destination, count })),
        recentActivity: recentAuditLogs,
      },
    })
    return
    // (legacy below)
    const effectiveTotal = totalProperties || defaultResorts.length
    const effectivePublished = totalProperties ? publishedCount : defaultResorts.filter((r) => r.status === 'published').length
    const effectiveActive = totalProperties ? activeCount : defaultResorts.length

    res.status(200).json({
      success: true,
      stats: {
        totalProperties: effectiveTotal,
        publishedCount: effectivePublished,
        draftCount,
        archivedCount,
        activeCount: effectiveActive,
        sourceBreakdown: {
          VIA_OTA: viaOtaCount || defaultResorts.filter((r) => r.source === 'VIA_OTA').length,
          VIA_OTA_EXCHANGE: viaOtaExchangeCount || defaultResorts.filter((r) => r.source === 'VIA_OTA_EXCHANGE').length,
        },
        totalUsers: totalUsers || 1,
        destinationStats: destinationStats.length ? destinationStats : [...defaultResorts.reduce((acc, r) => {
          acc.set(r.destination, (acc.get(r.destination) || 0) + 1)
          return acc
        }, new Map())].map(([destination, count]) => ({ _id: destination, count })),
        recentActivity: recentAuditLogs,
      },
    })
    return
    // (legacy below)
    res.status(200).json({
      success: true,
      stats: {
        totalProperties,
        publishedCount,
        draftCount,
        archivedCount,
        activeCount,
        inactiveCount: Math.max(0, totalProperties - activeCount),
        sourceBreakdown: {
          VIA_OTA: viaOtaCount,
          VIA_OTA_EXCHANGE: viaOtaExchangeCount,
        },
        totalUsers,
        destinationStats: destinationStats.map((item) => ({
          destination: item._id || 'Unassigned',
          count: item.count,
        })),
        recentActivity: recentAuditLogs,
      },
    })
  } catch (error) {
    next(error)
  }
}
