import mongoose from 'mongoose'

const auditLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    userName: {
      type: String,
      default: 'System',
    },
    userEmail: {
      type: String,
      default: '',
    },
    userRole: {
      type: String,
      default: 'system',
    },
    action: {
      type: String,
      required: true,
      index: true,
    },
    targetType: {
      type: String,
      enum: ['PROPERTY', 'USER', 'AUTH', 'SYSTEM'],
      default: 'PROPERTY',
      index: true,
    },
    targetId: {
      type: String,
      default: '',
      index: true,
    },
    targetName: {
      type: String,
      default: '',
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ipAddress: {
      type: String,
      default: '',
    },
    userAgent: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    bufferCommands: false,
  }
)

auditLogSchema.index({ createdAt: -1 })
auditLogSchema.index({ targetType: 1, targetId: 1 })

export const AuditLog = mongoose.model('AuditLog', auditLogSchema)
