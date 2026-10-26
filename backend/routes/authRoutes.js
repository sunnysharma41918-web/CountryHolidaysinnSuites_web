import express from 'express'
import {
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  listUsers,
} from '../controllers/authController.js'
import { protect } from '../middleware/auth.js'
import { authorizeRoles } from '../middleware/roles.js'
import { authLimiter } from '../middleware/rateLimiter.js'
import {
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
} from '../validators/authValidator.js'

const router = express.Router()

router.post('/login', authLimiter, validateLogin, login)
router.post('/logout', protect, logout)
router.get('/me', protect, getMe)
router.post('/forgot-password', authLimiter, validateForgotPassword, forgotPassword)
router.post('/reset-password/:token', authLimiter, validateResetPassword, resetPassword)
router.get('/users', protect, authorizeRoles('super_admin', 'admin'), listUsers)

export default router
