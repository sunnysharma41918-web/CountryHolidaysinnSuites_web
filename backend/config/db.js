import mongoose from 'mongoose'
import dns from 'dns'
import { config } from './env.js'

// Force Google & Cloudflare DNS to avoid Windows ISP SRV query ECONNREFUSED issues
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4', '1.0.0.1'])
} catch {}

let isConnected = false
let isConnecting = false
let reconnectTimer = null
let listenersAttached = false

const attachConnectionListeners = () => {
  if (listenersAttached) return
  listenersAttached = true

  mongoose.connection.on('connected', () => {
    isConnected = true
    isConnecting = false
    console.log(`✅ [MongoDB Atlas] Connected successfully to host: ${mongoose.connection.host}`)
  })

  mongoose.connection.on('error', (err) => {
    console.error('❌ [MongoDB Atlas] Runtime connection error:', err.message)
    isConnected = false
    isConnecting = false
  })

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ [MongoDB Atlas] Connection disconnected. Initiating automatic reconnect...')
    isConnected = false
    isConnecting = false

    // Auto-reconnect with 5-second backoff
    if (!reconnectTimer) {
      reconnectTimer = setTimeout(async () => {
        reconnectTimer = null
        if (mongoose.connection.readyState !== 1 && !isConnecting) {
          console.log('🔄 [MongoDB Atlas] Reconnecting to cluster now...')
          await connectDB()
        }
      }, 5000)
    }
  })
}

export const connectDB = async () => {
  // If already connected, return current connection
  if (mongoose.connection.readyState === 1) {
    isConnected = true
    return mongoose.connection
  }

  // Prevent multiple concurrent connection attempts
  if (isConnecting) {
    return null
  }

  const uri = config.mongoUri

  if (!uri) {
    console.warn(
      '\n⚠️ [MongoDB Atlas] MONGODB_URI is not set in backend/.env.\n' +
      '  Backend is running in standalone mode with default fallback data.\n'
    )
    return null
  }

  attachConnectionListeners()

  try {
    isConnecting = true
    mongoose.set('strictQuery', true)

    // Ensure reliable DNS before connecting
    try {
      dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4', '1.0.0.1'])
    } catch {}

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      maxPoolSize: 10, // Optimal for MongoDB Atlas M0 Free Tier
      minPoolSize: 2,  // Maintain warm standby connections
      maxIdleTimeMS: 45000, // Close and refresh idle sockets before Atlas terminates them
      heartbeatFrequencyMS: 10000, // Ping replica set monitor every 10s to keep connection warm
      autoIndex: config.env !== 'production',
    })

    isConnected = true
    isConnecting = false
    return conn
  } catch (error) {
    isConnected = false
    isConnecting = false
    console.error(`❌ [MongoDB Atlas] Connection failed: ${error.message}`)

    // Schedule retry if initial connection failed
    if (!reconnectTimer) {
      reconnectTimer = setTimeout(() => {
        reconnectTimer = null
        console.log('🔄 [MongoDB Atlas] Retrying connection after failed attempt...')
        connectDB()
      }, 8000)
    }

    return null
  }
}

export const getDBStatus = () => {
  return {
    isConnected: mongoose.connection.readyState === 1,
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host || null,
    name: mongoose.connection.name || null,
  }
}
