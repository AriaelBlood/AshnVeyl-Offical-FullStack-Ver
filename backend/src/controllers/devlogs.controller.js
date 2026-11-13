import { Devlog } from '../models/Devlog.js'

function formatDisplayDate(d = new Date()) {
  const months = [
    'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER',
  ]
  return `${months[d.getMonth()]} ${String(d.getDate()).padStart(2, '0')}, ${d.getFullYear()}`
}

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Public: List published devlogs
 */
export async function getPublishedDevlogs(req, res, next) {
  try {
    const devlogs = await Devlog.find({ published: true })
      .sort({ publishedAt: -1, number: -1 })
      .select('-__v')
      .lean()

    res.json(devlogs)
  } catch (err) {
    next(err)
  }
}

/**
 * Public (with admin preview): Get single devlog by slug
 */
export async function getDevlogBySlug(req, res, next) {
  try {
    const { slug } = req.params
    const query = { slug }

    // If not authenticated as admin, only return published devlogs
    if (!req.user) {
      query.published = true
    }

    const devlog = await Devlog.findOne(query).select('-__v').lean()

    if (!devlog) {
      return res.status(404).json({
        error: 'Manuscript not found in the archives.',
      })
    }

    res.json(devlog)
  } catch (err) {
    next(err)
  }
}

/**
 * Protected: Admin list of all devlogs (including drafts)
 */
export async function getAllDevlogsAdmin(req, res, next) {
  try {
    const devlogs = await Devlog.find()
      .sort({ createdAt: -1 })
      .select('-__v')
      .lean()

    res.json(devlogs)
  } catch (err) {
    next(err)
  }
}

/**
 * Protected: Create a new devlog
 */
export async function createDevlog(req, res, next) {
  try {
    const body = { ...req.body }

    if (!body.title) {
      return res.status(400).json({ error: 'Title is required.' })
    }

    if (!body.slug) {
      body.slug = slugify(body.title)
    } else {
      body.slug = slugify(body.slug)
    }

    if (!body.number) {
      const highest = await Devlog.findOne().sort({ number: -1 }).select('number')
      body.number = (highest?.number || 0) + 1
    }

    if (!body.date) {
      body.date = formatDisplayDate()
    }

    if (!body.category) {
      body.category = 'ARCHIVE LOG'
    }

    if (!body.summary) {
      // Create quick excerpt from first paragraph block if available
      const firstPara = body.blocks?.find((b) => b.type === 'paragraph')
      body.summary = firstPara?.text?.slice(0, 160) || body.title
    }

    // Only one devlog can be featured
    if (body.featured) {
      await Devlog.updateMany({ featured: true }, { $set: { featured: false } })
    }

    const newDevlog = await Devlog.create(body)
    res.status(201).json(newDevlog)
  } catch (err) {
    next(err)
  }
}

/**
 * Protected: Update an existing devlog
 */
export async function updateDevlog(req, res, next) {
  try {
    const { id } = req.params
    const update = { ...req.body }

    if (update.slug) {
      update.slug = slugify(update.slug)
    }

    if (update.featured) {
      await Devlog.updateMany({ _id: { $ne: id }, featured: true }, { $set: { featured: false } })
    }

    const updated = await Devlog.findByIdAndUpdate(id, update, {
      returnDocument: 'after',
      runValidators: true,
    })

    if (!updated) {
      return res.status(404).json({ error: 'Devlog not found.' })
    }

    res.json(updated)
  } catch (err) {
    next(err)
  }
}

/**
 * Protected: Delete a devlog
 */
export async function deleteDevlog(req, res, next) {
  try {
    const { id } = req.params
    const deleted = await Devlog.findByIdAndDelete(id)

    if (!deleted) {
      return res.status(404).json({ error: 'Devlog not found.' })
    }

    res.json({ ok: true, message: `Devlog "${deleted.title}" deleted from archives.` })
  } catch (err) {
    next(err)
  }
}
