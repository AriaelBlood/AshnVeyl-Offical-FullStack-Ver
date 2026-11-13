import mongoose from 'mongoose'

export async function connectDB() {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    console.error('[Database] Error: MONGODB_URI is not set in environment.')
    process.exit(1)
  }

  try {
    const conn = await mongoose.connect(uri)
    console.log(`[Database] MongoDB Atlas connected: ${conn.connection.host}/${conn.connection.name}`)
  } catch (err) {
    console.error('[Database] Connection failed:', err.message)
    process.exit(1)
  }

  mongoose.connection.on('disconnected', () => {
    console.warn('[Database] Disconnected from MongoDB Atlas')
  })

  mongoose.connection.on('error', (err) => {
    console.error('[Database] Connection error:', err.message)
  })
}
