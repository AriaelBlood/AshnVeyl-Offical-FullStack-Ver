import mongoose from 'mongoose'
import { Project } from '../models/Project.js'

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Public: List projects (optionally filtered by category)
 */
export async function getProjects(req, res, next) {
  try {
    const { category } = req.query
    const filter = {}

    if (category && ['games', 'art', 'motion'].includes(category)) {
      filter.category = category
    }

    const projects = await Project.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .select('-__v')
      .lean()

    res.json(projects)
  } catch (err) {
    next(err)
  }
}

/**
 * Public: Get single project by string ID or ObjectId
 */
export async function getProjectById(req, res, next) {
  try {
    const { id } = req.params
    const isObjectId = mongoose.Types.ObjectId.isValid(id)

    const query = isObjectId ? { $or: [{ id }, { _id: id }] } : { id }
    const project = await Project.findOne(query).select('-__v').lean()

    if (!project) {
      return res.status(404).json({ error: 'Project not found in the codex.' })
    }

    res.json(project)
  } catch (err) {
    next(err)
  }
}

/**
 * Protected: Create project
 */
export async function createProject(req, res, next) {
  try {
    const body = { ...req.body }

    if (!body.title) {
      return res.status(400).json({ error: 'Title is required.' })
    }

    if (!body.id) {
      body.id = slugify(body.title)
    } else {
      body.id = slugify(body.id)
    }

    if (body.order == null) {
      const highest = await Project.findOne().sort({ order: -1 }).select('order')
      body.order = (highest?.order || 0) + 1
    }

    const newProject = await Project.create(body)
    res.status(201).json(newProject)
  } catch (err) {
    next(err)
  }
}

/**
 * Protected: Update project
 */
export async function updateProject(req, res, next) {
  try {
    const { id } = req.params
    const update = { ...req.body }
    const isObjectId = mongoose.Types.ObjectId.isValid(id)

    if (update.id) {
      update.id = slugify(update.id)
    }

    const query = isObjectId ? { $or: [{ id }, { _id: id }] } : { id }

    const updated = await Project.findOneAndUpdate(query, update, {
      returnDocument: 'after',
      runValidators: true,
    })

    if (!updated) {
      return res.status(404).json({ error: 'Project not found.' })
    }

    res.json(updated)
  } catch (err) {
    next(err)
  }
}

/**
 * Protected: Delete project
 */
export async function deleteProject(req, res, next) {
  try {
    const { id } = req.params
    const isObjectId = mongoose.Types.ObjectId.isValid(id)

    const query = isObjectId ? { $or: [{ id }, { _id: id }] } : { id }
    const deleted = await Project.findOneAndDelete(query)

    if (!deleted) {
      return res.status(404).json({ error: 'Project not found.' })
    }

    res.json({ ok: true, message: `Project "${deleted.title}" removed from the codex.` })
  } catch (err) {
    next(err)
  }
}
