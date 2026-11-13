import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import { connectDB } from './config/db.js'
import { errorHandler } from './middleware/errorHandler.js'
import authRoutes from './routes/auth.routes.js'
import devlogsRoutes from './routes/devlogs.routes.js'
import projectsRoutes from './routes/projects.routes.js'
import notificationsRoutes from './routes/notifications.routes.js'

const app = express()
const PORT = process.env.PORT || 5000
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173'

// Core middlewares
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  }),
)
app.use(express.json({ limit: '2mb' }))
app.use(cookieParser())

// Health check endpoint
app.get('/api/health', (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1
  res.json({
    status: 'alive',
    timestamp: new Date().toISOString(),
    database: isDbConnected ? 'connected' : 'disconnected',
    databaseName: mongoose.connection.name || null,
  })
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/devlogs', devlogsRoutes)
app.use('/api/projects', projectsRoutes)
app.use('/api/notifications', notificationsRoutes)

// Centralized error handler
app.use(errorHandler)

// Start server after connecting to database
export async function startServer() {
  await connectDB()

  return app.listen(PORT, () => {
    console.log(`[Server] AshnVeyl Vault API listening on port ${PORT}`)
    console.log(`[Server] Allowed client origin: ${CLIENT_ORIGIN}`)
  })
}

// Only auto-start when executed directly via node backend/src/server.js
if (process.argv[1] && process.argv[1].endsWith('server.js')) {
  startServer()
}

export { app }
export default app
