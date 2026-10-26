import jwt from 'jsonwebtoken'
import { config } from '../config/env.js'
import { User } from '../models/User.js'

export const protect = async (req, res, next) => {
  try {
    let token = null

    // 1. Check HttpOnly cookie
    if (req.cookies && req.cookies.chis_admin_token) {
      token = req.cookies.chis_admin_token
    }

    // 2. Check Authorization header fallback (Bearer <token>)
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please sign in to access this resource.',
      })
    }

    // 3. Verify token
    let decoded
    try {
      decoded = jwt.verify(token, config.jwtSecret)
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Your session has expired. Please sign in again.',
          code: 'TOKEN_EXPIRED',
        })
      }
      return res.status(401).json({
        success: false,
        message: 'Invalid authorization token. Please sign in again.',
      })
    }

    // 4. Ensure user exists and is active in database
    const user = await User.findById(decoded.id)
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The account associated with this session no longer exists.',
      })
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account is deactivated. Please contact the administrator.',
      })
    }

    // Attach user to request
    req.user = user
    next()
  } catch (error) {
    next(error)
  }
}
