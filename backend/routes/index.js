import express from 'express'
import authRoutes from './authRoutes.js'
import propertyRoutes from './propertyRoutes.js'
import adminRoutes from './adminRoutes.js'
import { getDBStatus } from '../config/db.js'

const router = express.Router()

router.get('/health', (req, res) => {
  const db = getDBStatus()
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      connected: db.isConnected,
      state: db.readyState === 1 ? 'connected' : db.readyState === 2 ? 'connecting' : 'disconnected',
    },
  })
})

router.use('/auth', authRoutes)
router.use('/properties', propertyRoutes)
router.use('/admin', adminRoutes)

export default router
