import mongoose from 'mongoose'
import dns from 'dns'
import { config } from './env.js'

try {
  dns.setServers(['8.8.8.8', '1.1.1.1'])
} catch {}

let isConnected = false

export const connectDB = async () => {
  if (isConnected) {
    return mongoose.connection
  }

  const uri = config.mongoUri

  if (!uri) {
    console.warn(
      '\n⚠️ [MongoDB Atlas] MONGODB_URI is not set in backend/.env.\n' +
      '  To connect to MongoDB Atlas Free Tier:\n' +
      '  1. Create a cluster on https://cloud.mongodb.com\n' +
      '  2. Create a database user and whitelist your IP (or 0.0.0.0/0)\n' +
      '  3. Set MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxx.mongodb.net/chis_db?retryWrites=true&w=majority in backend/.env\n' +
      '  Backend will start in standalone/offline mode for now.\n'
    )
    return null
  }

  try {
    mongoose.set('strictQuery', true)
    mongoose.set('bufferCommands', false)

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10, // Ideal for Atlas Free Tier (M0 limit is 500 connections)
      bufferCommands: false, // Fail fast instead of buffering and timing out after 10s
    })

    isConnected = true
    console.log(`✅ [MongoDB Atlas] Connected successfully to host: ${conn.connection.host}`)

    mongoose.connection.on('error', (err) => {
      console.error('❌ [MongoDB Atlas] Runtime connection error:', err.message)
      isConnected = false
    })

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ [MongoDB Atlas] Connection disconnected. Attempting reconnect...')
      isConnected = false
    })

    return conn
  } catch (error) {
    console.error(`❌ [MongoDB Atlas] Initial connection failed: ${error.message}`)
    console.warn('  Ensure your MongoDB Atlas credentials, cluster name, and IP whitelist are correct.')
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
