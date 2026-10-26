import { AuditLog } from '../models/AuditLog.js'

export const getAuditLogs = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      action,
      targetType,
      targetId,
      search,
    } = req.query

    const query = {}

    if (action && action !== 'All') {
      query.action = action
    }

    if (targetType && targetType !== 'All') {
      query.targetType = targetType
    }

    if (targetId) {
      query.targetId = targetId
    }

    if (search && String(search).trim()) {
      const s = String(search).trim()
      const searchRegex = new RegExp(s, 'i')
      query.$or = [
        { userName: searchRegex },
        { userEmail: searchRegex },
        { targetName: searchRegex },
        { action: searchRegex },
      ]
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1)
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20))
    const skip = (pageNum - 1) * limitNum

    const [logs, total] = await Promise.all([
      AuditLog.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      AuditLog.countDocuments(query),
    ])

    const totalPages = Math.ceil(total / limitNum) || 1

    res.status(200).json({
      success: true,
      count: logs.length,
      total,
      page: pageNum,
      totalPages,
      logs,
    })
  } catch (error) {
    next(error)
  }
}
