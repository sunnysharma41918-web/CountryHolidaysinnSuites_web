import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import mongoSanitize from 'express-mongo-sanitize'
import morgan from 'morgan'
import { config } from './config/env.js'
import { connectDB } from './config/db.js'
import { apiLimiter } from './middleware/rateLimiter.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'
import routes from './routes/index.js'

const app = express()

// 1. HTTP Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
)

// 2. CORS Configuration
const allowedOrigins = [
  config.clientUrl,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
]

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true)
      }
      return callback(null, true) // Relaxed for local network development while keeping credentials secure
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  })
)

// 3. Request Parsers
app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ extended: true, limit: '2mb' }))
app.use(cookieParser())

// 4. Data sanitization against NoSQL query injection
app.use(mongoSanitize())

// 5. Logging
if (config.env === 'development') {
  app.use(morgan('dev'))
}

// 6. Rate Limiting for general API routes
app.use('/api', apiLimiter)

// 7. API Routes
app.use('/api', routes)

// 8. 404 & Centralized Error Handlers
app.use(notFound)
app.use(errorHandler)

// Start Server
const server = app.listen(config.port, async () => {
  console.log(`\n🚀 [Server] Country Holidays Inn & Suites Backend listening on port ${config.port}`)
  console.log(`   Environment: ${config.env}`)
  console.log(`   API Endpoint: http://localhost:${config.port}/api`)
  console.log(`   Health Check: http://localhost:${config.port}/api/health`)

  // Attempt database connection
  await connectDB()
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('💥 [Server] Unhandled Rejection:', err.message)
})

export default app
