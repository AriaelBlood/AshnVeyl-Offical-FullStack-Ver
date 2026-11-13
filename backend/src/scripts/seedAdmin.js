import dotenv from 'dotenv'
dotenv.config()

import readline from 'readline'
import mongoose from 'mongoose'
import { connectDB } from '../config/db.js'
import { User } from '../models/User.js'

function ask(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) => {
    rl.question(query, (ans) => {
      rl.close()
      resolve(ans.trim())
    })
  })
}

async function run() {
  await connectDB()

  console.log('\n=== AshnVeyl Vault — Admin Account Seeder ===')

  let username = process.argv[2]
  let password = process.argv[3]

  if (!username) {
    username = await ask('Enter admin username (default: ashnveyl): ')
    if (!username) username = 'ashnveyl'
  }

  if (!password) {
    password = await ask('Enter admin password (min 8 characters): ')
  }

  if (!password || password.length < 8) {
    console.error('Error: Password must be at least 8 characters long.')
    await mongoose.disconnect()
    process.exit(1)
  }

  const passwordHash = await User.hashPassword(password)

  const existing = await User.findOne({ username })
  if (existing) {
    existing.passwordHash = passwordHash
    await existing.save()
    console.log(`[Success] Updated credentials for existing admin user: "${username}"`)
  } else {
    await User.create({ username, passwordHash })
    console.log(`[Success] Created new admin user: "${username}"`)
  }

  await mongoose.disconnect()
  console.log('[Done] Seed complete.\n')
  process.exit(0)
}

run().catch((err) => {
  console.error('[Error] Seed failed:', err)
  process.exit(1)
})
