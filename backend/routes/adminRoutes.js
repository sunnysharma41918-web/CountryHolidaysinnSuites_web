import express from 'express'
import {
  getAdminProperties,
  getAdminPropertyById,
  createProperty,
  updateProperty,
  updatePropertyStatus,
  archiveOrDeleteProperty,
} from '../controllers/adminPropertyController.js'
import { getDashboardStats } from '../controllers/statsController.js'
import { getAuditLogs } from '../controllers/auditLogController.js'
import { protect } from '../middleware/auth.js'
import { authorizeRoles } from '../middleware/roles.js'
import { validatePropertyInput } from '../validators/propertyValidator.js'

const router = express.Router()

// All admin routes require authentication and at least active editor/admin privileges
router.use(protect)

// Dashboard statistics
router.get('/stats', getDashboardStats)

// Audit logs
router.get('/audit-logs', authorizeRoles('super_admin', 'admin'), getAuditLogs)

// Property CRUD & management
router.get('/properties', getAdminProperties)
router.get('/properties/:id', getAdminPropertyById)
router.post('/properties', validatePropertyInput(false), createProperty)
router.patch('/properties/:id', validatePropertyInput(true), updateProperty)
router.patch('/properties/:id/status', updatePropertyStatus)
router.delete('/properties/:id', archiveOrDeleteProperty)

export default router
