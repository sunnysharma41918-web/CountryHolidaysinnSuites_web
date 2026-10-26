import { Property } from '../models/Property.js'
import { AuditLog } from '../models/AuditLog.js'
import { User } from '../models/User.js'

export const getDashboardStats = async (req, res, next) => {
  try {
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
