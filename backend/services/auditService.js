import { AuditLog } from '../models/AuditLog.js'

export const logAudit = async ({
  req = null,
  user = null,
  action,
  targetType = 'PROPERTY',
  targetId = '',
  targetName = '',
  details = {},
}) => {
  try {
    const actorUser = user || (req && req.user) || null
    const ipAddress =
      (req && (req.headers['x-forwarded-for'] || req.socket?.remoteAddress)) || '127.0.0.1'
    const userAgent = (req && req.headers['user-agent']) || 'Unknown'

    const logEntry = new AuditLog({
      user: actorUser?._id || null,
      userName: actorUser?.name || 'System / Anonymous',
      userEmail: actorUser?.email || '',
      userRole: actorUser?.role || 'system',
      action,
      targetType,
      targetId: String(targetId || ''),
      targetName: String(targetName || ''),
      details,
      ipAddress: String(ipAddress),
      userAgent: String(userAgent),
    })

    await logEntry.save()
    return logEntry
  } catch (error) {
    // Audit logging failure should not break the main transaction, but should be reported
    console.error('⚠️ [AuditLog] Failed to record audit log:', error.message)
    return null
  }
}
