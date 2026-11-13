import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import { connectDB } from '../config/db.js'
import { Devlog } from '../models/Devlog.js'
import { Project } from '../models/Project.js'
import { devlogs } from '../../../frontend/src/data/devlogs.js'
import { projects } from '../../../frontend/src/data/projects.js'

async function seed() {
  await connectDB()

  console.log('\n=== AshnVeyl Vault — Mock Data Synchronizer ===')

  // 1. Devlogs
  let devlogsUpserted = 0
  for (const item of devlogs) {
    await Devlog.findOneAndUpdate(
      { slug: item.slug },
      {
        $set: {
          slug: item.slug,
          number: item.number,
          title: item.title,
          date: item.date,
          category: item.category,
          readTime: item.readTime,
          featured: Boolean(item.featured),
          summary: item.summary,
          image: item.image,
          published: Boolean(item.published),
          blocks: item.blocks,
        },
      },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
    )
    devlogsUpserted++
  }
  console.log(`[Devlogs] Synced ${devlogsUpserted} devlogs into Atlas.`)

  // 2. Projects
  let projectsUpserted = 0
  for (let i = 0; i < projects.length; i++) {
    const item = projects[i]
    await Project.findOneAndUpdate(
      { id: item.id },
      {
        $set: {
          id: item.id,
          title: item.title,
          category: item.category,
          type: item.type,
          engine: item.engine,
          status: item.status,
          live: Boolean(item.live),
          description: item.description,
          image: item.image,
          links: item.links,
          devlogLabel: item.devlogLabel,
          order: i,
        },
      },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
    )
    projectsUpserted++
  }
  console.log(`[Projects] Synced ${projectsUpserted} projects into Atlas.`)

  await mongoose.disconnect()
  console.log('[Done] Database is now primed with initial archive records.\n')
  process.exit(0)
}

seed().catch((err) => {
  console.error('[Error] Seed failed:', err)
  process.exit(1)
})
