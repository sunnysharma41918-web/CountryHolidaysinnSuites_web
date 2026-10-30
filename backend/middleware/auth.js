import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
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
    let user = null
    if (mongoose.connection.readyState === 1) {
      try {
        user = await User.findById(decoded.id)
      } catch {
        user = null
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'The account associated with this session no longer exists. Please sign in again.',
        })
      }
    } else {
      // Offline mode: dev fallback for local development without database
      if (decoded.id === 'dev_admin_001' || decoded.role === 'super_admin' || decoded.role === 'admin') {
        user = {
          _id: 'dev_admin_001',
          name: 'Principal Administrator',
          email: decoded.email || 'admin@countryholidaysinnsuites.com',
          role: decoded.role || 'super_admin',
          isActive: true,
        }
      }
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The account associated with this session no longer exists. Please sign in again.',
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
